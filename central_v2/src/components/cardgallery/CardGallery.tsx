import React from 'react';
import { Grid, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  IGameTemplate,
  IQuestionTemplate,
  ElementType,
  GalleryType,
} from '@righton/networking';
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
}

interface MostPopularComponentProps<T> {
  mostPopularElements: { [key: number]: T[] };
  maxCards: number;
  isLoading: boolean;
  numColumns: number;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleViewButtonClick: (element: T) => void;
}

interface MostPopularGamesComponentProps {
  mostPopularElements: IGameTemplate[];
  maxCards: number;
  numColumns: number;
  isLoading: boolean;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleViewButtonClick: (element: IGameTemplate) => void;
}

function MostPopularGamesComponent({
  mostPopularElements,
  maxCards,
  isLoading,
  numColumns,
  setIsTabsOpen,
  handleViewButtonClick,
}: MostPopularGamesComponentProps) {
  return (
    <Grid container spacing={2} id="scrollableDiv">
      {(mostPopularElements.length === 0 && isLoading)
        ? Array.from({ length: maxCards }).map((_, index) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={index}> {/* eslint-disable-line */}
                <SkeletonGameCard index={index} />
              </Grid>
            );
          })
        : mostPopularElements.map((game) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <StyledGameCard
                  game={game}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  image={game.imageUrl || placeHolder}
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
}: MostPopularComponentProps<IQuestionTemplate>) {
  const array = Array.from({ length: numColumns });
  const elementsLength = Object.values(mostPopularElements).reduce(
    (acc, column) => acc + column.length,
    0,
  );
  return (
    <Grid container spacing={2} id="scrollableDiv">
      {(elementsLength === 0 && isLoading)
        ? Array.from({ length: maxCards }).map((_, index) => {
            return (
              <Grid item xs={12} md={4} lg={2} key={index}> {/* eslint-disable-line */}
                <SkeletonQuestionCard index={index} />
              </Grid>
            );
          })
        : Array.from({ length: numColumns }).map((_, index) => {
            return (
              <Grid item xs={12} md={4} lg={2.4} key={uuidv4()}>
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
                      return (
                        <StyledQuestionCard
                          question={question}
                          id={question.id}
                          title={question.title}
                          image={question.imageUrl || placeHolder}
                          handleViewButtonClick={
                            handleViewButtonClick as (
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
}: CardGalleryProps<T>) {
  const maxCards = 12;
  const getNumColumns = () => {
    switch (screenSize) {
      case ScreenSize.SMALL:
        return 2;
      case ScreenSize.MEDIUM:
        return 3;
      default:
        return 5;
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
    <MostPopularContainer screenSize={screenSize}>
      <GalleryHeaderText<T>
        searchedElements={galleryElements}
        searchedTerm={searchTerm}
        grades={grades}
        isLoading={isLoading}
        screenSize={screenSize}
        galleryType={galleryType}
      />
      {elementType === ElementType.GAME ? (
        <MostPopularGamesComponent
          isLoading={isLoading ?? false}
          mostPopularElements={galleryElements as IGameTemplate[]}
          maxCards={maxCards}
          numColumns={getNumColumns()}
          setIsTabsOpen={setIsTabsOpen}
          handleViewButtonClick={
            handleViewButtonClick as (element: IGameTemplate) => void
          }
        />
      ) : (
        <MostPopularQuestionsComponent
          isLoading={isLoading || false}
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
