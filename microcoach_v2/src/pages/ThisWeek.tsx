import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ActivityListToolbar from '../components/ActivityListToolbar';
import { FlowStep } from '../lib/flowProgress';
import {
  ActivitySortOrder,
  IWeeklyClassProgress,
  sortActivities,
} from '../lib/ActivityListModels';
import { mockWeeklyProgress } from '../lib/mocks/mockClassActivity';
import {
  ActivityList,
  ActivityCard,
  CardRow,
  CardLine,
  CardDivider,
  CardTag,
  OutlinePill,
  OpenButton,
  RemoveTile,
  ScreenSizeProps,
} from '../lib/styledcomponents/ActivityListStyledComponents';

const STEP_NUMBER: Record<IWeeklyClassProgress['step'], number> = {
  [FlowStep.ASSESS]: 1,
  [FlowStep.UNDERSTAND]: 2,
  [FlowStep.CHOOSE]: 3,
  [FlowStep.REASSESS]: 4,
  [FlowStep.REFLECT]: 5,
};

// Placeholder for actions that need the cross-class data this page mocks.
const logPending = (action: string, id?: string) => {
  // eslint-disable-next-line no-console
  console.log('this-week action not yet built', action, id);
};

export default function ThisWeek({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = React.useState(
    ActivitySortOrder.RECENT_FIRST,
  );
  const rows = sortActivities(
    mockWeeklyProgress,
    sortOrder,
    (row) => row.createdAt,
  );

  return (
    <SidebarPage screenSize={screenSize} title={t('thisWeek.title')}>
      <ActivityList screenSize={screenSize}>
        <ActivityListToolbar
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onAddClass={() => logPending('add-class')}
        />
        {rows.map((row) => (
          <CardRow key={row.id}>
            <ActivityCard tint="grey" sx={{ gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CardLine sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="headingMd"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {row.className}
                  </Typography>
                  <CardDivider aria-hidden>|</CardDivider>
                  <CardTag tone="step">
                    {t('thisWeek.step', {
                      number: STEP_NUMBER[row.step],
                      label: t(`home.steps.${row.step}`),
                    })}
                  </CardTag>
                  <CardTag tone="count">
                    {t('thisWeek.students', { count: row.studentCount })}
                  </CardTag>
                </CardLine>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
                >
                  {row.isAwaitingResults && (
                    <OutlinePill tone="success">{t('thisWeek.waiting')}</OutlinePill>
                  )}
                  <OpenButton disableElevation onClick={() => logPending('open', row.id)}>
                    {t('thisWeek.open')}
                  </OpenButton>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ color: 'designSystem.surface.black' }}>
                {t(`thisWeek.next.${row.step}`)}
              </Typography>
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
    </SidebarPage>
  );
}
