import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId, flowTabPath } from '../components/FlowNav';
import ReflectionDetailModal from '../components/ReflectionDetailModal';
import ReflectSkeleton from '../components/ReflectSkeleton';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { IImplementedActivity } from '../lib/PipelineModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import useReflectionResults from '../hooks/useReflectionResults';
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
  ReflectionCardTop,
  ReflectionInset,
  ReflectionResults,
  ReflectResultsSection,
  ReflectionTrendValue,
  ScoreChange,
  ScoreGroup,
  ScoreRow,
  ScoreValues,
} from '../lib/styledcomponents/ReflectStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { getReflectionTrend } from '../lib/reflectionResults';

type ReflectProps = ScreenSizeProps;
export default function Reflect({ screenSize }: ReflectProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { planItems } = useMicroCoachDataState();
  const { reflect, status } = useReflectionResults();
  const [selectedActivity, setSelectedActivity] =
    React.useState<IImplementedActivity | null>(null);
  const dataReady = status === MicroCoachDataStatus.READY;
  const isReady = useAllReady(useI18nReady(), dataReady);

  if (!isReady) return <ReflectSkeleton screenSize={screenSize} />;

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'reflect') return;
    navigate(flowTabPath(tabId, planItems.length > 0));
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
            compactAction
            onTabSelect={handleTabSelect}
            onAction={() => navigate('/')}
          />
          <ReflectResultsSection>
            <ReflectHeading>
              <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.title')}
              </Typography>
              <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.subtitle')}
              </Typography>
            </ReflectHeading>
            <ReflectionCardList>
              {reflect.implementedActivities.map((activity) => {
                const { questionCount } = activity;
                const percentagePointChange =
                  activity.averagePercentCorrectAfter -
                  activity.averagePercentCorrectBefore;
                const trend = getReflectionTrend(percentagePointChange);
                const averageQuestionChange =
                  activity.averageQuestionsCorrectAfter -
                  activity.averageQuestionsCorrectBefore;
                const formattedQuestionChange = `${
                  averageQuestionChange > 0 ? '+' : ''
                }${averageQuestionChange.toFixed(1)}`;

                return (
                  <ReflectionCard
                    key={activity.id}
                    elevation={1}
                    screenSize={screenSize}
                  >
                    <ReflectionCardTop>
                      <ReflectionCardHeading>
                        <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                          {activity.title}
                        </Typography>
                        <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                          {activity.activityType
                            ? t(`activityTemplates.${activity.activityType}.reflectSubtitle`)
                            : activity.subtitle}
                        </Typography>
                      </ReflectionCardHeading>
                      <ReflectionInset>
                        <ActivityContext>
                          <ActivityContextRow>
                            <ReflectSkillCodeChip>
                              {activity.skillCode}
                            </ReflectSkillCodeChip>
                            <Typography variant="rubikBodyBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                              {activity.misconceptionTitle}
                            </Typography>
                          </ActivityContextRow>
                          <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {activity.description}
                          </Typography>
                        </ActivityContext>
                      </ReflectionInset>
                    </ReflectionCardTop>
                    <ReflectionResults>
                      <ReflectionInset>
                        <ScoreGroup>
                          <Typography variant="reflectSectionTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {t('reflect.scoreTitle')}
                          </Typography>
                          <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {t('reflect.scoreSubtitle', {
                              count: questionCount,
                            })}
                          </Typography>
                          <ScoreRow>
                            <ScoreValues>
                              <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                                {t('reflect.percentCorrect', {
                                  percent: Math.round(activity.averagePercentCorrectBefore),
                                })}
                              </Typography>
                              <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>→</Typography>
                              <ReflectionTrendValue variant="reflectScore" trend={trend}>
                                {t('reflect.percentCorrect', {
                                  percent: Math.round(activity.averagePercentCorrectAfter),
                                })}
                              </ReflectionTrendValue>
                            </ScoreValues>
                            <ScoreChange trend={trend}>
                              {trend === 'unchanged'
                                ? t('reflect.noChange')
                                : t('reflect.averageQuestionsGain', {
                                  change: formattedQuestionChange,
                                })}
                            </ScoreChange>
                          </ScoreRow>
                        </ScoreGroup>
                      </ReflectionInset>
                      <ReflectDetailsButton disableElevation onClick={() => setSelectedActivity(activity)}>
                        {t('reflect.viewDetails')}
                      </ReflectDetailsButton>
                    </ReflectionResults>
                  </ReflectionCard>
                );
              })}
            </ReflectionCardList>
          </ReflectResultsSection>
        </ReflectPageContent>
      </AppContentRow>
    </ReflectPage>
  );
}
