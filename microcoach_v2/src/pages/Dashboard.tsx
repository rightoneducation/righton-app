import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AppSidebar from '../components/AppSidebar';
import FlowStepper from '../components/FlowStepper';
import {
  HomeLayout,
  HomeContent,
  HomeBand,
  HomeCard,
  StepperBand,
  MyActivityButton,
  FloatingBanner,
  PickerRow,
  PickerColumn,
  PickerLabel,
  ChipWrap,
  ClassChip,
  WeekSelect,
  HomeCta,
} from '../lib/styledcomponents/HomeStyledComponents';
import {
  AddClassChip,
  SignUpField,
} from '../lib/styledcomponents/SignUpStyledComponents';
import {
  ResultsBanner,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useClassProgress } from '../hooks/useClassProgress';
import { useSidebarNav } from '../hooks/useSidebarNav';
import { ClassroomsProps } from '../hooks/useClassrooms';
import { UserProps } from '../hooks/useUserState';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { ScreenSize } from '../lib/MicroCoachModels';
import { SessionStatus } from '../AWSAPI';
import {
  buildFlowSteps,
  deriveCurrentStep,
  stepCta,
} from '../lib/flowProgress';

// Chips shown inline before the rest fold into "More".
const VISIBLE_CLASS_COUNT = 4;

interface DashboardProps extends ScreenSizeProps, UserProps, ClassroomsProps {
  apiClients: IAPIClients;
}

export default function Dashboard({
  apiClients,
  screenSize,
  user,
  classrooms,
}: DashboardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    classrooms: classList,
    selectedClassId,
    isLoaded: classesLoaded,
    selectClass,
    addClass,
  } = classrooms;
  const progress = useClassProgress(apiClients, selectedClassId);
  const isReady = useAllReady(useI18nReady(), classesLoaded, progress.isReady);

  // '' follows the latest session. A stored id that does not belong to the
  // current class falls back to latest too, so switching class needs no reset.
  const [selectedSessionId, setSelectedSessionId] = React.useState('');
  const [isBannerOpen, setIsBannerOpen] = React.useState(true);
  const [moreAnchor, setMoreAnchor] = React.useState<HTMLElement | null>(null);
  const [newClassName, setNewClassName] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [addError, setAddError] = React.useState(false);

  const selectedSession =
    progress.sessions.find((s) => s.id === selectedSessionId) ??
    progress.sessions[0] ??
    null;
  const currentStep = deriveCurrentStep(selectedSession, progress.savedPlans);
  const flowSteps = buildFlowSteps(currentStep, t);
  const cta = stepCta(currentStep);
  const hasClasses = classList.length > 0;
  const canAddClass = !!user.userProfile?.id;
  const showBanner =
    isBannerOpen && selectedSession?.status === SessionStatus.GENERATED;

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

  const weekLabel = (session: IMicroCoachSession) =>
    session.weekLabel ||
    session.sessionLabel ||
    (session.weekNumber != null
      ? t('home.weekNumber', { number: session.weekNumber })
      : new Date(session.createdAt).toLocaleDateString());

  const handleAddClass = async () => {
    if (!newClassName.trim() || isAdding) return;
    setIsAdding(true);
    setAddError(false);
    const created = await addClass(newClassName);
    setIsAdding(false);
    if (created) setNewClassName('');
    else setAddError(true);
  };

  return (
    <HomeLayout screenSize={screenSize}>
      <AppSidebar
        items={sidebar.items}
        screenSize={screenSize}
        onSelect={sidebar.onSelect}
      />

      <HomeContent screenSize={screenSize}>
        {isReady && (
          <>
            {showBanner && (
              <FloatingBanner screenSize={screenSize}>
                <ResultsBanner elevation={3}>
                  <Typography
                    variant="rubikBodyBold"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {t('home.banner')}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={t('home.dismissBanner')}
                    onClick={() => setIsBannerOpen(false)}
                    sx={{ ml: 'auto', color: 'designSystem.surface.ashyGray' }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </ResultsBanner>
              </FloatingBanner>
            )}

            <HomeBand>
              <Typography
                variant="h1"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                }}
              >
                {t('home.title')}
              </Typography>
            </HomeBand>

            <StepperBand
              screenSize={screenSize}
              sx={{ mt: `${theme.sizing.space2}px` }}
            >
              <FlowStepper steps={flowSteps} screenSize={screenSize} />
              <MyActivityButton
                disableElevation
                onClick={() => navigate('/past-activities')}
              >
                {t('home.myActivity')}
              </MyActivityButton>
            </StepperBand>

            <HomeCard
              screenSize={screenSize}
              sx={{
                mt: `${
                  screenSize === ScreenSize.LARGE
                    ? theme.sizing.space12 + theme.sizing.space1
                    : theme.sizing.space8
                }px`,
              }}
            >
              <Typography
                variant="smallTitle"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                {t('home.subtitle')}
              </Typography>

              <PickerRow screenSize={screenSize}>
                <PickerColumn screenSize={screenSize} basis={357}>
                  <PickerLabel screenSize={screenSize}>
                    {t(hasClasses ? 'home.classPrompt' : 'home.noClassesTitle')}
                  </PickerLabel>
                  {hasClasses && (
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
                          {t('home.moreClasses')}
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
                  {!hasClasses && canAddClass && (
                    <Stack spacing={`${theme.sizing.space2}px`}>
                      <SignUpField
                        placeholder={t('home.addClassPlaceholder')}
                        inputProps={{ 'aria-label': t('home.addClassPlaceholder') }}
                        value={newClassName}
                        isError={addError}
                        onChange={(event) => setNewClassName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') handleAddClass();
                        }}
                      />
                      {addError && (
                        <Typography
                          variant="rubikBody"
                          sx={{ color: 'designSystem.status.errorStroke' }}
                        >
                          {t('home.addClassError')}
                        </Typography>
                      )}
                      <AddClassChip
                        disableElevation
                        disabled={!newClassName.trim() || isAdding}
                        startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                        onClick={handleAddClass}
                      >
                        {t('home.addClass')}
                      </AddClassChip>
                    </Stack>
                  )}
                </PickerColumn>

                {progress.sessions.length > 0 && (
                  <PickerColumn screenSize={screenSize} basis={403}>
                    <PickerLabel screenSize={screenSize}>
                      {t('home.weekLabel')}
                    </PickerLabel>
                    <WeekSelect
                      value={selectedSession?.id ?? ''}
                      onChange={(event) => setSelectedSessionId(event.target.value)}
                      inputProps={{ 'aria-label': t('home.weekLabel') }}
                    >
                      {progress.sessions.map((session) => (
                        <MenuItem key={session.id} value={session.id}>
                          {weekLabel(session)}
                        </MenuItem>
                      ))}
                    </WeekSelect>
                  </PickerColumn>
                )}
              </PickerRow>
            </HomeCard>

            {hasClasses && (
              <HomeCta
                onClick={() => navigate(cta.path)}
                sx={{ mt: `${theme.sizing.space7}px` }}
              >
                {t(cta.labelKey)}
              </HomeCta>
            )}
          </>
        )}
      </HomeContent>
    </HomeLayout>
  );
}
