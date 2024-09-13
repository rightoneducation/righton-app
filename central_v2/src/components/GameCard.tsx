import React, { useEffect, useState } from 'react';
import { APIClients, IGameTemplate, GameTemplate } from '@righton/networking';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import heart from '../images/heart.svg';
import eyeball from '../images/eyeball.svg';
import rocket from '../images/rocket.svg';

interface StyledGameCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  apiClients: APIClients;
  game: IGameTemplate;
}

const GymSVG = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const HeartSVG = styled('img')(({theme}) =>({
  cursor: 'pointer',
  marginLeft: `${theme.sizing.xxSmPadding}px`,
}));

const ViewSVG = styled('img')({
  cursor: 'pointer',
});

const LaunchSVG = styled('img')({
  cursor: 'pointer',
});

const GameCard = styled(Box)(({theme}) => ({
  width: '100%', 
  height: '100%',
  padding: `12px ${theme.sizing.smPadding}px 12px ${theme.sizing.smPadding}px`,
  gap: `${theme.sizing.smPadding}px`,
  borderRadius: `${theme.sizing.smPadding}px`,
  boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'visible',
}));

const TextContainer = styled(Box)(({theme}) => ({
  width: '100%',
  height: '182px',
  gap: `${theme.sizing.smPadding}px`,
  display: 'flex',
  flexDirection: 'column',
}));

const TitleContainer = styled(Box)(() => ({
  width: '100%',
  height: '130px',
  display: 'flex',
  justifyContent: 'space-between',
}));

const TitleTextTypography = styled(Typography)(({theme}) => ({
  width: '100%',
  lineHeight: '30px',
  gap: `${theme.sizing.xSmPadding}px`,
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '20px',
  color: '#384466',
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}));

const TextAndImageBox = styled(Box)(({theme}) => ({
  flex: 1,
  height: '136px',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible',
  position: 'relative',
}));

const SideBySideBox = styled(Box)(({theme}) => ({
  width: '100%',
  height: '136px',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'row',
}));

interface SmallSideBySideBoxProps {
  buttonCount: number;
}

const SmallSideBySideBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'buttonCount',
})<SmallSideBySideBoxProps>(({ theme, buttonCount }) => ({
  width: '100%',
  height: buttonCount > 2 ? `${theme.sizing.xLgPadding}px` : `${theme.sizing.mdPadding}px`, // Default height based on button count
  display: 'flex',
  flexDirection: 'column',
  position: 'relative', 
  overflow: 'visible',
  marginTop: '7px',
  // dynamic height adjustments for the red buttons
  [theme.breakpoints.down('sm')]: {
    height: buttonCount > 2 ? `${theme.sizing.xLgPadding}px` : `${theme.sizing.mdPadding}px`, // Height if more than 2 buttons on small screens
  },

  [theme.breakpoints.up('md')]: {
    height: buttonCount > 3 ? `${theme.sizing.xLgPadding}px` : `${theme.sizing.mdPadding}px`, // Height if more than 3 buttons on medium and larger screens
  },
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: `${theme.sizing.xxSmPadding}px`,
  position: 'absolute',
  bottom: 0,
  left: 0,
  flexWrap: 'wrap',

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

const DescriptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'buttonCount',
})<DescriptionTextProps>(({ theme, buttonCount }) => ({
  flex: 1,
  height: 'auto',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: `${theme.sizing.smPadding}px`,
  lineHeight: '18.96px',
  color: '#384466',
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: buttonCount > 3 ? 4 : 5,
  [theme.breakpoints.up('sm')]: {
    WebkitLineClamp: buttonCount > 2 ? 4 : 5, // 4 lines if > 3 buttons on medium or larger screens
  },
  [theme.breakpoints.up('md')]: {
    WebkitLineClamp: buttonCount > 3 ? 4 : 5, // 4 lines if > 4 buttons on large screens
  },
}));

const BottomButtonBox = styled(Box)(({theme}) => ({
  width: '100%',
  height: '38px',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
}));

const PrimaryButton1 = styled(Button)(({theme}) => ({
  width: 'auto',
  height: '38px',
  padding: `${theme.sizing.xxSmPadding}px 12px`,
  gap: `${theme.sizing.xSmPadding}px`,
  borderRadius: '54px',
  background: 'linear-gradient(270.1deg, #1C94C3 0.09%, #2A6AC6 64.33%, #2C62C6 76.27%, #3153C7 99.91%)',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  color: '#FFFFFF',
  textTransform: 'none',
}));

const SecondaryButton = styled(Button)(({theme}) => ({
  width: 'auto',
  height: `${theme.sizing.mdPadding}px`,
  padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.xSmPadding}px`,
  gap: `${theme.sizing.xxSmPadding}px`,
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '16.59px',
  textAlign: 'center',
  boxShadow: '0px 3px 12px 0px #95002366',
  zIndex: 2, 
  boxSizing: 'border-box',
  minWidth: '20px',
}));

function getDomainAndGrades(game: IGameTemplate) {
  const extractedQuestions = game?.questionTemplates?.map((question) => question.questionTemplate);
  const CCSSArray = extractedQuestions?.map((question) => {
    return `${question.grade}.${question.domain}`;
  });
  return Array.from(new Set(CCSSArray));
}

export default function StyledGameCard({ id, title, description, image, apiClients, game }: StyledGameCardProps) {
  const domainAndGrades = getDomainAndGrades(game);

  return (
    <GameCard>
      <TextContainer>
        <TitleContainer>
          <TitleTextTypography>{title}</TitleTextTypography>
          <HeartSVG src={heart} alt="Tag" />
        </TitleContainer>
        <SideBySideBox>
          <TextAndImageBox>
            <DescriptionText buttonCount={domainAndGrades.length}>{description}</DescriptionText>
            <SmallSideBySideBox buttonCount={domainAndGrades.length}>
              <ButtonWrapper>
                {domainAndGrades.map((domainGrade) => (
                  <SecondaryButton key={`${domainGrade}-${id}`}>
                    {domainGrade}
                  </SecondaryButton>
                ))}
              </ButtonWrapper>
            </SmallSideBySideBox>
          </TextAndImageBox>
          <TextAndImageBox>
            <GymSVG src={image} alt='Tag' />
          </TextAndImageBox>
        </SideBySideBox>
      </TextContainer>
      <BottomButtonBox>
        <PrimaryButton1>
          <ViewSVG src={eyeball} alt="Tag" />
          View
        </PrimaryButton1>
        <PrimaryButton1>
          <LaunchSVG src={rocket} alt="Tag" />
          Launch
        </PrimaryButton1>
      </BottomButtonBox>
    </GameCard>
  );
}
