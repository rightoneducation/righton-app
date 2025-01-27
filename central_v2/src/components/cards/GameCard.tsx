import React, { useEffect, useState } from 'react';
import { IAPIClients, IGameTemplate } from '@righton/networking';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ScreenSize } from '../../lib/CentralModels';
import heart from '../../images/heart.svg';
import eyeball from '../../images/eyeball.svg';
import rocket from '../../images/rocket.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { ButtonCCSS } from '../../lib/styledcomponents/ButtonStyledComponents';
import FavouriteButton from '../button/favouritebutton/FavouriteButton';

interface StyledGameCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  game: IGameTemplate;
  isCarousel: boolean;
  screenSize: ScreenSize;
  handleViewButtonClick: (element: IGameTemplate) => void;
}

const GameImageContainer = styled(Box)({
  width: '100%',
  height: '186px',
  position: 'relative'
});

const GameImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
});

const CarouselGameImage = styled(GameImage)(({ theme }) => ({
  borderRadius: `${theme.sizing.xSmPadding}px 0 0 0`,
  paddingTop: '1px',
  paddingLeft: '1px',
  paddingRight: '1px',
  boxSizing: 'border-box'
}));

const HeartSVG = styled('img')(({ theme }) => ({
  cursor: 'pointer',
  marginLeft: `${theme.sizing.xxSmPadding}px`,
}));

interface GameCardProps {
  isCarousel: boolean;
  screenSize: ScreenSize;
}

const GameCard = styled(Box)<GameCardProps>(({ isCarousel, screenSize, theme }) => ({
  width: screenSize !== ScreenSize.LARGE ? (isCarousel ? '290px' : '327px') : '384px', // eslint-disable-line
  height: '100%',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: `${theme.sizing.xSmPadding + theme.sizing.xxSmPadding}px`,
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}));

const ButtonContainer = styled (ContentContainer)({
  paddingTop: 0,
  justifyContent: 'flex-end'
});

const TitleTextTypography = styled(Typography)(({ theme }) => ({
  width: '100%',
  lineHeight: '23px',
  gap: `${theme.sizing.xSmPadding}px`,
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '20px',
  color: `${theme.palette.primary.darkBlue}`,
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}));

const CCSSButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: `${theme.sizing.xxSmPadding}px`,
  flexWrap: 'wrap',
  minHeight: `${theme.sizing.mdPadding}px`,
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'start',
    '> *:nth-of-type(n + 4)': {
      marginTop: `${theme.sizing.xxSmPadding}px`,
      marginLeft: '0',
    },
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'start',
    '> *:nth-of-type(n + 5)': {
      marginTop: `${theme.sizing.xxSmPadding}px`,
      marginLeft: '0',
    },
  },
}));

interface DescriptionTextProps {
  buttonCount: number;
}

interface DescriptionTextProps {
  isCarousel: boolean;
}

const DescriptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCarousel',
})<DescriptionTextProps>(({ theme, isCarousel }) => ({
  width: '100%',
  height: 'fit-content',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: `${theme.sizing.smPadding}px`,
  lineHeight: '18.96px',
  color: '#384466',
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: isCarousel ? 5 : 3,
  overflow: 'hidden',
}));

function getDomainAndGrades(game: IGameTemplate) {
  const extractedQuestions = game?.questionTemplates?.map(
    (question) => question.questionTemplate,
  );
  const CCSSArray = extractedQuestions?.map((question) => {
    return `${question.grade}.${question.domain}`;
  });
  return Array.from(new Set(CCSSArray));
}

export default function StyledGameCard({
  id,
  title,
  description,
  image,
  game,
  isCarousel,
  screenSize,
  handleViewButtonClick,
}: StyledGameCardProps) {
  const domainAndGrades = getDomainAndGrades(game);

  return (
    <GameCard isCarousel={isCarousel} screenSize={screenSize}>
      <GameImageContainer>
      {isCarousel 
        ? <CarouselGameImage src={image} alt="Tag" />
        : <GameImage src={image} alt="Tag" />
      }
        <FavouriteButton isEnabled/>
      </GameImageContainer>
      <ContentContainer>
        <TitleTextTypography>{title}</TitleTextTypography>
        <CCSSButtonContainer>
          {domainAndGrades.map((domainGrade) => (
            <ButtonCCSS key={`${domainGrade}-${id}`}>
              {domainGrade}
            </ButtonCCSS>
          ))}
        </CCSSButtonContainer>
        <DescriptionText buttonCount={domainAndGrades.length} isCarousel={isCarousel}>
          {description}
        </DescriptionText>
      </ContentContainer>
      <ButtonContainer>
        <CentralButton
          buttonType={ButtonType.VIEW}
          isEnabled
          onClick={() => handleViewButtonClick(game)}
        />
        <CentralButton
          buttonType={ButtonType.LAUNCH}
          isEnabled
          onClick={() => handleViewButtonClick(game)}
        />
        </ButtonContainer>
    </GameCard>
  );
}
