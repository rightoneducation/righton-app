import React from 'react';
import { IQuestionTemplate } from '@righton/networking';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import heart from '../../images/heart.svg';
import eyeball from '../../images/eyeball.svg';
import cloneQuestion from '../../images/cloneQuestion.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

interface StyledQuestionCardProps {
  id: string;
  title: string;
  image: string;
  question: IQuestionTemplate;
  handleViewButtonClick: (element: IQuestionTemplate) => void;
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

const QuestionCard = styled(Box)(({theme}) => ({
  width: '100%', 
  height: 'auto',
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
  height: '100%',
  gap: `${theme.sizing.smPadding}px`,
  display: 'flex',
  flexDirection: 'column',
}));

const TitleContainer = styled(Box)(() => ({
  width: '100%',
  height: '25px',
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

const ImageBox = styled(Box)(({theme}) => ({
  width: '100%',
  height: '130px', 
  gap: `${theme.sizing.xSmPadding}px`,
}));

const SideBySideBox = styled(Box)(({theme}) => ({
  width: '100%',
  height: '100%',
  gap: `${theme.sizing.xSmPadding}px`,
  display: 'flex',
  flexDirection: 'column',
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
  WebkitLineClamp: 6,
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

export default function StyledQuestionCard({ id, title, image, question, handleViewButtonClick }: StyledQuestionCardProps) {
  const domainAndGrade =`${question.grade}.${question.domain}`;

  return (
    <QuestionCard>
      <TextContainer>
        <TitleContainer>
          <SecondaryButton key={`${domainAndGrade}-${id}`}>
            {domainAndGrade}
          </SecondaryButton>
          <HeartSVG src={heart} alt="Tag" />
        </TitleContainer>
        <SideBySideBox>
          <ImageBox>
            <GymSVG src={image} alt='Tag' />
          </ImageBox>
          <DescriptionText>{title}</DescriptionText>
        </SideBySideBox>
      </TextContainer>
      <BottomButtonBox>
        <CentralButton buttonType={ButtonType.VIEW} isEnabled onClick={() => handleViewButtonClick(question)} />
        <PrimaryButton1>
          <LaunchSVG src={cloneQuestion} alt="Clone" />
        </PrimaryButton1>
      </BottomButtonBox>
    </QuestionCard>
  );
}
