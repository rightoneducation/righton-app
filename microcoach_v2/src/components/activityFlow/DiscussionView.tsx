import React from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MathTypography from '../MathTypography';
import { ReviewSlot, useReviewLayer } from './ReviewSlot';
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
  WatchForTextSpacer,
  WatchForTextStack,
  flowCardHeadingSx,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';

function Question({ item, number }: { item: IDiscussionQuestion; number: number }) {
  return (
    <QuestionCell>
      <QuestionBadge aria-hidden>{number}</QuestionBadge>
      {/* Rubik 20 (dev QA 2026-10-30; the frames drew 16); answers 14. */}
      <ReviewSlot paths={[`content.discussion.questions[${number - 1}].question`, `content.discussion.questions[${number - 1}].minutes`]}>
        <MathTypography variant="h4" component="h3" text={item.question} />
      </ReviewSlot>
    </QuestionCell>
  );
}

function Answer({ item, index }: { item: IDiscussionQuestion; index: number }) {
  const { t } = useTranslation();
  return (
    <AnswerCell>
      <Typography variant="rubikSubBold" sx={{ color: 'designSystem.background.navyBlue' }}>
        {t('activityFlow.discussion.answer')}
      </Typography>
      <ReviewSlot paths={`content.discussion.questions[${index}].answer`}>
        <MathTypography variant="smallBodyText" text={item.answer} />
      </ReviewSlot>
    </AnswerCell>
  );
}

interface WatchForCardProps {
  item: IWatchFor;
  index: number;
  // Every card's Watch for text, side by side at LARGE: the text slot holds
  // the tallest. Empty when the cards stack.
  rowTexts: string[];
}

function WatchForCard({ item, index, rowTexts }: WatchForCardProps) {
  const { t } = useTranslation();
  const path = `content.discussion.watchFors[${index}]`;
  const review = useReviewLayer();
  // Under review, a card with an issue in Try asking or Respond with starts
  // open, so the issue is in view. Without a review layer it starts closed.
  const [isOpen, setIsOpen] = React.useState(
    () => (review?.issueCount([`${path}.tryAsking`, `${path}.howToRespond`]) ?? 0) > 0,
  );
  const detailId = `watch-for-${index}-detail`;

  return (
    <FlowCard component="section" aria-label={t('activityFlow.discussion.watchForLabel', { number: index + 1 })}>
      <Typography variant="headingLg" component="h3" sx={flowCardHeadingSx}>
        {t('activityFlow.discussion.watchFor')}
      </Typography>
      <WatchForTextStack>
        <ReviewSlot paths={`${path}.watchFor`}>
          <MathTypography variant="smallBodyText" text={item.watchFor} />
        </ReviewSlot>
        {rowTexts.map((text, textIndex) =>
          textIndex === index ? null : (
            // eslint-disable-next-line react/no-array-index-key -- texts can repeat; position is the identity
            <WatchForTextSpacer key={textIndex} aria-hidden>
              <MathTypography variant="smallBodyText" text={text} />
            </WatchForTextSpacer>
          ),
        )}
      </WatchForTextStack>
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
            <ReviewSlot paths={`${path}.tryAsking`}>
              <MathTypography variant="rubikBody" text={item.tryAsking} />
            </ReviewSlot>
            <TryAskingBlock>
              <Typography variant="headingSm" component="h4">
                {t('activityFlow.discussion.respondWith')}
              </Typography>
              <ReviewSlot paths={`${path}.howToRespond`}>
                <MathTypography variant="rubikBody" text={item.howToRespond} />
              </ReviewSlot>
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
            <Typography id={discussionTitleId} variant="headingLg" component="h2" sx={flowCardHeadingSx}>
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
              {questions.map((item, index) => (
                <Answer key={item.question} item={item} index={index} />
              ))}
            </>
          ) : (
            questions.map((item, index) => (
              <React.Fragment key={item.question}>
                {index > 0 && <QuestionRule />}
                <Question item={item} number={index + 1} />
                <Answer item={item} index={index} />
              </React.Fragment>
            ))
          )}
        </QuestionGrid>
      </FlowCard>

      {watchFors.length > 0 && (
        <WatchForRow screenSize={screenSize}>
          {watchFors.map((item, index) => (
            <WatchForCard
              key={item.watchFor}
              item={item}
              index={index}
              rowTexts={isLarge ? watchFors.map((entry) => entry.watchFor) : []}
            />
          ))}
        </WatchForRow>
      )}

      <TakeawayBand component="section" aria-labelledby={takeawayTitleId}>
        <Typography id={takeawayTitleId} variant="headingLg" component="h2" sx={flowCardHeadingSx}>
          {t('activityFlow.discussion.takeaway')}
        </Typography>
        <ReviewSlot paths="content.discussion.takeaway">
          <MathTypography variant="rubikBody" text={takeaway} />
        </ReviewSlot>
      </TakeawayBand>
    </PhaseCards>
  );
}
