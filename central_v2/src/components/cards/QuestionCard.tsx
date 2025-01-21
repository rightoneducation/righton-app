import React from 'react';
import { IQuestionTemplate } from '@righton/networking';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { ButtonCCSS } from '../../lib/styledcomponents/ButtonStyledComponents';
import FavouriteButton from '../button/favouritebutton/FavouriteButton';

interface StyledQuestionCardProps {
  id: string;
  title: string;
  image: string;
  question: IQuestionTemplate;
  isCarousel: boolean;
  handleViewButtonClick: (element: IQuestionTemplate) => void;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
});

const CarouselQuestionImage = styled(QuestionImage)(({ theme }) => ({
  borderRadius: `${theme.sizing.xSmPadding}px 0 0 0`,
  paddingTop: '1px',
  paddingLeft: '1px',
  paddingRight: '1px',
  boxSizing: 'border-box'
}));

const QuestionCard = styled(Box)(({ theme }) => ({
  maxWidth: '275px',
  height: '100%',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
  position: 'relative'
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

const TitleContainer = styled(Box)(() => ({
  width: '100%',
  height: '25px',
  display: 'flex',
  justifyContent: 'space-between',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
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
  WebkitLineClamp: 5,
}));

const BottomButtonBox = styled(Box)(({ theme }) => ({
  width: '100%',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export default function StyledQuestionCard({
  id,
  title,
  image,
  question,
  isCarousel,
  handleViewButtonClick,
}: StyledQuestionCardProps) {
  const domainAndGrade = `${question.grade}.${question.domain}`;
  return (
    <QuestionCard>
      { isCarousel 
        ? <CarouselQuestionImage src={image} alt="Tag" />  
        : <QuestionImage src={image} alt="Tag" />       
      }
      <FavouriteButton isEnabled/>
      <ContentContainer>
        <TitleContainer>
          <ButtonCCSS key={`${domainAndGrade}-${id}`}>
            {domainAndGrade}
          </ButtonCCSS>
        </TitleContainer>
        <DescriptionText>{title}</DescriptionText>
        <BottomButtonBox>
          <CentralButton
            buttonType={ButtonType.VIEW}
            isEnabled
            onClick={() => handleViewButtonClick(question)}
          />
          <CentralButton
            buttonType={ButtonType.CLONE}
            isEnabled
            onClick={() => handleViewButtonClick(question)}
          />
        </BottomButtonBox>
      </ContentContainer>
    </QuestionCard>
  );
}
