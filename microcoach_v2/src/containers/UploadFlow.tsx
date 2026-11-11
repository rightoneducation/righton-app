import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { IAPIClients } from '../api';
import { AssessmentType, SessionStatus } from '../AWSAPI';
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
import { sessionForWeek, sessionWeek } from '../lib/flowProgress';
import { classSessions } from '../lib/selectors';
import { setSelectionParams } from '../lib/selectionParams';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { useEffectiveSelection, useSelectionPath } from '../hooks/useEffectiveSelection';
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
 * both to S3, puts the session in its waiting state, and records the pair as a
 * MicroCoachUpload row, which is what starts ingest. S3 is one way: nothing
 * here deletes an uploaded file, so a failed pipeline run can always be
 * redone by hand from the recorded keys.
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
  const [, setSearchParams] = useSearchParams();
  const toFlow = useSelectionPath();
  const step = useParams()['*'] ?? '';
  const { userProfile, userStatus, sessions } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const basePath = UPLOAD_BASE_PATH[kind];

  // The week arrives pre-filled through router state (Home passes the week it
  // shows); the class is the URL's (`?class=`, set by whatever opened the
  // upload), which may still be loading when the flow mounts.
  //
  // MIU 2 opened from inside the flow (My Activity's Upload MIU, the Reassess
  // tab, the stepper) passes no week, but names its session in the URL: the
  // week is the one that session's MIU 1 was uploaded for. Without it, the
  // form fell back to the current week, and submit attached the upload to
  // whichever session sessionForWeek found there (else the class's latest).
  const selection = useEffectiveSelection();
  const [upload, setUpload] = useState<IUploadState>(() => {
    const passedWeek = (location.state as { weekStart?: string } | null)
      ?.weekStart;
    const selectedSession = selection.sessionId
      ? sessions[selection.sessionId]
      : undefined;
    const sessionsWeek =
      kind === AssessmentType.POST_PPQ && selectedSession
        ? sessionWeek(selectedSession)
        : null;
    const initialWeek = [passedWeek, sessionsWeek].find(
      (week): week is string => !!week && schoolWeeks().includes(week),
    );
    return emptyUploadState(initialWeek ?? currentSchoolWeek());
  });
  const classId = classrooms.selectedClassroomId ?? '';

  const actions: IUploadActions = {
    // Picking a class here edits the form, so it replaces the history entry
    // rather than adding a Back step, and keeps the scroll where it is.
    setClass: (nextClassId) => {
      setSearchParams(
        (params) => setSelectionParams(params, { classId: nextClassId, sessionId: null }),
        { replace: true, preventScrollReset: true },
      );
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
      if (!classId || !exemplar?.file || !responses?.file) return null;
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
        return null;
      }

      // MIU 1 starts a new session; MIU 2 goes on the session Home sent the
      // teacher here for (that week's, else the class's latest). Then the
      // upload row, whose creation starts ingest. If either write fails the
      // files stay in S3, and a retry uploads a fresh pair.
      // A session saved by an earlier, failed attempt is reused only for the
      // class it was saved for: the class may have changed since.
      let sessionId =
        upload.sessionId && sessions[upload.sessionId]?.classId === classId
          ? upload.sessionId
          : null;
      try {
        if (!sessionId) {
          let saved;
          if (kind === AssessmentType.PPQ) {
            saved = await apiClients.session.createUploadedSession(classId, weekStart);
          } else {
            const ofClass = classSessions({ sessions }, classId);
            const target = sessionForWeek(ofClass, weekStart) ?? ofClass[0];
            if (!target) throw new Error(`Class ${classId} has no session to reassess`);
            saved = await apiClients.session.setSessionStatus(
              target.id,
              SessionStatus.REASSESS_INGESTED,
            );
          }
          if (!saved) throw new Error('The session came back empty');
          dispatch({ type: 'UPSERT_ROWS', table: 'sessions', rows: [saved] });
          const savedId = saved.id;
          sessionId = savedId;
          setUpload((s) => ({ ...s, sessionId: savedId }));
        }
        if (!userProfile?.id) throw new Error('No signed-in user to record the upload under');
        await apiClients.upload.recordUpload({
          userId: userProfile.id,
          classId,
          sessionId,
          assessmentType: kind,
          ...keys,
          weekStart,
        });
      } catch (error) {
        console.error('Could not record the MIU upload', { ...keys, error });
        setUpload((s) => ({ ...s, submitStatus: 'ERROR', submitError: 'UPLOAD' }));
        return null;
      }

      setUpload((s) => ({ ...s, submitStatus: 'IDLE', submission: keys }));
      // The caller opens the submitted step on it, in the URL.
      return sessionId;
    },
    // Only resets the form: the submitted files and their record stay.
    startOver: async () => {
      setUpload((s) => emptyUploadState(s.weekStart));
      navigate(toFlow(basePath), { replace: true });
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
      <Navigate to={toFlow(basePath)} replace />
    );
  }
  if (step === 'submitted') {
    return upload.submission ? (
      <UploadMiuSubmitted {...stepProps} />
    ) : (
      <Navigate to={toFlow(basePath)} replace />
    );
  }
  return (
    <>
      <UploadMiu {...stepProps} />
      {leaveDialog}
    </>
  );
}
