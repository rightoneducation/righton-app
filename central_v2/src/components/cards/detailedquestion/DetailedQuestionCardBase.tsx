import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, styled } from '@mui/material';
import image from '../../../images/RightOnLogo.png';

const BaseCardStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
}));

const TitleBarStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const QuestionTitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: '#000',
}));

const RadioContainerStyled = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}));

type RadioLabelProps = {
  isSelected: boolean;
}

const RadioLabelStyled = styled(FormControlLabel)<RadioLabelProps>(({ theme, isSelected }) => ({
  color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)',
  '& .MuiTypography-root': {
    color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)',
  },
}));

const RadioStyled = styled(Radio)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.2)',
  '&.Mui-checked': {
    color: `${theme.palette.primary.mediumBlue}`,
  },
  
}));

const ContentContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '175px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

const ImageStyled = styled('img')({
  width: '100%',
  height: '175px',
  objectFit: 'cover',
});

const ContentRightContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const TextContainerStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  flexGrow: 1,
  background: `${theme.palette.primary.lightGrey}`,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  padding: `${theme.sizing.xSmPadding}px`,
}));

const CCSSIndicator = styled(Box)(({theme}) => ({
  width: 'fit-content',
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

export default function DetailedQuestionCardBase() {
  const [questionType, setQuestionType] = React.useState<string>('A'); 
  console.log(questionType);
  const handleQuestionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionType((event.target as HTMLInputElement).value);
  }

  return (
    <BaseCardStyled>
      <TitleBarStyled>
        <QuestionTitleStyled>
          Question
        </QuestionTitleStyled>
        <RadioContainerStyled>
          <RadioGroup
            row
            value={questionType}
            onChange={handleQuestionTypeChange}
          >
            <RadioLabelStyled
              value="A"
              control={<RadioStyled />}
              label='Multiple Choice'
              isSelected={questionType === 'A'}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled />}
              label='Short Answer'
              isSelected={questionType === 'B'}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </TitleBarStyled>
      <ContentContainerStyled>
        <ImageStyled src={image} alt="image" />
        <ContentRightContainerStyled>
          <TextContainerStyled> 
            <Typography>
              Question: What is the capital of France?
            </Typography>
          </TextContainerStyled>
          <CCSSIndicator>
            7.RP.G.4
          </CCSSIndicator>
        </ContentRightContainerStyled>      
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}