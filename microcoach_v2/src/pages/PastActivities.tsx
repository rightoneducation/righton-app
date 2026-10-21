import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SidebarPage from '../components/SidebarPage';
import ActivitySortMenu from '../components/ActivitySortMenu';
import LoadingSlot from '../components/LoadingSlot';
import { PastActivitiesSkeleton } from '../components/skeletons/ActivityListSkeleton';
import { IAPIClients } from '../api';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useClassActivity } from '../hooks/useClassActivity';
import { useOpenClassSession } from '../hooks/useOpenClassSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { FlowStep, RESUME_PATH } from '../lib/flowProgress';
import {
  ActivitySortOrder,
  groupPastActivities,
} from '../lib/ActivityListModels';
import { formatSchoolWeek, formatShortDate } from '../lib/weeks';
import emptyStateImage from '../images/landingPageStepCard1.png';
import {
  ActivityGroupList,
  ActivityList,
  ActivityCard,
  ActivityName,
  CardActionButton,
  CardColumn,
  CardLine,
  EmptyState,
  EmptyStateButton,
  EmptyStateContent,
  EmptyStateText,
  IncompleteTag,
  ClassName,
  CompletedTag,
  StudentsTag,
  WaitingPill,
  WeekHeading,
  WeekGroup,
  WeekHeadingRow,
  ScreenSizeProps,
} from '../lib/styledcomponents/ActivityListStyledComponents';

// One card's height: what the loading spinner holds open.
const CARD_HEIGHT = 128;
// Draws the papers about as wide as the empty state frame (~192).
const EMPTY_STATE_IMAGE_WIDTH = 224;

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
  const navigate = useNavigate();
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
          skeleton={<PastActivitiesSkeleton screenSize={screenSize} />}
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
            <EmptyState>
              <EmptyStateContent>
                <img
                  src={emptyStateImage}
                  alt=""
                  width={EMPTY_STATE_IMAGE_WIDTH}
                />
                <EmptyStateText>
                  <Typography variant="emptyStateTitle">
                    {t('pastActivities.emptyTitle')}
                  </Typography>
                  <Typography variant="h4">
                    {t('pastActivities.emptyBody')}
                  </Typography>
                </EmptyStateText>
              </EmptyStateContent>
              <EmptyStateButton
                disableElevation
                onClick={() => navigate('/dashboard')}
              >
                {t('pastActivities.backToHome')}
              </EmptyStateButton>
            </EmptyState>
          )}
          {!hasFailed &&
            groups.map((group, groupIndex) => (
              <WeekGroup key={group.key}>
                <WeekHeadingRow>
                  {/* By class, the class name heads its group in the week's place. */}
                  <WeekHeading>
                    {group.weekStart
                      ? formatSchoolWeek(
                          group.weekStart,
                          t,
                          i18n.language,
                          'pastActivities.weekHeading',
                        )
                      : group.className}
                  </WeekHeading>
                  {groupIndex === 0 && (
                    <ActivitySortMenu
                      sortOrder={sortOrder}
                      onSortChange={setSortOrder}
                    />
                  )}
                </WeekHeadingRow>
                <ActivityList>
                  {group.rows.map((row) => (
                    <ActivityCard key={row.id} screenSize={screenSize}>
                      <CardColumn align="start">
                        <CardLine>
                          <ClassName>{row.className}</ClassName>
                          <StudentsTag>
                            {t('pastActivities.students', {
                              count: row.studentCount,
                            })}
                          </StudentsTag>
                          {row.step === FlowStep.DONE ? (
                            <CompletedTag>
                              {t('pastActivities.completed', {
                                date: formatShortDate(
                                  row.completedAt,
                                  i18n.language,
                                ),
                              })}
                            </CompletedTag>
                          ) : (
                            <IncompleteTag>
                              {t('pastActivities.incomplete')}
                            </IncompleteTag>
                          )}
                        </CardLine>
                        <ActivityName>
                          {row.activityName ?? t('pastActivities.untitled')}
                        </ActivityName>
                      </CardColumn>
                      <CardColumn align="end">
                        {/* Design note: View data goes back to the reflect
                            screen; an unfinished session resumes at its step,
                            as Home's card would. */}
                        {row.isAwaitingResults ? (
                          <WaitingPill>{t('weeklyProgress.waiting')}</WaitingPill>
                        ) : (
                          <CardActionButton
                            disableElevation
                            endIcon={<ChevronRightIcon />}
                            onClick={() =>
                              openClassSession({
                                classId: row.classId,
                                sessionId: row.id,
                                path: RESUME_PATH[row.step],
                                // The upload pre-fills the week it is for.
                                state: RESUME_PATH[row.step].startsWith(
                                  '/upload-',
                                )
                                  ? { weekStart: row.weekStart }
                                  : undefined,
                              })
                            }
                          >
                            {t('pastActivities.viewData')}
                          </CardActionButton>
                        )}
                      </CardColumn>
                    </ActivityCard>
                  ))}
                </ActivityList>
              </WeekGroup>
            ))}
        </LoadingSlot>
      </ActivityGroupList>
    </SidebarPage>
  );
}
