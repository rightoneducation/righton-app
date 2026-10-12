import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId, flowTabPath } from '../components/FlowNav';
import ReflectionDetailModal from '../components/ReflectionDetailModal';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { IImplementedActivity } from '../lib/PipelineModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';
import {
  ActivityContext,
  ActivityContextRow,
  MockDataTag,
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
import { UseSessionsResult } from '../hooks/useSessions';
import buildReflectionResults, {
  getReflectionTrend,
} from '../lib/reflectionResults';

// The result payload does not expose the MIU question count yet. Keeping the
// placeholder in one named value makes it easy to replace when the API does.
const REFLECT_QUESTION_COUNT_PLACEHOLDER = 6;

// Temporary UI preview values. Set both numbers to the same value to preview
// "No change", or use an empty object to display the backend scores again.
const REFLECT_SCORE_TEST_VALUES: { before?: number; after?: number } = {
  before: 64,
  after: 51,
};

interface ReflectProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
}

export default function Reflect({ screenSize, sessions }: ReflectProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { misconceptions, misconceptionsStatus, planItems } =
    useMicroCoachDataState();
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
                const masteryBefore =
                  REFLECT_SCORE_TEST_VALUES.before ?? activity.masteryBefore;
                const masteryAfter =
                  REFLECT_SCORE_TEST_VALUES.after ?? activity.masteryAfter;
                const percentagePointChange =
                  masteryAfter - masteryBefore;
                const trend = getReflectionTrend(percentagePointChange);
                const averageQuestionChange =
                  (percentagePointChange / 100) *
                  REFLECT_QUESTION_COUNT_PLACEHOLDER;
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
                          {t('reflect.activitySubtitle')}
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
                            {t('reflect.activityDescription')}
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
                              count: REFLECT_QUESTION_COUNT_PLACEHOLDER,
                            })}{' '}
                            <MockDataTag>
                              {t('reflect.questionCountPlaceholder', {
                                count: REFLECT_QUESTION_COUNT_PLACEHOLDER,
                              })}
                            </MockDataTag>
                          </Typography>
                          <ScoreRow>
                            <ScoreValues>
                              <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                                {t('reflect.percentCorrect', { percent: masteryBefore })}
                              </Typography>
                              <Typography variant="reflectScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>→</Typography>
                              <ReflectionTrendValue variant="reflectScore" trend={trend}>
                                {t('reflect.percentCorrect', { percent: masteryAfter })}
                              </ReflectionTrendValue>
                            </ScoreValues>
                            <ScoreChange trend={trend}>
                              {trend === 'unchanged'
                                ? t('reflect.noChange')
                                : (
                                  <>
                                    {t('reflect.averageQuestionsGainPlaceholder', {
                                      change: formattedQuestionChange,
                                    })}
                                    <MockDataTag>
                                      {t('reflect.questionChangePlaceholder', {
                                        change: formattedQuestionChange,
                                      })}
                                    </MockDataTag>
                                  </>
                                )}
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
