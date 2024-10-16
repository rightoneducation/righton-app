import React from 'react';
import { Grid, Typography, Box, styled, useTheme, Grow, Fade, Skeleton } from '@mui/material';
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

interface MostPopularGamesComponentProps {
  mostPopularElements: IGameTemplate[];
  maxCards: number;
}

function MostPopularGamesComponent({ mostPopularElements, maxCards }: MostPopularGamesComponentProps){
  return (
    <Box>
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
    </Box>
  );
}

interface MostPopularQuestionsComponentProps {
  mostPopularElements: IQuestionTemplate[];
  maxCards: number;
}

function MostPopularQuestionsComponent ({mostPopularElements, maxCards}: MostPopularQuestionsComponentProps){
  return (
    <Box style={{width: '100%'}}>
    {mostPopularElements.length === 0 
      ? Array.from({ length: maxCards }).map((_, index) => {
        return (
          <Grid item xs={12} md={6} xl={4} key={index}> {/* eslint-disable-line */}
            <SkeletonGameCard index={index} />
          </Grid>
        );
        })
      : mostPopularElements.map((question) => {
        return (
          <Grid item xs={12} md={6} xl={4} key={question.id}> {/* eslint-disable-line */}
           <StyledQuestionCard
              question={question}
              id={question.id}
              title={question.title}
              image={question.imageUrl || placeHolder}
            />
          </Grid>
        );
      })}
    </Box>
  );
}


export default function MostPopular({ screenSize, mostPopularElements, elementType }: MostPopularProps) {
  const maxCards = 12;
  return (
    <MostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
        <Grid container spacing={2} id="scrollableDiv" >
          { elementType === ElementType.GAME 
            ? <MostPopularGamesComponent mostPopularElements={mostPopularElements as IGameTemplate[]} maxCards={maxCards}/>
            : <MostPopularQuestionsComponent mostPopularElements={mostPopularElements as IQuestionTemplate[]} maxCards={maxCards}/>
          }
        </Grid>
    </MostPopularContainer>
  );
}
