import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  IUploadState,
  IUploadActions,
  UploadSlot,
  UploadStepProps,
  initialUploadState,
} from '../lib/UploadModels';
import { currentSchoolWeek, schoolWeeks } from '../lib/weeks';
import UploadRtd from '../pages/UploadRtd';
import UploadRtdReview from '../pages/UploadRtdReview';

/**
 * The two RTD upload steps. Same arrangement as SignUpWizard: `upload-rtd/*` is
 * one route match, so the picked files survive going "Back to upload" from the
 * review step without needing a provider above both screens.
 */

/** The file names the frames show, so the demo reads as the design does. */
const MOCK_FILE_NAMES: Record<UploadSlot, string> = {
  exemplar: 'ALG_W36_COACH_Exemplar.docx',
  responses: 'W36_PPQ_Responses.xlsx',
};

interface UploadFlowProps {
  screenSize: ScreenSize;
}

export default function UploadFlow({ screenSize }: UploadFlowProps) {
  // The dashboard passes the week the teacher picked there; the class needs no hand-off,
  // as both screens read the shared selected classroom.
  const location = useLocation();
  const [upload, setUpload] = useState<IUploadState>(() => {
    const passedWeek = (location.state as { weekStart?: string } | null)
      ?.weekStart;
    return {
      ...initialUploadState,
      weekStart:
        passedWeek && schoolWeeks().includes(passedWeek)
          ? passedWeek
          : currentSchoolWeek(),
    };
  });
  const step = useParams()['*'] ?? '';

  const actions: IUploadActions = {
    completeFile: (slot) =>
      setUpload((s) => ({
        ...s,
        [slot]: { name: MOCK_FILE_NAMES[slot], status: 'COMPLETE' },
      })),
    failFile: (slot) =>
      setUpload((s) => ({
        ...s,
        [slot]: { name: MOCK_FILE_NAMES[slot], status: 'ERROR' },
      })),
    clearFile: (slot) => setUpload((s) => ({ ...s, [slot]: null })),
    setWeek: (weekStart) => setUpload((s) => ({ ...s, weekStart })),
    submit: () => setUpload((s) => ({ ...s, isSubmitted: true })),
  };

  const stepProps: UploadStepProps = { screenSize, upload, actions };

  return step === 'review' ? (
    <UploadRtdReview {...stepProps} />
  ) : (
    <UploadRtd {...stepProps} />
  );
}
