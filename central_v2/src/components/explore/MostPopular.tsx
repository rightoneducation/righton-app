import React from 'react';
import { Grid, Typography, Box, styled, useTheme, Grow, Fade, Skeleton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IGameTemplate, IQuestionTemplate, ElementType } from '@righton/networking';
import StyledGameCard from '../cards/GameCard';
import StyledQuestionCard from '../cards/QuestionCard';
import { ScreenSize } from '../../lib/CentralModels';
import placeHolder from '../../images/placeHolder.svg';
import SkeletonGameCard from '../cards/GameCardSkeleton';
import { MostPopularContainer } from '../../lib/styledcomponents/ExploreStyledComponents';

interface MostPopularProps {
  screenSize: ScreenSize;
  mostPopularElements: IGameTemplate[] | IQuestionTemplate[];
  elementType: ElementType;
}

interface MostPopularTextProps {
    screenSize: ScreenSize;
  }

  const MostPopularText = styled(Typography)<MostPopularTextProps>(({ theme, screenSize }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
}));

interface MostPopularComponentProps<T> {
  mostPopularElements: { [key: number]: T[] };
  maxCards: number;
  numColumns: number;
}

interface MostPopularGamesComponentProps {
  mostPopularElements: IGameTemplate[];
  maxCards: number;
  numColumns: number;
}

function MostPopularGamesComponent({ mostPopularElements, maxCards, numColumns }: MostPopularGamesComponentProps){
  return (
    <Grid container spacing={2} id="scrollableDiv" >
    {mostPopularElements.length === 0 
      ? Array.from({ length: maxCards }).map((_, index) => {
        return (
          <Grid item xs={12} md={6} xl={4} key={index}> {/* eslint-disable-line */}
            <SkeletonGameCard index={index} />
          </Grid>
        );
        })
      : mostPopularElements.map((game) => {
        return (
          <Grid item xs={12} md={6} xl={4} key={game.id}> {/* eslint-disable-line */}
           <StyledGameCard
              game={game}
              id={game.id}
              title={game.title}
              description={game.description}
              image={game.imageUrl || placeHolder}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}


// {mostPopularElements.length === 0 
//   ? Array.from({ length: maxCards }).map((_, index) => {
//     return (
//       <Grid item xs={12} md={6} xl={4} key={index}> {/* eslint-disable-line */}
//         <SkeletonGameCard index={index} />
//       </Grid>
//     );
//     })
//   : mostPopularElements.map((question) => {
//     return (
//       <Grid item xs={6} md={4} lg={2} key={question.id}> {/* eslint-disable-line */}
//        <StyledQuestionCard
//           question={question}
//           id={question.id}
//           title={question.title}
//           image={question.imageUrl || placeHolder}
//         />
//       </Grid>
//     );
//   })}

function MostPopularQuestionsComponent ({mostPopularElements, maxCards, numColumns}: MostPopularComponentProps<IQuestionTemplate>){
  const array = Array.from({length: numColumns});
  return (
    <Grid container spacing={2} id="scrollableDiv" >
      {mostPopularElements && Array.from({ length: numColumns }).map((_, index) => {
        return (
          <Grid item xs={12} md={4} lg={2} key={uuidv4()}> 
            <Box style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {
                mostPopularElements[index] && mostPopularElements[index].length > 0 && mostPopularElements[index].map((question) => {
                  return (
                    <StyledQuestionCard 
                      question={question}
                      id={question.id}
                      title={question.title}
                      image={question.imageUrl || placeHolder}
                    />
                  )
                })
              }
          </Box>
          </Grid>
        );
      })
    }
    </Grid>
  );
}


export default function MostPopular({ screenSize, mostPopularElements, elementType }: MostPopularProps) {
  const maxCards = 12;
  const getNumColumns = () => {
    switch(screenSize){
      case (ScreenSize.SMALL):
        return 2;
      case (ScreenSize.MEDIUM):
        return 3;
      default:
        return 6;
    }
  }

  const reformatElements = <T,>(mostPopularElementsMap: T[]): { [key: number]: T[] } => {
    // adjust column number for array indexing
    const numColumns = getNumColumns() - 1;
    const newElements: { [key: number]: T[] } = {};
    if (mostPopularElementsMap.length > 0){
      for (let i = 0; i <= numColumns; i+=1 ){
        newElements[i] = [];
      }
      let currentColumn = 0;
      mostPopularElementsMap.forEach((element) => {
        newElements[currentColumn].push(element);
        if (currentColumn < numColumns){
          currentColumn+=1;
        } else {
          currentColumn=0;
        }
      })
    }
    return newElements;
  }
  return (
    <MostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
      { elementType === ElementType.GAME 
        ? <MostPopularGamesComponent mostPopularElements={mostPopularElements as IGameTemplate[]} maxCards={maxCards} numColumns={getNumColumns()}/>
        : <MostPopularQuestionsComponent mostPopularElements={reformatElements(mostPopularElements as IQuestionTemplate[])} maxCards={maxCards} numColumns={getNumColumns()}/>
      }
    </MostPopularContainer>
  );
}
