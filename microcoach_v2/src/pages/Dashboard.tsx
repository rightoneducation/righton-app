import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AppSidebar from '../components/AppSidebar';
import FlowStepper from '../components/FlowStepper';
import LoadingSlot from '../components/LoadingSlot';
import {
  SidebarLayout,
  SidebarContent,
  DashboardCard,
  DashboardHeading,
  DashboardForm,
  StepperBand,
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
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import {
  FlowStep,
  buildFlowSteps,
  buildPendingFlowSteps,
  deriveCurrentStep,
  sortSessionsLatestFirst,
  stepCta,
} from '../lib/flowProgress';
import {
  currentSchoolWeek,
  formatSchoolWeek,
  schoolWeeks,
} from '../lib/weeks';

// Chips shown inline before the rest fold into "More".
const VISIBLE_CLASS_COUNT = 4;
// One row of class chips: what the loading spinner holds open.
const CHIP_ROW_HEIGHT = 50;

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
  const { userProfile } = useMicroCoachDataState();
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
  // The week this upload is for. It only pre-fills the upload flow: the
  // stepper and CTA follow the class's latest session whatever week is picked.
  const [weekStart, setWeekStart] = React.useState(() => currentSchoolWeek());

  // The step does not wait on the saved plan. The plan only separates
  // UNDERSTAND from REASSESS, and usePlanItems holds it at LOADING until the
  // misconceptions are READY, so a failed misconception fetch would leave the
  // page waiting for good. The step reads UNDERSTAND and moves on if a plan
  // arrives.
  const selectedSession = sessions.selectedSession ?? sessionList[0] ?? null;
  const currentStep = deriveCurrentStep(
    selectedSession,
    plan.planItems.length > 0,
  );
  const isStepKnown = sessionsKnown && !sessionsFailed;
  const flowSteps = isStepKnown
    ? buildFlowSteps(currentStep, t)
    : buildPendingFlowSteps(t);
  // A failed session fetch falls back to the upload, which is always a valid
  // next action, rather than guessing a later step.
  const cta = stepCta(isStepKnown ? currentStep : FlowStep.ASSESS);
  const isCtaLoading = !sessionsKnown;
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
            <StepperBand screenSize={screenSize}>
              <FlowStepper steps={flowSteps} screenSize={screenSize} />
              <MyActivityButton
                disableElevation
                onClick={() => navigate('/past-activities')}
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
                      onChange={(event) => setWeekStart(event.target.value)}
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

                {showCta && (
                  <DashboardCta
                    onClick={handleCta}
                    disabled={isCtaLoading}
                    aria-busy={isCtaLoading}
                  >
                    {isCtaLoading ? (
                      <CircularProgress
                        size={24}
                        color="inherit"
                        aria-label={t('dashboard.loadingNextStep')}
                      />
                    ) : (
                      t(cta.labelKey)
                    )}
                  </DashboardCta>
                )}
              </DashboardForm>
            </DashboardCard>
          </>
        )}
      </SidebarContent>
    </SidebarLayout>
  );
}
