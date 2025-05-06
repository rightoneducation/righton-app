import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  IGameTemplate,
  IQuestionTemplate,
  ElementType,
  GalleryType,
} from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../../hooks/context/useCentralDataContext';
import StyledGameCard from '../cards/GameCard';
import StyledQuestionCard from '../cards/QuestionCard';
import { ScreenSize } from '../../lib/CentralModels';
import placeHolder from '../../images/placeHolder.svg';
import SkeletonGameCard from '../cards/GameCardSkeleton';
import SkeletonQuestionCard from '../cards/QuestionCardSkeleton';
import { MostPopularContainer } from '../../lib/styledcomponents/ExploreStyledComponents';
import GalleryHeaderText from './GalleryHeaderText';

interface CardGalleryProps<T> {
  screenSize: ScreenSize;
  galleryElements: T[];
  searchTerm?: string;
  grades?: string[];
  isLoading?: boolean;
  elementType: ElementType;
  galleryType: GalleryType;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleView: (element: T, elements: T[]) => void;
  isMyLibrary?: boolean;
  isMyLibraryQuestion?: boolean;
  isCreateGame?: boolean;
}

interface MostPopularComponentProps<T> {
  mostPopularElements: { [key: number]: T[] };
  maxCards: number;
  isLoading: boolean;
  numColumns: number;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleViewButtonClick: (element: T) => void;
  isCreateGame?: boolean;
}

interface MostPopularGamesComponentProps {
  screenSize: ScreenSize,
  mostPopularElements: IGameTemplate[];
  maxCards: number;
  numColumns: number;
  isLoading: boolean;
  isMyLibrary?: boolean;
  isMyLibraryQuestion?: boolean;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleViewButtonClick: (element: IGameTemplate) => void;
  isCreateGame?: boolean;
}

function MostPopularGamesComponent({
  screenSize,
  mostPopularElements,
  maxCards,
  isLoading,
  numColumns,
  isMyLibrary,
  isMyLibraryQuestion,
  setIsTabsOpen,
  handleViewButtonClick,
  isCreateGame,
}: MostPopularGamesComponentProps) {
  const centralData = useCentralDataState();
  const favoriteGameTemplateIds = centralData.userProfile?.favoriteGameTemplateIds;
  return (
    <Grid container spacing={4} id="scrollableDiv" style={{display: 'flex', justifyContent: 'center', maxWidth: isMyLibrary ? '5000px' : '2000px'}}>
      {(mostPopularElements.length === 0 && isLoading)
        ? Array.from({ length: maxCards }).map((_, index) => {
            return (
              <Grid item key={index}> {/* eslint-disable-line */}
                <SkeletonGameCard screenSize={screenSize} isCarousel={false} index={index} />
              </Grid>
            );
          })
        : mostPopularElements.map((game) => {
          const isFavorite = favoriteGameTemplateIds?.includes(game.id) || false;
            return (
              <Grid item key={game.id}>
                <StyledGameCard
                  screenSize={screenSize}
                  game={game}
                  isCreateGame={isCreateGame}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  image={game.imageUrl || placeHolder}
                  isCarousel={false}
                  isFavorite={isFavorite}
                  isMyLibraryQuestion={isMyLibraryQuestion}
                  handleViewButtonClick={
                    handleViewButtonClick as (element: IGameTemplate) => void
                  }
                />
              </Grid>
            );
          })}
    </Grid>
  );
}

