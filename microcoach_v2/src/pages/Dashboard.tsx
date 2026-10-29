import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AppSidebar from '../components/AppSidebar';
import ClassStepTrack from '../components/ClassStepTrack';
import WeeklyProgressList from '../components/WeeklyProgressList';
import {
  SidebarLayout,
  SidebarContent,
  DashboardCard,
  DashboardHeading,
  DashboardIntro,
  DashboardForm,
  StepperBand,
  StepperRow,
  MyActivityButton,
  PickerRow,
  PickerColumn,
  PickerLabel,
  PickerNote,
  ChipWrap,
  ClassChip,
  WeekSelect,
  DashboardCta,
} from '../lib/styledcomponents/DashboardStyledComponents';
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useI18nReady } from '../hooks/readiness';
import { useSidebarNav } from '../hooks/useSidebarNav';
import { useHasUploads } from '../hooks/useHasUploads';
import { useClassActivity } from '../hooks/useClassActivity';
import { useRefreshClassesOnMount } from '../hooks/loaders';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import {
  FlowStep,
  buildFlowSteps,
  buildPendingFlowSteps,
  hasChosenActivity,
  stepCta,
} from '../lib/flowProgress';
import { currentSchoolWeek, formatSchoolWeek, schoolWeeks } from '../lib/weeks';

// Chips shown inline before the rest fold into "More".
const VISIBLE_CLASS_COUNT = 4;
// Roughly the pickers and button the spinner stands in for, so the card
// does not shrink and grow back when the data lands.
const LOADING_MIN_HEIGHT = 240;

interface DashboardProps extends ScreenSizeProps {
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
}

