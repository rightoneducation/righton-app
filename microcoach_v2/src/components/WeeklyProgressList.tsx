import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClassStepTrack from './ClassStepTrack';
import LoadingSlot from './LoadingSlot';
import { WeeklyProgressSkeleton } from './skeletons/ActivityListSkeleton';
import { IAPIClients } from '../api';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useClassActivity } from '../hooks/useClassActivity';
import { useOpenClassSession } from '../hooks/useOpenClassSession';
import { RESUME_PATH } from '../lib/flowProgress';
import { IWeeklyClassProgress } from '../lib/ActivityListModels';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { formatSchoolWeek } from '../lib/weeks';
import {
  ActivityList,
  WeekGroup,
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
  // The week picked on Home: the heading and every class's step follow it.
  weekStart: string;
}

// Home's "Weekly Activity Progress" (rev2 LandingPage, was the This Week
// page): every class's place in the picked week's flow.
export default function WeeklyProgressList({
  apiClients,
  screenSize,
  classrooms,
  sessions,
  weekStart,
}: WeeklyProgressListProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classesFailed = classrooms.status === MicroCoachDataStatus.ERROR;
  const classesKnown =
    classrooms.status === MicroCoachDataStatus.READY || classesFailed;
  const activity = useClassActivity(
    apiClients,
    classesKnown ? classrooms.classrooms : null,
    weekStart,
  );
  const openClassSession = useOpenClassSession(classrooms, sessions);

  const isLoading = activity.status === MicroCoachDataStatus.LOADING;
  const hasFailed =
    classesFailed || activity.status === MicroCoachDataStatus.ERROR;

  // Design note (rev2 WeeklyActivityProgress_1): no sorting, at most ~six
  // classes a week, listed alphabetically.
  const rows = [...activity.week].sort((a, b) =>
    a.className.localeCompare(b.className),
  );

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // Figma (rev2 LandingPage): ~52 from the title to the week heading.
        gap: `${theme.sizing.space9}px`,
        width: '100%',
        maxWidth: theme.sizing.activityListMaxWidth,
      }}
    >
      <ProgressTitle as="h2">{t('weeklyProgress.title')}</ProgressTitle>
      {/* Same shape as Past Activities: the week heading ~20 over its
          cards (WeekGroup), the cards 12 apart (ActivityList). */}
      <WeekGroup>
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
          // One placeholder row per class once the class list is in.
          skeleton={
            <WeeklyProgressSkeleton
              screenSize={screenSize}
              count={
                classesKnown
                  ? Math.min(Math.max(classrooms.classrooms.length, 1), 6)
                  : 3
              }
            />
          }
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
          {!hasFailed && rows.length > 0 && (
            <ActivityList>
              {rows.map((row) => (
                <ActivityCard key={row.classId} screenSize={screenSize}>
                  {/* Below LARGE the card stacks; this column then spans it so
                      the fluid track has a width to fill. */}
                  <CardColumn
                    align="start"
                    sx={
                      screenSize === ScreenSize.LARGE
                        ? undefined
                        : { alignSelf: 'stretch' }
                    }
                  >
                    <CardLine>
                      <ClassName>{row.className}</ClassName>
                      <StudentsTag>
                        {t('weeklyProgress.students', { count: row.studentCount })}
                      </StudentsTag>
                    </CardLine>
                    <ClassStepTrack
                      step={row.step}
                      fluid={screenSize === ScreenSize.SMALL}
                    />
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
                            path: RESUME_PATH[row.step],
                            // The upload pre-fills the week it is for.
                            state:
                              RESUME_PATH[row.step].startsWith('/upload-')
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
            </ActivityList>
          )}
        </LoadingSlot>
      </WeekGroup>
    </Box>
  );
}
