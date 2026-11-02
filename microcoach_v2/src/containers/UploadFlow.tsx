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
import { AssessmentType, SessionStatus } from '../AWSAPI';
import { IMiuUpload } from '../api/Models/IMicroCoachSession';
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
import { sessionForWeek } from '../lib/flowProgress';
import { classSessions } from '../lib/selectors';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
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
 * both to S3 and records them on the session (`miuUploads`). S3 is one way:
 * nothing here deletes an uploaded file, so a failed pipeline run can always
 * be redone by hand from the recorded keys.
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
  const { userProfile, userStatus, sessions } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
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
      const { exemplar, responses, weekStart } = upload;
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

      // Record the upload on the session: MIU 1 starts a new one; MIU 2 goes
      // on the session Home sent the teacher here for (that week's, else the
      // class's latest). If this fails the files stay in S3, and a retry
      // uploads a fresh pair.
      const entry: IMiuUpload = {
        assessmentType: kind,
        ...keys,
        weekStart,
        uploadedAt: new Date().toISOString(),
      };
      try {
        let saved;
        if (kind === AssessmentType.PPQ) {
          saved = await apiClients.session.createUploadedSession(classId, entry);
        } else {
          const ofClass = classSessions({ sessions }, classId);
          const target = sessionForWeek(ofClass, weekStart) ?? ofClass[0];
          if (!target) throw new Error(`Class ${classId} has no session to reassess`);
          saved = await apiClients.session.recordMiuUpload(
            target.id,
            [...target.miuUploads, entry],
            SessionStatus.REASSESS_INGESTED,
          );
        }
        if (!saved) throw new Error('The session came back empty');
        dispatch({ type: 'UPSERT_ROWS', table: 'sessions', rows: [saved] });
        dispatch({ type: 'SELECT', classId, sessionId: saved.id });
      } catch (error) {
        console.error('Could not record the MIU upload', { ...keys, error });
        setUpload((s) => ({ ...s, submitStatus: 'ERROR', submitError: 'UPLOAD' }));
        return false;
      }

      // TODO(ingest): start the analysis here (apiClients.upload.startAnalysis
      // with the session id) once the v2 schema has the mutation. Its failure
      // must not remove the files or the row.
      setUpload((s) => ({ ...s, submitStatus: 'IDLE', submission: keys }));
      return true;
    },
    // Only resets the form: the submitted files and their record stay.
    startOver: async () => {
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
