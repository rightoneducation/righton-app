import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { IAPIClients } from '../api';
import { AssessmentType } from '../AWSAPI';
import {
  MicroCoachDataStatus,
  ScreenSize,
  UserStatusType,
} from '../lib/MicroCoachModels';
import {
  IUploadActions,
  IUploadState,
  UPLOAD_BASE_PATH,
  UploadStepProps,
  emptyUploadState,
  isFileReady,
  validateUploadFile,
} from '../lib/UploadModels';
import { currentSchoolWeek, schoolWeeks } from '../lib/weeks';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import UploadConfirmDialog from '../components/UploadConfirmDialog';
import UploadMiu from '../pages/UploadMiu';
import UploadMiuReview from '../pages/UploadMiuReview';
import UploadMiuSubmitted from '../pages/UploadMiuSubmitted';

/**
 * An MIU upload: set up and upload, review, then submitted. `kind` picks
 * which: the class's first upload (PPQ, /upload-miu) or the one after running
 * the activity (POST_PPQ, /upload-reassess). Each `<path>/*` is one route match (same arrangement as SignUpWizard), so the picked files
 * survive "Back to upload" from the review step without a provider above both.
 *
 * Files stay in the browser until "Submit files for analysis": that uploads
 * both to S3 and starts the analysis (UploadAPIClient).
 */

interface UploadFlowProps {
  apiClients: IAPIClients;
  screenSize: ScreenSize;
  classrooms: UseClassroomsResult;
  kind: AssessmentType;
}

