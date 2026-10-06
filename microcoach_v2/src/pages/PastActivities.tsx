import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ActivityListToolbar from '../components/ActivityListToolbar';
import {
  ActivitySortOrder,
  sortActivities,
} from '../lib/ActivityListModels';
import { mockPastActivities } from '../lib/mocks/mockClassActivity';
import {
  ActivityList,
  ActivityCard,
  CardLine,
  CardDivider,
  OutlinePill,
  IncompletePill,
  SoftPillButton,
  ScreenSizeProps,
} from '../lib/styledcomponents/ActivityListStyledComponents';

// Placeholder for actions that need the cross-class data this page mocks.
const logPending = (action: string, id?: string) => {
  // eslint-disable-next-line no-console
  console.log('past-activities action not yet built', action, id);
};

export default function PastActivities({ screenSize }: ScreenSizeProps) {
  const { t, i18n } = useTranslation();
  const [sortOrder, setSortOrder] = React.useState(
    ActivitySortOrder.RECENT_FIRST,
  );
  const rows = sortActivities(
    mockPastActivities,
    sortOrder,
    (row) => row.weekStart,
  );

  // Date-only strings parse as UTC midnight; formatting in UTC keeps "Jun 30"
  // from becoming "Jun 29" west of Greenwich.
  const shortDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(i18n.language, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

  return (
    <SidebarPage screenSize={screenSize} title={t('pastActivities.title')}>
      <ActivityList screenSize={screenSize}>
        <ActivityListToolbar
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onAddClass={() => logPending('add-class')}
        />
        {rows.map((row) => (
          // Figma: 28 between the incomplete pill, the title line and the
          // buttons.
          <ActivityCard key={row.id} tint="pink" sx={{ gap: 3.5 }}>
            {!row.completedAt && (
              <IncompletePill>{t('pastActivities.incomplete')}</IncompletePill>
            )}
            <CardLine>
              <Typography
                variant="headingMd"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {t('pastActivities.classWeek', {
                  className: row.className,
                  week: t('pastActivities.weekOf', {
                    date: shortDate(row.weekStart),
                  }),
                })}
              </Typography>
              <CardDivider aria-hidden>|</CardDivider>
              {row.completedAt && (
                <OutlinePill tone="plain">
                  {t('pastActivities.completed', {
                    date: shortDate(row.completedAt),
                  })}
                </OutlinePill>
              )}
              <OutlinePill tone="plain">
                {t('pastActivities.studentWorks', {
                  count: row.studentWorkCount,
                })}
              </OutlinePill>
            </CardLine>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <SoftPillButton
                disableElevation
                startIcon={<DescriptionOutlinedIcon />}
                onClick={() => logPending('open-details', row.id)}
              >
                {t('pastActivities.openDetails')}
              </SoftPillButton>
              <SoftPillButton
                disableElevation
                startIcon={<DeleteOutlineIcon />}
                aria-label={`${t('pastActivities.remove')} ${row.className}`}
                onClick={() => logPending('remove', row.id)}
              >
                {t('pastActivities.remove')}
              </SoftPillButton>
            </Box>
          </ActivityCard>
        ))}
      </ActivityList>
    </SidebarPage>
  );
}
