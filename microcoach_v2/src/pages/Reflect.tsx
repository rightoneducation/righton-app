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
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';
import {
  ActivityContext,
  ActivityContextRow,
  ReflectDetailsButton,
  ReflectHeading,
  ReflectPage,
  ReflectPageContent,
  ReflectSkillCodeChip,
  ReflectionCard,
  ReflectionCardHeading,
  ReflectionCardList,
  ReflectionResults,
  ReflectResultsSection,
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
        <ReflectPageContent>
          <FlowNav
            screenSize={screenSize}
            activeTabId="reflect"
            actionLabelKey="flowNav.home"
            onTabSelect={handleTabSelect}
            onAction={() => navigate('/')}
          />
          <ReflectResultsSection>
            <ReflectHeading>
              <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.title')}
              </Typography>
              <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.subtitle')}
              </Typography>
            </ReflectHeading>
            <ReflectionCardList>
              {reflect.implementedActivities.map((activity) => (
                <ReflectionCard key={activity.id} elevation={4}>
                  <ReflectionCardHeading>
                    <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.activitySubtitle')}
                    </Typography>
                  </ReflectionCardHeading>
                  <ActivityContext>
                    <ActivityContextRow>
                      <ReflectSkillCodeChip>
                        {activity.skillCode}
                      </ReflectSkillCodeChip>
                      <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                        {activity.misconceptionTitle}
                      </Typography>
                    </ActivityContextRow>
                    <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.activityDescription')}
                    </Typography>
                  </ActivityContext>
                  <ReflectionResults>
                    <ScoreGroup>
                      <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                        {t('reflect.scoreTitle')}
                      </Typography>
                      <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                        {t('reflect.scoreSubtitle')}
                      </Typography>
                      <ScoreRow>
                        <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                          {t('reflect.percentCorrect', { percent: activity.masteryBefore })}
                        </Typography>
                        <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>→</Typography>
                        <Typography variant="reflectScore" sx={{ color: 'designSystem.status.reflectionImprovement' }}>
                          {t('reflect.percentCorrect', { percent: activity.masteryAfter })}
                        </Typography>
                        <ScoreChange>{t('reflect.averageQuestionsGainPlaceholder')}</ScoreChange>
                      </ScoreRow>
                    </ScoreGroup>
                    <ReflectDetailsButton disableElevation onClick={() => setSelectedActivity(activity)}>
                      {t('reflect.viewDetails')}
                    </ReflectDetailsButton>
                  </ReflectionResults>
                </ReflectionCard>
              ))}
            </ReflectionCardList>
          </ReflectResultsSection>
        </ReflectPageContent>
      </AppContentRow>
    </ReflectPage>
  );
}