export default function UploadFlow({
  apiClients,
  screenSize,
  classrooms,
  kind,
}: UploadFlowProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const step = useParams()['*'] ?? '';
  const { userProfile, userStatus } = useMicroCoachDataState();
  const basePath = UPLOAD_BASE_PATH[kind];

  // Class and week arrive pre-filled from the dashboard: the class through the
  // shared selection, the week through router state.
  const [upload, setUpload] = useState<IUploadState>(() => {
    const passedWeek = (location.state as { weekStart?: string } | null)
      ?.weekStart;
    return emptyUploadState(
      null,
      passedWeek && schoolWeeks().includes(passedWeek)
        ? passedWeek
        : currentSchoolWeek(),
    );
  });

  // Until the teacher picks one here, the class follows the dashboard's
  // selection, which may still be loading when the flow mounts.
  const classId = upload.classId ?? classrooms.selectedClassroomId ?? '';

  const actions: IUploadActions = {
    setClass: (nextClassId) => {
      setUpload((s) => ({ ...s, classId: nextClassId }));
      // Keep the app-wide selection in step, as the dashboard picker does.
      classrooms.selectClassroom(nextClassId);
    },
    setWeek: (weekStart) => setUpload((s) => ({ ...s, weekStart })),
    pickFile: (slot, file) => {
      const error = validateUploadFile(slot, file);
      setUpload((s) => ({
        ...s,
        [slot]: { name: file.name, file: error ? null : file, error },
      }));
    },
    clearFile: (slot) => setUpload((s) => ({ ...s, [slot]: null })),
    submit: async () => {
      const { exemplar, responses } = upload;
      if (!classId || !exemplar?.file || !responses?.file) return false;
      setUpload((s) => ({ ...s, submitStatus: 'SUBMITTING', submitError: null }));

      let keys: { docxKey: string; xlsxKey: string };
      try {
        const [docxKey, xlsxKey] = await Promise.all([
          apiClients.upload.uploadFile(classId, exemplar.file),
          apiClients.upload.uploadFile(classId, responses.file),
        ]);
        keys = { docxKey, xlsxKey };
      } catch (error) {
        console.error('Could not upload the MIU files', error);
        setUpload((s) => ({ ...s, submitStatus: 'ERROR', submitError: 'UPLOAD' }));
        return false;
      }

      try {
        await apiClients.upload.startAnalysis({
          classroomId: classId,
          ...keys,
          assessmentType: kind,
        });
      } catch (error) {
        console.error('Could not start the analysis', error);
        // The files are in S3 but nothing will read them: take them back out.
        await Promise.all(
          [keys.docxKey, keys.xlsxKey].map((key) =>
            apiClients.upload.removeFile(key).catch(() => undefined),
          ),
        );
        setUpload((s) => ({ ...s, submitStatus: 'ERROR', submitError: 'ANALYSIS' }));
        return false;
      }

      setUpload((s) => ({ ...s, submitStatus: 'IDLE', submission: keys }));
      return true;
    },
    startOver: async () => {
      const { submission } = upload;
      if (submission) {
        await Promise.all(
          [submission.docxKey, submission.xlsxKey].map((key) =>
            apiClients.upload.removeFile(key).catch((error) => {
              console.error('Could not remove an uploaded file', error);
            }),
          ),
        );
      }
      setUpload((s) => emptyUploadState(s.classId, s.weekStart));
      navigate(basePath, { replace: true });
    },
  };

  const stepProps: UploadStepProps = {
    screenSize,
    kind,
    basePath,
    upload: { ...upload, classId },
    actions,
    classrooms: classrooms.classrooms,
    areClassesLoading:
      classrooms.status === MicroCoachDataStatus.LOADING ||
      classrooms.status === MicroCoachDataStatus.IDLE,
    teacher: userProfile,
  };

  // rev5 Upload_Leave*: leaving the setup page asks first, worded by how far
  // the teacher got. Continue to the review stays inside the flow, so it is
  // not a leave; the review and submitted steps have no frame, so they don't
  // ask.
  const isExemplarReady = isFileReady(upload.exemplar);
  const isResponsesReady = isFileReady(upload.responses);
  const readyCount = Number(isExemplarReady) + Number(isResponsesReady);
  let leaveVariant: 'none' | 'partial' | 'ready' = 'ready';
  if (readyCount === 0) leaveVariant = 'none';
  else if (readyCount === 1) leaveVariant = 'partial';
  // Logging out signs out first, then navigates; that navigation must not
  // stop to ask about an upload the teacher can no longer finish.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      userStatus === UserStatusType.LOGGEDIN &&
      currentLocation.pathname === basePath &&
      !nextLocation.pathname.startsWith(basePath),
  );
  // A refresh or a closed tab can't be caught by the router, and browsers
  // only offer their own prompt for it; ask whenever a file would be lost.
  const hasPickedFile = !!upload.exemplar?.file || !!upload.responses?.file;
  useEffect(() => {
    if (!hasPickedFile || upload.submission) return undefined;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasPickedFile, upload.submission]);

  const leaveDialog = (
    <UploadConfirmDialog
      open={blocker.state === 'blocked'}
      title={t(`upload.leave.${leaveVariant}.title`)}
      body={t(`upload.leave.${leaveVariant}.body`, {
        added: t(isExemplarReady ? 'upload.exemplar' : 'upload.responses'),
        missing: t(isExemplarReady ? 'upload.responses' : 'upload.exemplar'),
      })}
      confirmLabel={t('upload.leave.confirm')}
      keepLabel={t(`upload.leave.${leaveVariant}.keep`)}
      onConfirm={() => blocker.proceed?.()}
      onKeep={() => blocker.reset?.()}
    />
  );

  // Each later step needs what the one before it produced; reached without
  // it (a refresh, a pasted URL), start the flow from the top.
  if (step === 'review') {
    return isFileReady(upload.exemplar) && isFileReady(upload.responses) ? (
      <UploadMiuReview {...stepProps} />
    ) : (
      <Navigate to={basePath} replace />
    );
  }
  if (step === 'submitted') {
    return upload.submission ? (
      <UploadMiuSubmitted {...stepProps} />
    ) : (
      <Navigate to={basePath} replace />
    );
  }
  return (
    <>
      <UploadMiu {...stepProps} />
      {leaveDialog}
    </>
  );
}