function MostPopularQuestionsComponent({
  mostPopularElements,
  maxCards,
  isLoading,
  numColumns,
  setIsTabsOpen,
  handleViewButtonClick,
  isCreateGame,
}: MostPopularComponentProps<IQuestionTemplate>) {
  const array = Array.from({ length: numColumns });
  const navigate = useNavigate();
  const elementsLength = Object.values(mostPopularElements).reduce(
    (acc, column) => acc + column.length,
    0,
  );
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const favoriteQuestionTemplateIds = centralData.userProfile?.favoriteQuestionTemplateIds;

  const handleCloneButtonClick = (element: IQuestionTemplate) => {
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: element,
    });
    navigate(`/clone/question/${element.id}`);
  }

  return (
    <Grid container spacing={4}   columns={{ xs: 12, sm: 12, md: 12, lg: 7 }} id="scrollableDiv">
      {(elementsLength === 0 && isLoading)
        ? Array.from({ length: maxCards }).map((_, index) => {
            return (
              <Grid item xs={12} md={4} lg={1} key={index}> {/* eslint-disable-line */}
                <SkeletonQuestionCard index={index} />
              </Grid>
            );
          })
        : Array.from({ length: numColumns }).map((_, index) => {
            return (
              <Grid item xs={12} md={4} lg key={uuidv4()}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {mostPopularElements[index] &&
                    mostPopularElements[index].length > 0 &&
                    mostPopularElements[index].map((question) => {
                      const isFavorite = favoriteQuestionTemplateIds?.includes(question.id) || false;
                      return (
                        <StyledQuestionCard
                          question={question}
                          id={question.id}
                          title={question.title}
                          image={question.imageUrl || placeHolder}
                          isCarousel={false}
                          isFavorite={isFavorite}
                          handleViewButtonClick={
                            handleViewButtonClick as (
                              element: IQuestionTemplate,
                            ) => void
                          }
                          handleCloneButtonClick={
                            handleCloneButtonClick as (
                              element: IQuestionTemplate,
                            ) => void
                          }
                        />
                      );
                    })}
                </Box>
              </Grid>
            );
          })}
    </Grid>
  );
}

export default function CardGallery<
  T extends IGameTemplate | IQuestionTemplate,
>({
  screenSize,
  galleryElements,
  elementType,
  searchTerm,
  grades,
  isLoading,
  galleryType,
  setIsTabsOpen,
  handleView,
  isMyLibrary,
  isMyLibraryQuestion,
  isCreateGame
}: CardGalleryProps<T>) {
  const maxCards = 12;
  const getNumColumns = () => {
    switch (screenSize) {
      case ScreenSize.SMALL:
        return 2;
      case ScreenSize.MEDIUM:
        return 3;
      default:
        return 7;
    }
  };
  const reformatElements = <T,>( // eslint-disable-line
    mostPopularElementsMap: T[],
  ): { [key: number]: T[] } => {
    // adjust column number for array indexing
    const numColumns = getNumColumns() - 1;
    const newElements: { [key: number]: T[] } = {};
    if (mostPopularElementsMap.length > 0) {
      for (let i = 0; i <= numColumns; i += 1) {
        newElements[i] = [];
      }
      let currentColumn = 0;
      mostPopularElementsMap.forEach((element) => {
        newElements[currentColumn].push(element);
        if (currentColumn < numColumns) {
          currentColumn += 1;
        } else {
          currentColumn = 0;
        }
      });
    }
    return newElements;
  };

  const handleViewButtonClick = (element: T) => {
    handleView(element, galleryElements as T[]);
  };
  return (
    <MostPopularContainer screenSize={screenSize} isMyLibrary={isMyLibrary}>
      {!isMyLibrary &&
        <GalleryHeaderText<T>
          searchedElements={galleryElements}
          searchedTerm={searchTerm}
          grades={grades}
          isLoading={isLoading}
          screenSize={screenSize}
          galleryType={galleryType}
        /> 
      }
      {elementType === ElementType.GAME ? (
        <MostPopularGamesComponent
          screenSize={screenSize}
          isLoading={isLoading ?? false}
          mostPopularElements={galleryElements as IGameTemplate[]}
          maxCards={maxCards}
          numColumns={getNumColumns()}
          setIsTabsOpen={setIsTabsOpen}
          isMyLibrary={isMyLibrary}
          isMyLibraryQuestion={isMyLibraryQuestion}
          isCreateGame={isCreateGame}
          handleViewButtonClick={
            handleViewButtonClick as (element: IGameTemplate) => void
          }
        />
      ) : (
        <MostPopularQuestionsComponent
          isLoading={isLoading ?? false}
          isCreateGame={isCreateGame}
          mostPopularElements={reformatElements(
            galleryElements as IQuestionTemplate[],
          )}
          maxCards={maxCards}
          numColumns={getNumColumns()}
          setIsTabsOpen={setIsTabsOpen}
          handleViewButtonClick={
            handleViewButtonClick as (element: IQuestionTemplate) => void
          }
        />
      )}
    </MostPopularContainer>
  );
}
