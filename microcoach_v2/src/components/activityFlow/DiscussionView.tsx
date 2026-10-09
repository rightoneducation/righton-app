import React from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MathTypography from '../MathTypography';
import {
  IActivityContent,
  IDiscussionQuestion,
  IWatchFor,
} from '../../lib/ActivityContentModels';
import { ScreenSize } from '../../lib/MicroCoachModels';
import { DurationChip } from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  AnswerCell,
  FlowCard,
  FlowCardHeader,
  FlowCardTitle,
  PhaseCards,
  QuestionBadge,
  QuestionCell,
  QuestionGrid,
  QuestionRule,
  ScreenSizeProps,
  TakeawayBand,
  TryAskingBlock,
  TryAskingBox,
  TryAskingDetail,
  TryAskingToggle,
  WatchForRow,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';

function Question({ item, number }: { item: IDiscussionQuestion; number: number }) {
  return (
    <QuestionCell>
      <QuestionBadge aria-hidden>{number}</QuestionBadge>
      <MathTypography variant="uploadLabel" component="h3" text={item.question} />
    </QuestionCell>
  );
}

function Answer({ item }: { item: IDiscussionQuestion }) {
  const { t } = useTranslation();
  return (
    <AnswerCell>
      <Typography variant="rubikSubBold" sx={{ color: 'designSystem.background.navyBlue' }}>
        {t('activityFlow.discussion.answer')}
      </Typography>
      <MathTypography variant="smallBodyText" text={item.answer} />
    </AnswerCell>
  );
}

function WatchForCard({ item, index }: { item: IWatchFor; index: number }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const detailId = `watch-for-${index}-detail`;

  return (
    <FlowCard component="section" aria-label={t('activityFlow.discussion.watchForLabel', { number: index + 1 })}>
      <Typography variant="headingLg" component="h3">
        {t('activityFlow.discussion.watchFor')}
      </Typography>
      <MathTypography variant="smallBodyText" text={item.watchFor} />
      <TryAskingBox>
        <TryAskingToggle
          aria-expanded={isOpen}
          aria-controls={detailId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {t('activityFlow.discussion.tryAsking')}
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </TryAskingToggle>
        <Collapse in={isOpen} id={detailId}>
          <TryAskingDetail>
            <MathTypography variant="rubikBody" text={item.tryAsking} />
            <TryAskingBlock>
              <Typography variant="headingSm" component="h4">
                {t('activityFlow.discussion.respondWith')}
              </Typography>
              <MathTypography variant="rubikBody" text={item.howToRespond} />
            </TryAskingBlock>
          </TryAskingDetail>
        </Collapse>
      </TryAskingBox>
    </FlowCard>
  );
}

interface DiscussionViewProps extends ScreenSizeProps {
  content: IActivityContent;
}

/**
 * Closing discussion (InflowScreens/Facilitate_Discussion1, 2): the questions
 * with their answers, up to three Watch for cards (each opening onto Try asking
 * and Respond with), and the mathematical takeaway.
 */
export default function DiscussionView({ content, screenSize }: DiscussionViewProps) {
  const { t } = useTranslation();
  // Generated ids: /preview renders many of these on one page.
  const discussionTitleId = React.useId();
  const takeawayTitleId = React.useId();
  const { questions, watchFors, takeaway } = content.discussion;
  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <PhaseCards>
      <FlowCard component="section" aria-labelledby={discussionTitleId}>
        <FlowCardHeader>
          <FlowCardTitle>
            <Typography id={discussionTitleId} variant="headingLg" component="h2">
              {t('activityFlow.discussion.title')}
            </Typography>
            <Typography variant="rubikBody">
              {t('activityFlow.discussion.subtitle')}
            </Typography>
          </FlowCardTitle>
          <DurationChip>{content.durations.discussion}</DurationChip>
        </FlowCardHeader>

        {/* Across: all questions, one rule, then all answers. Stacked: each
            question keeps its answer. */}
        <QuestionGrid screenSize={screenSize}>
          {isLarge ? (
            <>
              {questions.map((item, index) => (
                <Question key={item.question} item={item} number={index + 1} />
              ))}
              <QuestionRule />
              {questions.map((item) => (
                <Answer key={item.question} item={item} />
              ))}
            </>
          ) : (
            questions.map((item, index) => (
              <React.Fragment key={item.question}>
                {index > 0 && <QuestionRule />}
                <Question item={item} number={index + 1} />
                <Answer item={item} />
              </React.Fragment>
            ))
          )}
        </QuestionGrid>
      </FlowCard>

      {watchFors.length > 0 && (
        <WatchForRow screenSize={screenSize}>
          {watchFors.map((item, index) => (
            <WatchForCard key={item.watchFor} item={item} index={index} />
          ))}
        </WatchForRow>
      )}

      <TakeawayBand component="section" aria-labelledby={takeawayTitleId}>
        <Typography id={takeawayTitleId} variant="headingLg" component="h2">
          {t('activityFlow.discussion.takeaway')}
        </Typography>
        <MathTypography variant="rubikBody" text={takeaway} />
      </TakeawayBand>
    </PhaseCards>
  );
}
