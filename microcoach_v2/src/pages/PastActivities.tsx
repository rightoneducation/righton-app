import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ActivitySortMenu from '../components/ActivitySortMenu';
import {
  ActivitySortOrder,
  groupPastActivities,
} from '../lib/ActivityListModels';
import { mockPastActivities } from '../lib/mocks/mockClassActivity';
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

// Placeholder for actions that need the cross-class data this page mocks.
const logPending = (action: string, id?: string) => {
  // eslint-disable-next-line no-console
  console.log('past-activities action not yet built', action, id);
};

export default function PastActivities({ screenSize }: ScreenSizeProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = React.useState(
    ActivitySortOrder.RECENT_FIRST,
  );
  const groups = groupPastActivities(mockPastActivities, sortOrder);

  return (
    <SidebarPage
      screenSize={screenSize}
      title={t('pastActivities.title')}
      contentGap={theme.sizing.space12}
    >
      <ActivityGroupList>
        {groups.map((group, groupIndex) => (
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
                      <ActivityName>{row.activityName}</ActivityName>
                    </CardColumn>
                    <CardColumn align="end">
                      <CardMessage>{t('pastActivities.reviewResults')}</CardMessage>
                      {/* Design note: View data goes back to the reflect screen.
                          Until rows are real it opens the selected class's. */}
                      <CardActionButton
                        disableElevation
                        endIcon={<ChevronRightIcon />}
                        onClick={() => navigate('/reflect')}
                      >
                        {t('pastActivities.viewData')}
                      </CardActionButton>
                    </CardColumn>
                  </ActivityCard>
                  <RemoveTile
                    aria-label={`${t('pastActivities.remove')} ${row.className}`}
                    onClick={() => logPending('remove', row.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </RemoveTile>
                </CardRow>
              ))}
            </ActivityList>
          </WeekGroup>
        ))}
      </ActivityGroupList>
    </SidebarPage>
  );
}
