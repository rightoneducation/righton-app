import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, useTheme } from '@mui/material';
import { IQuestionTemplate } from '@righton/networking';
import QuestionCardFixedHeight from '../cards/QuestionCardFixedHeight';
import SkeletonQuestionCard from '../cards/QuestionCardSkeleton';
import placeHolder from '../../images/placeHolder.svg';
import { ScreenSize } from '../../lib/CentralModels';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';
import { MostPopularText } from '../../lib/styledcomponents/CardGalleryStyledComponents';

const MAX_CARDS = 12;

interface QuestionsLibraryGalleryProps {
  screenSize: ScreenSize;
  galleryElements: IQuestionTemplate[];
  isLoading?: boolean;
  handleView?: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Questions-library gallery for the explore questions page.
 *
 * Mirrors GamesLibraryGallery: a flat grid rather than the masonry columns
 * CardGallery builds via reformatElements, and a container that is NOT a scroll
 * container (MostPopularContainer's overflow: auto nests a second scroll region
 * inside the page scroller). CardGallery is left alone for the library and
 * question tabs, which still page.
 */
export default function QuestionsLibraryGallery({
  screenSize,
  galleryElements,
  isLoading = false,
  handleView,
  header = null,
  footer = null,
}: QuestionsLibraryGalleryProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const favoriteQuestionTemplateIds =
    centralData.userProfile?.favoriteQuestionTemplateIds;
  const questions = galleryElements.slice(0, MAX_CARDS);

  // pass the FULL list, not the slice: the page stores it as questionSet, which
  // drives prev/next inside the question tab overlay
  const handleViewButtonClick = (element: IQuestionTemplate) => {
    if (handleView) handleView(element, galleryElements);
  };

  // QuestionCard requires this; GameCard has no equivalent
  const handleCloneButtonClick = (element: IQuestionTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_QUESTION', payload: element });
    navigate(`/clone/question/${element.publicPrivateType}/${element.id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
        padding:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`
            : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        paddingBottom: '128px',
        gap:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px`
            : `${theme.sizing.mdPadding}px`,
        boxSizing: 'border-box',
      }}
    >
      {header ?? (
        <MostPopularText screenSize={screenSize}>
          Question Library
        </MostPopularText>
      )}
      <Grid
        container
        spacing={4}
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '2000px',
        }}
      >
        {isLoading
          ? Array.from({ length: MAX_CARDS }).map((_, index) => (
              <Grid item key={`questions-library-skeleton-${index}`}> {/* eslint-disable-line */}
                <Box
                  sx={{
                    width:
                      screenSize === ScreenSize.LARGE ? '384px' : '327px',
                  }}
                >
                  <SkeletonQuestionCard index={index} />
                </Box>
              </Grid>
            ))
          : questions.map((question) => (
              <Grid item key={question.id}>
                <QuestionCardFixedHeight
                  screenSize={screenSize}
                  id={question.id}
                  title={question.title}
                  image={question.imageUrl || placeHolder}
                  question={question}
                  isFavorite={
                    favoriteQuestionTemplateIds?.includes(question.id) || false
                  }
                  handleViewButtonClick={handleViewButtonClick}
                  handleCloneButtonClick={handleCloneButtonClick}
                />
              </Grid>
            ))}
      </Grid>
      {footer}
    </Box>
  );
}
