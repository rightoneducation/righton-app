import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import ReflectionDetailModal from '../components/ReflectionDetailModal';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { IImplementedActivity } from '../lib/PipelineModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import {
  CountChip,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import {
  ActivityContext,
  ActivityContextRow,
  ReflectContent,
  ReflectDetailsButton,
  ReflectPage,
  ReflectionCard,
  ReflectionResults,
  ScoreChange,
  ScoreGroup,
  ScoreRow,
} from '../lib/styledcomponents/ReflectStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { UseSessionsResult } from '../hooks/useSessions';
import buildReflectionResults from '../lib/reflectionResults';

interface ReflectProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
}

export default function Reflect({ screenSize, sessions }: ReflectProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { misconceptions, misconceptionsStatus } = useMicroCoachDataState();
  const [selectedActivity, setSelectedActivity] =
    React.useState<IImplementedActivity | null>(null);
  const reflect = buildReflectionResults(
    sessions.selectedSession,
    misconceptions,
  );
  const dataReady =
    sessions.status === MicroCoachDataStatus.READY &&
    misconceptionsStatus === MicroCoachDataStatus.READY;
  const isReady = useAllReady(useI18nReady(), dataReady);

  if (!isReady) return null;

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'understand-act') navigate('/review');
    if (tabId === 'prepare') navigate('/myplan');
  };

  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <ReflectPage>
      <ReflectionDetailModal
        activity={selectedActivity}
        screenSize={screenSize}
        onClose={() => setSelectedActivity(null)}
      />
      <AppContentRow
        screenSize={screenSize}
        sx={{
          pt: isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space6}px`,
          pb: isLarge ? `${theme.sizing.space14}px` : `${theme.sizing.space11}px`,
        }}
      >
        <ReflectContent>
          <FlowNav
            screenSize={screenSize}
            activeTabId="reflect"
            onTabSelect={handleTabSelect}
            onAction={() => navigate('/myplan')}
          />
          <ReflectContent>
            <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {t('reflect.title')}
            </Typography>
            <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {t('reflect.subtitle')}
            </Typography>
          </ReflectContent>
          {reflect.implementedActivities.map((activity) => {
            const improvement = activity.masteryAfter - activity.masteryBefore;

            return (
              <ReflectionCard key={activity.id}>
                <ReflectContent>
                  <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                    {t('reflect.activitySubtitle')}
                  </Typography>
                </ReflectContent>
                <ActivityContext>
                  <ActivityContextRow>
                    <CountChip>{activity.skillCode}</CountChip>
                    <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {activity.misconceptionTitle}
                    </Typography>
                  </ActivityContextRow>
                  <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                    {t('reflect.activityDescription')}
                  </Typography>
                </ActivityContext>
                <ReflectionResults isLarge={isLarge}>
                  <ScoreGroup>
                    <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.scoreTitle')}
                    </Typography>
                    <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.scoreSubtitle')}
                    </Typography>
                    <ScoreRow>
                      <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                        {t('reflect.percentCorrect', { percent: activity.masteryBefore })}
                      </Typography>
                      <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>→</Typography>
                      <Typography variant="headingLg" sx={{ color: 'designSystem.surface.green' }}>
                        {t('reflect.percentCorrect', { percent: activity.masteryAfter })}
                      </Typography>
                      <ScoreChange>{t('reflect.percentagePointGain', { improvement })}</ScoreChange>
                    </ScoreRow>
                  </ScoreGroup>
                  <ReflectDetailsButton disableElevation onClick={() => setSelectedActivity(activity)}>
                    {t('reflect.viewDetails')}
                  </ReflectDetailsButton>
                </ReflectionResults>
              </ReflectionCard>
            );
          })}
        </ReflectContent>
      </AppContentRow>
    </ReflectPage>
  );
}
