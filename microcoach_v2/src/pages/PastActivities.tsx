import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ActivitySortMenu from '../components/ActivitySortMenu';
import LoadingSlot from '../components/LoadingSlot';
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog';
import { IAPIClients } from '../api';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useClassActivity } from '../hooks/useClassActivity';
import { useConfirmRemove } from '../hooks/useConfirmRemove';
import { useOpenClassSession } from '../hooks/useOpenClassSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import {
  ActivitySortOrder,
  groupPastActivities,
} from '../lib/ActivityListModels';
import { formatSchoolWeek, formatShortDate } from '../lib/weeks';
import {
  ActivityGroupList,
  ActivityList,
  ActivityCard,
  ActivityName,
  CardActionButton,
  CardColumn,
  CardLine,
  CardMessage,
  CardRow,
  ClassName,
  CompletedTag,
  RemoveTile,
  StudentsTag,
  WeekHeading,
  WeekGroup,
  WeekHeadingRow,
  ScreenSizeProps,
} from '../lib/styledcomponents/ActivityListStyledComponents';


// One card's height: what the loading spinner holds open.
const CARD_HEIGHT = 128;

interface PastActivitiesProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
}

export default function PastActivities({
  apiClients,
  screenSize,
  classrooms,
  sessions,
}: PastActivitiesProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [sortOrder, setSortOrder] = React.useState(
    ActivitySortOrder.RECENT_FIRST,
  );
  const classesFailed = classrooms.status === MicroCoachDataStatus.ERROR;
  const classesKnown =
    classrooms.status === MicroCoachDataStatus.READY || classesFailed;
  const activity = useClassActivity(
    apiClients,
    classesKnown ? classrooms.classrooms : null,
  );
  const remove = useConfirmRemove(activity.removeSession);
  const openClassSession = useOpenClassSession(classrooms, sessions);
  const isLoading = activity.status === MicroCoachDataStatus.LOADING;
  const hasFailed =
    classesFailed || activity.status === MicroCoachDataStatus.ERROR;
  const groups = groupPastActivities(activity.past, sortOrder);

  return (
    <SidebarPage
      screenSize={screenSize}
      title={t('pastActivities.title')}
      contentGap={theme.sizing.space12}
    >
      <ActivityGroupList>
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
          {!hasFailed && activity.past.length === 0 && (
            <CardMessage>{t('pastActivities.empty')}</CardMessage>
          )}
          {!hasFailed &&
            groups.map((group, groupIndex) => (
              <WeekGroup key={group.weekStart ?? 'by-class'}>
                <WeekHeadingRow>
                  {group.weekStart && (
                    <WeekHeading>
                      {formatSchoolWeek(
                        group.weekStart,
                        t,
                        i18n.language,
                        'pastActivities.weekHeading',
                      )}
                    </WeekHeading>
                  )}
                  {groupIndex === 0 && (
                    <ActivitySortMenu
                      sortOrder={sortOrder}
                      onSortChange={setSortOrder}
                    />
                  )}
                </WeekHeadingRow>
                <ActivityList>
                  {group.rows.map((row) => (
                    <CardRow key={row.id}>
                      <ActivityCard screenSize={screenSize}>
                        <CardColumn align="start">
                          <CardLine>
                            <ClassName>{row.className}</ClassName>
                            <StudentsTag>
                              {t('pastActivities.students', {
                                count: row.studentCount,
                              })}
                            </StudentsTag>
                            <CompletedTag>
                              {t('pastActivities.completed', {
                                date: formatShortDate(row.completedAt, i18n.language),
                              })}
                            </CompletedTag>
                          </CardLine>
                          <ActivityName>
                            {row.activityName ?? t('pastActivities.untitled')}
                          </ActivityName>
                        </CardColumn>
                        <CardColumn align="end">
                          <CardMessage>{t('pastActivities.reviewResults')}</CardMessage>
                          {/* Design note: View data goes back to the reflect screen. */}
                          <CardActionButton
                            disableElevation
                            endIcon={<ChevronRightIcon />}
                            onClick={() =>
                              openClassSession({
                                classId: row.classId,
                                sessionId: row.id,
                                path: '/reflect',
                              })
                            }
                          >
                            {t('pastActivities.viewData')}
                          </CardActionButton>
                        </CardColumn>
                      </ActivityCard>
                      <RemoveTile
                        aria-label={`${t('activityList.remove')} ${row.className}`}
                        onClick={() =>
                          remove.ask({ sessionId: row.id, className: row.className })
                        }
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </RemoveTile>
                    </CardRow>
                  ))}
                </ActivityList>
              </WeekGroup>
            ))}
        </LoadingSlot>
      </ActivityGroupList>
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
