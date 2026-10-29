import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { FlowStepperBand } from '../components/FlowHeader';
import { FlowStep } from '../lib/flowProgress';
import LoadingSlot from '../components/LoadingSlot';
import MisconceptionCardsSkeleton from '../components/skeletons/MisconceptionCardsSkeleton';
import MisconceptionCard from '../components/MisconceptionCard';
import MisconceptionDetailModal, {
  MisconceptionDetailSelection,
} from '../components/MisconceptionDetailModal';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import {
  BannerOverlay,
  CardRow,
  CorrectSection,
  ReviewBody,
  ReviewFooter,
  ReviewIntro,
  QuestionTile,
  ResultsBannerBox,
  TilePercent,
  TileRow,
  TitleGroup,
  TitleRow,
  UnderstandColumn,
  UnderstandPage,
  ViewMiuLink,
  WorksPill,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { continueTooltipSx } from '../lib/styledcomponents/UploadStyledComponents';
import {
  EmptyState,
  EmptyStateButton,
  EmptyStateText,
} from '../lib/styledcomponents/ActivityListStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useSessionMisconceptions } from '../hooks/useSessionMisconceptions';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';
import MathText from '../components/MathText';

// One card's height: what the loading spinner holds open (Figma: 544).
const CARD_HEIGHT = 544;
// Figma: three 366-wide cards. The pipeline can carry a fourth forward (its
// Highest Frequency pick, outside the top 3); Review shows the top 3 only.
const CARDS_SHOWN = 3;

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
  const { misconceptions, status: misconceptionsStatus } = useSessionMisconceptions(
    sessions.selectedSession,
  );
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

  const questionStats = session?.questionStats ?? [];
  // The MIU PDF behind "View Mix It Up" (rev2 Misconceptions). No session or
  // assessment field holds one yet (the schema is the intern's workstream), so
  // the link stays hidden until one does; point this at that field.
  const miuPdfUrl: string | null = null;
  const selectedMisconception =
    misconceptions.find((item) => item.id === selected?.id) ?? null;
  const dismissBanner = () => {
    if (!sessionId) return;
    writeBannerSeen(sessionId);
    setDismissedFor(sessionId);
  };

  const handleSelect = (misconceptionId: string) => {
    // Saved on the session, so Home and the stepper place the class at Select
    // Activity, and its CTA comes back to this misconception's activities.
    sessions.selectMisconception(misconceptionId);
    // Close before navigating so react-modal runs its own close path and
    // restores #root's aria-hidden, rather than being torn down mid-flight.
    setSelected(null);
    navigate(`/review/${misconceptionId}/activities`);
  };

  return (
    <UnderstandPage screenSize={screenSize}>
      <UnderstandColumn>
        <FlowStepperBand
          screenSize={screenSize}
          sessions={sessions}
          plan={plan}
          page={FlowStep.UNDERSTAND}
        />

        <ReviewBody screenSize={screenSize}>
          <ReviewIntro screenSize={screenSize}>
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
                {miuPdfUrl && (
                  <ViewMiuLink href={miuPdfUrl} target="_blank" rel="noopener noreferrer">
                    <DescriptionOutlinedIcon fontSize="small" aria-hidden />
                    {t('review.viewMiu')}
                  </ViewMiuLink>
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
              skeleton={<MisconceptionCardsSkeleton screenSize={screenSize} />}
            >
              {hasFailed ? (
                <Typography
                  variant="rubikBody"
                  role="alert"
                  sx={{ color: 'designSystem.status.errorStroke' }}
                >
                  {t('review.loadError')}
                </Typography>
              ) : null}
              {/* Nothing surfaced (most students answered correctly): say so
                  and offer the way back, rather than an empty card area. */}
              {!hasFailed && misconceptions.length === 0 && (
                <EmptyState>
                  <EmptyStateText>
                    <Typography variant="emptyStateTitle">
                      {t('review.noMisconceptionsTitle')}
                    </Typography>
                    <Typography variant="h4">{t('review.noMisconceptionsBody')}</Typography>
                  </EmptyStateText>
                  <EmptyStateButton disableElevation onClick={() => navigate('/dashboard')}>
                    {t('pastActivities.backToHome')}
                  </EmptyStateButton>
                </EmptyState>
              )}
              {!hasFailed && misconceptions.length > 0 && (
                <CardRow screenSize={screenSize}>
                  {misconceptions.slice(0, CARDS_SHOWN).map((misconception) => (
                    <MisconceptionCard
                      key={misconception.id}
                      isAligned={screenSize === ScreenSize.LARGE}
                      misconception={misconception}
                      onViewDetails={(id, fromEvidence) => setSelected({ id, fromEvidence })}
                      onSelect={handleSelect}
                    />
                  ))}
                </CardRow>
              )}
            </LoadingSlot>
          </ReviewIntro>

          <ReviewFooter>
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
                      // The tooltip anchors on the tile's content, not the tile,
                      // so its arrow sits under "Correct" rather than the border.
                      <QuestionTile key={stat.questionNumber}>
                        <Tooltip
                          title={
                            stat.questionText ? (
                              <>
                                {`${label}. `}
                                <MathText text={stat.questionText} inline />
                              </>
                            ) : (
                              ''
                            )
                          }
                          placement="bottom"
                          arrow
                          slotProps={continueTooltipSx}
                        >
                          <Box
                            tabIndex={stat.questionText ? 0 : undefined}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <Typography variant="rubikBody">{label}</Typography>
                            <TilePercent>{`${Math.round(stat.percentCorrect * 100)}%`}</TilePercent>
                            <Typography
                              variant="rubikBody"
                              sx={{ color: 'designSystem.status.correctGreen' }}
                            >
                              {t('review.correct')}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </QuestionTile>
                    );
                  })}
                </TileRow>
              </CorrectSection>
            )}

            <Typography variant="bodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {t('review.disclaimer')}
            </Typography>
          </ReviewFooter>
        </ReviewBody>
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