export default function Dashboard({
  screenSize,
  classrooms,
  sessions,
}: DashboardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userProfile } = useMicroCoachDataState();
  // A-Z here only; the shared list stays in creation order (dev QA 2026-10-29).
  const classList = [...classrooms.classrooms].sort((a, b) => a.name.localeCompare(b.name));
  const selectedClassId = classrooms.selectedClassroomId ?? '';
  const selectClass = classrooms.selectClassroom;

  /*
   * Only translations hold the page back. Everything else renders at once and
   * each query-backed part shows an optimistic or pending state, corrected when
   * its query answers or fails:
   *   - title: "Welcome to" until uploads are known (useHasUploads)
   *   - class chips: a spinner in their slot
   *   - stepper: every label, none current, until the sessions answer
   *   - CTA: the button with a spinner in it, for the same wait
   * IDLE does not count as an answer for classes: it is the state before the
   * user's id reaches useClassrooms.
   */
  const isI18nReady = useI18nReady();
  const classesKnown =
    classrooms.status === MicroCoachDataStatus.READY ||
    classrooms.status === MicroCoachDataStatus.ERROR;
  const classesFailed = classrooms.status === MicroCoachDataStatus.ERROR;
  const hasClasses = classList.length > 0;
  const hasUploads = useHasUploads(userProfile?.id ?? null, classesKnown);

  const [moreAnchor, setMoreAnchor] = React.useState<HTMLElement | null>(null);
  /*
   * The week drives the page: the stepper and CTA show the selected class's
   * session for that week, Weekly Activity Progress shows every class's, and
   * the upload is pre-filled with it. Until the teacher picks one it is the
   * current week: an unfinished earlier week moves to Past Activities as
   * Incomplete rather than holding Home on it (rev4 WeeklyActivity).
   */
  const [pickedWeek, setPickedWeek] = React.useState<string | null>(null);
  const weekStart = pickedWeek ?? currentSchoolWeek();

  /*
   * The card shows the selected class's row of the same joins as Weekly
   * Activity Progress, read from the store: picking a class or a week only
   * picks another row, and runs no query. Home refreshes every class's rows
   * in the background on arrival, so a session the pipeline finished since
   * shows up.
   */
  useRefreshClassesOnMount();
  const activity = useClassActivity(weekStart);
  const classRow = activity.week.find((row) => row.classId === selectedClassId);
  const activityFailed = activity.status === MicroCoachDataStatus.ERROR;
  const isStepPending =
    !classesKnown || activity.status === MicroCoachDataStatus.LOADING;
  const isStepKnown = !isStepPending && !activityFailed;
  // A failed fetch falls back to the upload, which is always a valid next
  // action, rather than guessing a later step.
  const currentStep =
    isStepKnown && classRow ? classRow.step : FlowStep.ASSESS;
  const flowSteps = isStepKnown
    ? buildFlowSteps(currentStep, t)
    : buildPendingFlowSteps(t);
  const cta = stepCta(currentStep, classRow?.selectedMisconceptionId);
  // Dev QA: while the class list or the step is still loading, the card says
  // so ("Welcome to MicroCoach. Please wait…") instead of the upload prompt.
  const isDataLoading = !classesKnown || isStepPending;
  const canOpenMyActivity = isStepKnown && hasChosenActivity(currentStep);

  // The selected class always gets a chip, even when it sits past the fold
  // (picked from "More" or the header): it takes the last inline slot.
  const inlineClasses = (() => {
    const head = classList.slice(0, VISIBLE_CLASS_COUNT);
    if (head.some((c) => c.id === selectedClassId)) return head;
    const selected = classList.find((c) => c.id === selectedClassId);
    return selected ? [...head.slice(0, -1), selected] : head;
  })();
  const overflowClasses = classList.filter(
    (c) => !inlineClasses.some((shown) => shown.id === c.id),
  );

  const sidebar = useSidebarNav();

  // Review, Select Activity and the rest read the app-wide selection: leaving
  // Home points it at this class's session for the picked week (none yet:
  // the class's latest).
  const selectWeekSession = () => {
    if (selectedClassId) {
      sessions.select(selectedClassId, classRow?.sessionId ?? null);
    }
  };

  const handleCta = () => {
    selectWeekSession();
    if (cta.path === '/upload-miu' || cta.path === '/upload-reassess') {
      navigate(cta.path, { state: { weekStart } });
    } else {
      navigate(cta.path);
    }
  };

  return (
    <SidebarLayout screenSize={screenSize}>
      <AppSidebar
        items={sidebar.items}
        screenSize={screenSize}
        onSelect={sidebar.onSelect}
      />

      <SidebarContent screenSize={screenSize}>
        {isI18nReady && (
          <>
            <DashboardIntro screenSize={screenSize}>
              <StepperBand screenSize={screenSize}>
                {/* rev2 LandingPage: the circle track, not the flow pages'
                    breadcrumb. On phones it fits the width; at medium
                    StepperRow scrolls it sideways. */}
                <StepperRow screenSize={screenSize}>
                  <ClassStepTrack
                    steps={flowSteps}
                    size="large"
                    fluid={screenSize === ScreenSize.SMALL}
                  />
                </StepperRow>
                <MyActivityButton
                  disableElevation
                  disabled={!canOpenMyActivity}
                  onClick={() => {
                    selectWeekSession();
                    navigate('/myactivity');
                  }}
                >
                  {t('dashboard.myActivity')}
                </MyActivityButton>
              </StepperBand>

              <DashboardCard screenSize={screenSize}>
                <DashboardHeading>
                  <Typography
                    variant="h1"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {t(
                      hasUploads === true && !isDataLoading
                        ? 'dashboard.titleReturning'
                        : 'dashboard.title',
                    )}
                  </Typography>

                  <Typography
                    variant="smallTitle"
                    sx={{
                      color: 'designSystem.surface.atlanticNavy',
                      whiteSpace: 'pre-line',
                    }}
                    {...(isDataLoading && { role: 'status', 'aria-live': 'polite' as const })}
                  >
                    {t(isDataLoading ? 'dashboard.subtitleLoading' : 'dashboard.subtitle')}
                  </Typography>
                </DashboardHeading>

                {/* While loading, the card is just the message and a spinner:
                    no picker or button placeholders. */}
                {isDataLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: LOADING_MIN_HEIGHT,
                    }}
                  >
                    <CircularProgress aria-label={t('dashboard.loadingNextStep')} />
                  </Box>
                ) : (
                <DashboardForm>
                  <PickerRow screenSize={screenSize}>
                    <PickerColumn screenSize={screenSize}>
                      <PickerLabel screenSize={screenSize}>
                        {t(
                          !classesFailed && !hasClasses
                            ? 'dashboard.noClassesTitle'
                            : 'dashboard.classPrompt',
                        )}
                      </PickerLabel>
                        {classesFailed && (
                          <PickerNote
                            role="alert"
                            sx={{ color: 'designSystem.status.errorStroke' }}
                          >
                            {t('dashboard.classesError')}
                          </PickerNote>
                        )}
                        {!classesFailed && hasClasses && (
                          <ChipWrap>
                            {inlineClasses.map((classroom) => (
                              <ClassChip
                                key={classroom.id}
                                isActive={classroom.id === selectedClassId}
                                aria-pressed={classroom.id === selectedClassId}
                                onClick={() => selectClass(classroom.id)}
                              >
                                {classroom.name}
                              </ClassChip>
                            ))}
                            {overflowClasses.length > 0 && (
                              <ClassChip
                                isActive={false}
                                isMore
                                endIcon={<KeyboardArrowDownIcon />}
                                aria-haspopup="menu"
                                onClick={(event) => setMoreAnchor(event.currentTarget)}
                              >
                                {t('dashboard.moreClasses')}
                              </ClassChip>
                            )}
                            <Menu
                              anchorEl={moreAnchor}
                              open={!!moreAnchor}
                              onClose={() => setMoreAnchor(null)}
                            >
                              {overflowClasses.map((classroom) => (
                                <MenuItem
                                  key={classroom.id}
                                  onClick={() => {
                                    selectClass(classroom.id);
                                    setMoreAnchor(null);
                                  }}
                                >
                                  {classroom.name}
                                </MenuItem>
                              ))}
                            </Menu>
                          </ChipWrap>
                        )}
                        {/* Classes are added in Account Settings now (design note,
                            v2 Dashboard1), so the empty state points there. */}
                        {!classesFailed && !hasClasses && (
                          <PickerNote
                            sx={{ color: 'designSystem.surface.atlanticNavy' }}
                          >
                            {t('dashboard.noClassesHint')}{' '}
                            <Link component={RouterLink} to="/profile">
                              {t('dashboard.accountSettingsLink')}
                            </Link>
                          </PickerNote>
                        )}
                    </PickerColumn>

                    <PickerColumn screenSize={screenSize} grow>
                      <PickerLabel screenSize={screenSize}>
                        {t('dashboard.weekLabel')}
                      </PickerLabel>
                      <WeekSelect
                        value={weekStart}
                        onChange={(event) => setPickedWeek(event.target.value)}
                        inputProps={{ 'aria-label': t('dashboard.weekLabel') }}
                      >
                        {schoolWeeks().map((week) => (
                          <MenuItem key={week} value={week}>
                            {formatSchoolWeek(week, t, i18n.language)}
                          </MenuItem>
                        ))}
                      </WeekSelect>
                    </PickerColumn>
                  </PickerRow>

                  {hasClasses && (
                    <DashboardCta onClick={handleCta}>{t(cta.labelKey)}</DashboardCta>
                  )}
                </DashboardForm>
                )}
              </DashboardCard>
            </DashboardIntro>

            {/* rev2 LandingPage: This Week now lives below the upload card. */}
            <WeeklyProgressList
              screenSize={screenSize}
              classrooms={classrooms}
              sessions={sessions}
              weekStart={weekStart}
            />
          </>
        )}
      </SidebarContent>
    </SidebarLayout>
  );
}
