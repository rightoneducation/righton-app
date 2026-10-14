import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClassStepTrack from './ClassStepTrack';
import LoadingSlot from './LoadingSlot';
import { IAPIClients } from '../api';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useClassActivity } from '../hooks/useClassActivity';
import { useOpenClassSession } from '../hooks/useOpenClassSession';
import { FlowStep } from '../lib/flowProgress';
import { IWeeklyClassProgress } from '../lib/ActivityListModels';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { currentSchoolWeek, formatSchoolWeek } from '../lib/weeks';
import {
  ActivityList,
  ActivityCard,
  CardActionButton,
  CardColumn,
  CardLine,
  CardMessage,
  ClassName,
  ProgressTitle,
  StudentsTag,
  WaitingPill,
  WeekSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/ActivityListStyledComponents';

// Where each step's action goes. The upload covers both the first upload and
// the reassessment; a finished week opens its results.
const STEP_PATH: Record<FlowStep, string> = {
  [FlowStep.ASSESS]: '/upload-miu',
  [FlowStep.UNDERSTAND]: '/review',
  [FlowStep.CHOOSE]: '/review',
  [FlowStep.REASSESS]: '/upload-reassess',
  [FlowStep.REFLECT]: '/reflect',
  [FlowStep.DONE]: '/reflect',
};

// One card's height: what the loading spinner holds open.
const CARD_HEIGHT = 148;

// The status line's key: a class whose files are still being analysed reads
// differently from one that has not uploaded yet, though both are at ASSESS.
// The same wait after the MIU 2 upload (rev2 scenario 6) has no persisted
// signal yet, so a reassessed class goes straight to REFLECT.
const statusKey = (row: IWeeklyClassProgress) =>
  row.isAwaitingResults ? 'AWAITING' : row.step;

interface WeeklyProgressListProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
}

// Home's "Weekly Activity Progress" (rev2 LandingPage, was the This Week
// page): every class's place in the current week's flow.
export default function WeeklyProgressList({
  apiClients,
  screenSize,
  classrooms,
  sessions,
}: WeeklyProgressListProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classesFailed = classrooms.status === MicroCoachDataStatus.ERROR;
  const classesKnown =
    classrooms.status === MicroCoachDataStatus.READY || classesFailed;
  const activity = useClassActivity(
    apiClients,
    classesKnown ? classrooms.classrooms : null,
  );
  const openClassSession = useOpenClassSession(classrooms, sessions);
  const weekStart = currentSchoolWeek();

  const isLoading = activity.status === MicroCoachDataStatus.LOADING;
  const hasFailed =
    classesFailed || activity.status === MicroCoachDataStatus.ERROR;

  // Design note (rev2 WeeklyActivityProgress_1): no sorting, at most ~six
  // classes a week, listed alphabetically.
  const rows = [...activity.thisWeek].sort((a, b) =>
    a.className.localeCompare(b.className),
  );

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space10}px`,
        width: '100%',
        maxWidth: theme.sizing.activityListMaxWidth,
      }}
    >
      <ProgressTitle as="h2">{t('weeklyProgress.title')}</ProgressTitle>
      <ActivityList>
        <WeekSubheading>
          {formatSchoolWeek(
            weekStart,
            t,
            i18n.language,
            'weeklyProgress.weekHeading',
          )}
        </WeekSubheading>
        <LoadingSlot
          isLoading={isLoading}
          minHeight={CARD_HEIGHT}
          label={t('activityList.loading')}
        >
          {hasFailed && (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('activityList.loadError')}
            </Typography>
          )}
          {!hasFailed && rows.length === 0 && (
            <CardMessage>{t('weeklyProgress.empty')}</CardMessage>
          )}
          {!hasFailed &&
            rows.map((row) => (
              <ActivityCard key={row.classId} screenSize={screenSize}>
                <CardColumn align="start">
                  <CardLine>
                    <ClassName>{row.className}</ClassName>
                    <StudentsTag>
                      {t('weeklyProgress.students', { count: row.studentCount })}
                    </StudentsTag>
                  </CardLine>
                  <ClassStepTrack step={row.step} />
                </CardColumn>
                <CardColumn align="end">
                  <CardMessage>
                    {t(`weeklyProgress.status.${statusKey(row)}`)}
                  </CardMessage>
                  {row.isAwaitingResults ? (
                    <WaitingPill>{t('weeklyProgress.waiting')}</WaitingPill>
                  ) : (
                    <CardActionButton
                      disableElevation
                      endIcon={<ArrowForwardIcon />}
                      onClick={() =>
                        openClassSession({
                          classId: row.classId,
                          sessionId: row.sessionId,
                          path: STEP_PATH[row.step],
                          // The upload pre-fills the week it is for.
                          state:
                            STEP_PATH[row.step].startsWith('/upload-')
                              ? { weekStart }
                              : undefined,
                        })
                      }
                    >
                      {t(`weeklyProgress.action.${row.step}`)}
                    </CardActionButton>
                  )}
                </CardColumn>
              </ActivityCard>
            ))}
        </LoadingSlot>
      </ActivityList>
    </Box>
  );
}
