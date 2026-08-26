import React from 'react';
import { Box, styled } from '@mui/material';
import { IQuestionTemplate } from '@righton/networking';
import StyledQuestionCard from './QuestionCard';
import { ScreenSize } from '../../lib/CentralModels';

interface FixedBoxProps {
  screenSize: ScreenSize;
}

/**
 * Fixed-size frame for a question card.
 *
 * QuestionCard is `width: 100%; height: 100%` and takes its size from its
 * parent -- fine inside the masonry columns and the carousel's fixed slide, but
 * in a flat Grid item with no breakpoints it collapses to its content width.
 * This frame supplies the missing dimensions so the flat grid can use it,
 * without touching QuestionCard or either of its existing consumers.
 *
 * Width mirrors GameCard's breakpoints; height matches QuestionCardSkeleton's
 * 455px so cards and skeletons occupy identical space.
 *
 * The description clamps to 7 lines here rather than QuestionCard's default 5 --
 * the taller fixed frame has room for them. `isFixedHeight` is what makes that
 * clamp actually bite: QuestionCard's text box is flex: 1 by default, which
 * stretches it past the clamp so nothing is left to clip. Both are props so the
 * carousel and the masonry CardGallery render exactly as they did before,
 * matching how GameCard varies its own clamp per consumer.
 */
const FixedHeightBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<FixedBoxProps>(({ screenSize }) => ({
  width: screenSize === ScreenSize.LARGE ? '384px' : '327px',
  height: '455px',
  display: 'flex',
}));

interface QuestionCardFixedHeightProps {
  screenSize: ScreenSize;
  id: string;
  title: string;
  image: string;
  question: IQuestionTemplate;
  isFavorite: boolean;
  handleViewButtonClick: (element: IQuestionTemplate) => void;
  handleCloneButtonClick: (element: IQuestionTemplate) => void;
}

export default function QuestionCardFixedHeight({
  screenSize,
  id,
  title,
  image,
  question,
  isFavorite,
  handleViewButtonClick,
  handleCloneButtonClick,
}: QuestionCardFixedHeightProps) {
  return (
    <FixedHeightBox screenSize={screenSize}>
      <StyledQuestionCard
        id={id}
        title={title}
        image={image}
        question={question}
        isCarousel={false}
        isFavorite={isFavorite}
        descriptionLineClamp={7}
        isFixedHeight
        handleViewButtonClick={handleViewButtonClick}
        handleCloneButtonClick={handleCloneButtonClick}
      />
    </FixedHeightBox>
  );
}
