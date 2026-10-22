import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AppSidebar from '../components/AppSidebar';
import ClassStepTrack from '../components/ClassStepTrack';
import LoadingSlot from '../components/LoadingSlot';
import { SkeletonPill } from '../components/skeletons/SkeletonParts';
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
import { IPlanItemsState } from '../hooks/usePlanItems';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { IAPIClients } from '../api';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import {
  FlowStep,
  buildFlowSteps,
  buildPendingFlowSteps,
  deriveCurrentStep,
  hasChosenActivity,
  sessionForWeek,
  sortSessionsLatestFirst,
  stepCta,
} from '../lib/flowProgress';
import { currentSchoolWeek, formatSchoolWeek, schoolWeeks } from '../lib/weeks';

// Chips shown inline before the rest fold into "More".
const VISIBLE_CLASS_COUNT = 4;
// One row of class chips: what the loading spinner holds open.
const CHIP_ROW_HEIGHT = 50;
// A class chip with a typical name in it.
const CHIP_SKELETON_WIDTH = 140;

interface DashboardProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
}

export default function Dashboard({
  apiClients,
  screenSize,
  classrooms,
  sessions,
  plan,
}: DashboardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userProfile, misconceptionsStatus } = useMicroCoachDataState();
  const classList = classrooms.classrooms;
  const selectedClassId = classrooms.selectedClassroomId ?? '';
  const selectClass = classrooms.selectClassroom;
  const sessionList = sortSessionsLatestFirst(sessions.sessions);

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
  // Sessions sit at IDLE when there is no class to load them for, which is an
  // answer once the class list is in.
  const sessionsKnown =
    sessions.status === MicroCoachDataStatus.READY ||
    sessions.status === MicroCoachDataStatus.ERROR ||
    (classesKnown && !classrooms.selectedClassroomId);
  const sessionsFailed = sessions.status === MicroCoachDataStatus.ERROR;
  const hasUploads = useHasUploads(
    apiClients,
    userProfile?.id ?? null,
    classesKnown ? classList.map((classroom) => classroom.id) : null,
    sessionList.length > 0,
  );

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
  const weekSession = sessionForWeek(sessionList, weekStart);

  // Review, Select Activity and the rest read the app-wide selected session,
  // so it follows the week's session; the plan below is that session's.
  const { selectSession, selectedSessionId } = sessions;
  React.useEffect(() => {
    if (weekSession && weekSession.id !== selectedSessionId) {
      selectSession(weekSession.id);
    }
  }, [weekSession, selectedSessionId, selectSession]);

  /*
   * The saved plan is what separates UNDERSTAND from REASSESS, so a class that
   * would read UNDERSTAND waits for it rather than showing Understand and then
   * jumping. usePlanItems holds the plan at LOADING until the misconceptions
   * are READY, so a failed misconception fetch counts as an answer (no plan).
   */
  const stepWithoutPlan = deriveCurrentStep(weekSession, false);
  const isPlanKnown =
    !!weekSession &&
    weekSession.id === selectedSessionId &&
    (plan.status === MicroCoachDataStatus.READY ||
      plan.status === MicroCoachDataStatus.ERROR ||
      misconceptionsStatus === MicroCoachDataStatus.ERROR);
  const isStepPending =
    !sessionsKnown ||
    (!sessionsFailed && stepWithoutPlan === FlowStep.UNDERSTAND && !isPlanKnown);
  const currentStep = deriveCurrentStep(
    weekSession,
    isPlanKnown && plan.planItems.length > 0,
  );
  const isStepKnown = !isStepPending && !sessionsFailed;
  const flowSteps = isStepKnown
    ? buildFlowSteps(currentStep, t)
    : buildPendingFlowSteps(t);
  // A failed session fetch falls back to the upload, which is always a valid
  // next action, rather than guessing a later step.
  const cta = stepCta(isStepKnown ? currentStep : FlowStep.ASSESS);
  const isCtaLoading = isStepPending;
  const canOpenMyActivity = isStepKnown && hasChosenActivity(currentStep);
  // Shown while classes load (a teacher normally has them); hidden only once
  // the list is known to be empty or failed.
  const showCta = !classesKnown || hasClasses;

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

  const handleCta = () => {
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
                  onClick={() => navigate('/myactivity')}
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
                    {t(hasUploads === true ? 'dashboard.titleReturning' : 'dashboard.title')}
                  </Typography>

                  <Typography
                    variant="smallTitle"
                    sx={{
                      color: 'designSystem.surface.atlanticNavy',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {t('dashboard.subtitle')}
                  </Typography>
                </DashboardHeading>

                <DashboardForm>
                  <PickerRow screenSize={screenSize}>
                    <PickerColumn screenSize={screenSize}>
                      <PickerLabel screenSize={screenSize}>
                        {t(
                          classesKnown && !classesFailed && !hasClasses
                            ? 'dashboard.noClassesTitle'
                            : 'dashboard.classPrompt',
                        )}
                      </PickerLabel>
                      <LoadingSlot
                        isLoading={!classesKnown}
                        minHeight={CHIP_ROW_HEIGHT}
                        label={t('dashboard.loadingClasses')}
                        skeleton={
                          <ChipWrap>
                            {[0, 1, 2].map((chip) => (
                              <SkeletonPill key={chip} width={CHIP_SKELETON_WIDTH} height={CHIP_ROW_HEIGHT} />
                            ))}
                          </ChipWrap>
                        }
                      >
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
                      </LoadingSlot>
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

                  {/* Until the step is known, a skeleton of the button holds its place. */}
                  {showCta && isCtaLoading && (
                    <Box
                      role="status"
                      aria-busy
                      aria-label={t('dashboard.loadingNextStep')}
                      sx={{ width: '100%', maxWidth: 440 }}
                    >
                      <SkeletonPill width="100%" height={58} />
                    </Box>
                  )}
                  {showCta && !isCtaLoading && (
                    <DashboardCta onClick={handleCta}>{t(cta.labelKey)}</DashboardCta>
                  )}
                </DashboardForm>
              </DashboardCard>
            </DashboardIntro>

            {/* rev2 LandingPage: This Week now lives below the upload card. */}
            <WeeklyProgressList
              apiClients={apiClients}
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
