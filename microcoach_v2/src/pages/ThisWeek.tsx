import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SidebarPage from '../components/SidebarPage';
import ClassStepTrack from '../components/ClassStepTrack';
import { IWeeklyClassProgress } from '../lib/ActivityListModels';
import { mockWeeklyProgress } from '../lib/mocks/mockClassActivity';
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

// Placeholder for actions that need the cross-class data this page mocks.
const logPending = (action: string, id?: string) => {
  // eslint-disable-next-line no-console
  console.log('this-week action not yet built', action, id);
};

// The status line's key: a class whose files are still being analysed reads
// differently from one that has not uploaded yet, though both are at ASSESS.
const statusKey = (row: IWeeklyClassProgress) =>
  row.isAwaitingResults ? 'AWAITING' : row.step;

export default function ThisWeek({ screenSize }: ScreenSizeProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // Design note (v2 Dashboard2): no sorting here, at most ~six classes a week,
  // listed alphabetically.
  const rows = [...mockWeeklyProgress].sort((a, b) =>
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
          {formatSchoolWeek(
            currentSchoolWeek(),
            t,
            i18n.language,
            'thisWeek.weekHeading',
          )}
        </WeekSubheading>
        {rows.map((row) => (
          <CardRow key={row.id}>
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
                <CardMessage>{t(`thisWeek.status.${statusKey(row)}`)}</CardMessage>
                {row.isAwaitingResults ? (
                  <WaitingPill>{t('thisWeek.waiting')}</WaitingPill>
                ) : (
                  <CardActionButton
                    disableElevation
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => logPending(row.step, row.id)}
                  >
                    {t(`thisWeek.action.${row.step}`)}
                  </CardActionButton>
                )}
              </CardColumn>
            </ActivityCard>
            <RemoveTile
              aria-label={`${t('thisWeek.remove')} ${row.className}`}
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
