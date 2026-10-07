import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import FlowStepper from '../components/FlowStepper';
import LoadingSlot from '../components/LoadingSlot';
import MisconceptionCard from '../components/MisconceptionCard';
import MisconceptionDetailModal, {
  MisconceptionDetailSelection,
} from '../components/MisconceptionDetailModal';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { buildFlowSteps, deriveCurrentStep } from '../lib/flowProgress';
import {
  MyActivityButton,
  StepperBand,
} from '../lib/styledcomponents/DashboardStyledComponents';
import {
  BannerOverlay,
  CardRow,
  CorrectSection,
  QuestionTile,
  ResultsBannerBox,
  TilePercent,
  TileRow,
  TitleGroup,
  TitleRow,
  UnderstandColumn,
  UnderstandPage,
  WorksPill,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { continueTooltipSx } from '../lib/styledcomponents/UploadStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';

// One card's height: what the loading spinner holds open (Figma: 544).
const CARD_HEIGHT = 544;

// The results banner is a one-time notice per upload: once dismissed for a
// session it stays dismissed on this device. Storage may be blocked, in which
// case it simply shows again next visit.
const bannerKey = (sessionId: string) => `microcoach.resultsSeen.${sessionId}`;

function readBannerSeen(sessionId: string | null): boolean {
  if (!sessionId) return true;
  try {
    return window.localStorage.getItem(bannerKey(sessionId)) === 'true';
  } catch {
    return false;
  }
}

function writeBannerSeen(sessionId: string) {
  try {
    window.localStorage.setItem(bannerKey(sessionId), 'true');
  } catch {
    // Blocked storage only means the banner can return; nothing else depends on it.
  }
}

interface ReviewProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
}

/**
 * Understand Your Students' Thinking (microcoach-assets/Misconceptions): the
 * misconceptions the pipeline surfaced for the selected session, one to pick
 * as this week's focus, and how the class did on each MIU question.
 *
 * The page renders at once; only the cards wait on the misconceptions query.
 * The per-question tiles and the response evidence render when the session
 * and misconceptions carry them (questionStats / responseEvidence).
 */
export default function Review({ screenSize, sessions, plan }: ReviewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isI18nReady = useI18nReady();
  const { misconceptions, misconceptionsStatus } = useMicroCoachDataState();
  const session = sessions.selectedSession;
  const sessionId = session?.id ?? null;

  const [selected, setSelected] = React.useState<MisconceptionDetailSelection | null>(null);
  // Keyed on the session so switching class shows that session's banner state.
  const [dismissedFor, setDismissedFor] = React.useState<string | null>(null);

  if (!isI18nReady) return null;

  const isLoading =
    misconceptionsStatus === MicroCoachDataStatus.LOADING ||
    misconceptionsStatus === MicroCoachDataStatus.IDLE;
  const hasFailed = misconceptionsStatus === MicroCoachDataStatus.ERROR;
  const showBanner =
    !!sessionId &&
    misconceptions.length > 0 &&
    dismissedFor !== sessionId &&
    !readBannerSeen(sessionId);

  const flowSteps = buildFlowSteps(
    deriveCurrentStep(session, plan.planItems.length > 0),
    t,
  );
  const questionStats = session?.questionStats ?? [];
  const selectedMisconception =
    misconceptions.find((item) => item.id === selected?.id) ?? null;

  const dismissBanner = () => {
    if (!sessionId) return;
    writeBannerSeen(sessionId);
    setDismissedFor(sessionId);
  };

  const handleSelect = (misconceptionId: string) => {
    // Close before navigating so react-modal runs its own close path and
    // restores #root's aria-hidden, rather than being torn down mid-flight.
    setSelected(null);
    navigate(`/review/${misconceptionId}/activities`);
  };

  return (
    <UnderstandPage screenSize={screenSize}>
      <UnderstandColumn>
        <StepperBand screenSize={screenSize}>
          <FlowStepper steps={flowSteps} screenSize={screenSize} />
          <MyActivityButton
            disableElevation
            onClick={() => navigate('/past-activities')}
          >
            {t('dashboard.myActivity')}
          </MyActivityButton>
        </StepperBand>

        <TitleGroup>
          <TitleRow>
            <Typography
              variant="appTitle"
              component="h1"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {t('review.title')}
            </Typography>
            {session?.studentWorksAnalyzed != null && (
              <WorksPill>
                {t('review.worksAnalyzed', { count: session.studentWorksAnalyzed })}
              </WorksPill>
            )}
          </TitleRow>
          <Typography
            variant="uploadLabel"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('review.subtitle')}
          </Typography>
          {showBanner && (
            <BannerOverlay>
              <ResultsBannerBox role="status">
                {t('review.banner')}
                <IconButton
                  size="small"
                  aria-label={t('review.dismissBanner')}
                  onClick={dismissBanner}
                  sx={{ color: 'designSystem.foreground.mutedGrey' }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </ResultsBannerBox>
            </BannerOverlay>
          )}
        </TitleGroup>

        <LoadingSlot
          isLoading={isLoading}
          minHeight={screenSize === ScreenSize.LARGE ? CARD_HEIGHT : 0}
          label={t('review.loading')}
        >
          {hasFailed ? (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('review.loadError')}
            </Typography>
          ) : (
            <CardRow screenSize={screenSize}>
              {misconceptions.map((misconception) => (
                <MisconceptionCard
                  key={misconception.id}
                  misconception={misconception}
                  onViewDetails={(id, fromEvidence) => setSelected({ id, fromEvidence })}
                  onSelect={handleSelect}
                />
              ))}
            </CardRow>
          )}
        </LoadingSlot>

        {questionStats.length > 0 && (
          <CorrectSection>
            <Typography
              variant="headingLg"
              component="h2"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {t('review.correctResponsesTitle', { count: questionStats.length })}
            </Typography>
            <TileRow>
              {questionStats.map((stat) => {
                const label = t('review.questionLabel', { number: stat.questionNumber });
                return (
                  <Tooltip
                    key={stat.questionNumber}
                    title={stat.questionText ? `${label}. ${stat.questionText}` : ''}
                    placement="bottom"
                    arrow
                    slotProps={continueTooltipSx}
                  >
                    <QuestionTile tabIndex={stat.questionText ? 0 : undefined}>
                      <Typography variant="rubikBody">{label}</Typography>
                      <TilePercent>{`${Math.round(stat.percentCorrect * 100)}%`}</TilePercent>
                      <Typography
                        variant="rubikBody"
                        sx={{ color: 'designSystem.status.correctGreen' }}
                      >
                        {t('review.correct')}
                      </Typography>
                    </QuestionTile>
                  </Tooltip>
                );
              })}
            </TileRow>
          </CorrectSection>
        )}

        <Typography variant="bodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
          {t('review.disclaimer')}
        </Typography>
      </UnderstandColumn>

      <MisconceptionDetailModal
        misconception={selectedMisconception}
        showNames={selected?.fromEvidence ?? false}
        questionStats={questionStats}
        screenSize={screenSize}
        onClose={() => setSelected(null)}
        onChooseActivity={handleSelect}
      />
    </UnderstandPage>
  );
}
