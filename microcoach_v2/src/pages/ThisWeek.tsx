import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ClassStepTrack from '../components/ClassStepTrack';
import LoadingSlot from '../components/LoadingSlot';
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog';
import { IAPIClients } from '../api';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useClassActivity } from '../hooks/useClassActivity';
import { useConfirmRemove } from '../hooks/useConfirmRemove';
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
  CardRow,
  ClassName,
  RemoveTile,
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
  [FlowStep.REASSESS]: '/upload-miu',
  [FlowStep.REFLECT]: '/reflect',
  [FlowStep.DONE]: '/reflect',
};

// One card's height: what the loading spinner holds open.
const CARD_HEIGHT = 148;

// The status line's key: a class whose files are still being analysed reads
// differently from one that has not uploaded yet, though both are at ASSESS.
const statusKey = (row: IWeeklyClassProgress) =>
  row.isAwaitingResults ? 'AWAITING' : row.step;

interface ThisWeekProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
}

export default function ThisWeek({
  apiClients,
  screenSize,
  classrooms,
  sessions,
}: ThisWeekProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classesFailed = classrooms.status === MicroCoachDataStatus.ERROR;
  const classesKnown =
    classrooms.status === MicroCoachDataStatus.READY || classesFailed;
  const activity = useClassActivity(
    apiClients,
    classesKnown ? classrooms.classrooms : null,
  );
  const remove = useConfirmRemove(activity.removeSession);
  const openClassSession = useOpenClassSession(classrooms, sessions);
  const weekStart = currentSchoolWeek();

  const isLoading = activity.status === MicroCoachDataStatus.LOADING;
  const hasFailed =
    classesFailed || activity.status === MicroCoachDataStatus.ERROR;

  // Design note (v2 Dashboard2): no sorting here, at most ~six classes a week,
  // listed alphabetically.
  const rows = [...activity.thisWeek].sort((a, b) =>
    a.className.localeCompare(b.className),
  );

  return (
    <SidebarPage
      screenSize={screenSize}
      title={t('thisWeek.title')}
      contentGap={theme.sizing.space7}
    >
      <ActivityList>
        <WeekSubheading>
          {formatSchoolWeek(weekStart, t, i18n.language, 'thisWeek.weekHeading')}
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
            <CardMessage>{t('thisWeek.empty')}</CardMessage>
          )}
          {!hasFailed &&
            rows.map((row) => (
              <CardRow key={row.classId}>
                <ActivityCard screenSize={screenSize}>
                  <CardColumn align="start">
                    <CardLine>
                      <ClassName>{row.className}</ClassName>
                      <StudentsTag>
                        {t('thisWeek.students', { count: row.studentCount })}
                      </StudentsTag>
                    </CardLine>
                    <ClassStepTrack step={row.step} />
                  </CardColumn>
                  <CardColumn align="end">
                    <CardMessage>
                      {t(`thisWeek.status.${statusKey(row)}`)}
                    </CardMessage>
                    {row.isAwaitingResults ? (
                      <WaitingPill>{t('thisWeek.waiting')}</WaitingPill>
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
                              STEP_PATH[row.step] === '/upload-miu'
                                ? { weekStart }
                                : undefined,
                          })
                        }
                      >
                        {t(`thisWeek.action.${row.step}`)}
                      </CardActionButton>
                    )}
                  </CardColumn>
                </ActivityCard>
                {/* A class with no session this week has nothing to remove. */}
                <RemoveTile
                  aria-label={`${t('activityList.remove')} ${row.className}`}
                  disabled={!row.sessionId}
                  onClick={() =>
                    row.sessionId &&
                    remove.ask({
                      id: row.sessionId,
                      className: row.className,
                    })
                  }
                >
                  <DeleteOutlineIcon fontSize="small" />
                </RemoveTile>
              </CardRow>
            ))}
        </LoadingSlot>
      </ActivityList>
      <ConfirmRemoveDialog
        className={remove.target?.className ?? null}
        isRemoving={remove.isRemoving}
        hasError={remove.hasError}
        onCancel={remove.cancel}
        onConfirm={remove.confirm}
      />
    </SidebarPage>
  );
}
