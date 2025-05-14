import React from 'react';
import { Typography, RadioGroup, Box, Fade, styled, useTheme, InputAdornment, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  QuestionTitleStyled,
  RadioContainerStyled,
  RadioLabelStyled,
  RadioStyled,
  ContentContainerStyled,
  ImageStyled,
  BaseCardStyled,
  TextContainerStyled,
  CCSSIndicator,
  AnswerResponse
} from '../../lib/styledComponents/QOTDStyledComponents';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModel';
import { ScreenSize } from '../../lib/CentralModels'



interface QOTDCardBaseProps {
  screenSize: ScreenSize;
}

type ImagePlaceholderProps = {
  isCardErrored?: boolean;
}

export const ImagePlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCardErrored',
})<ImagePlaceholderProps>(({ theme, isCardErrored }) => ({
  width: '100%',
  height: '100%',
  background: `${theme.palette.primary.uploadLightGrey}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  border: isCardErrored ? `2px solid ${theme.palette.primary.errorBorder}` : `2px solid ${theme.palette.primary.uploadDarkGrey}`,
  borderRadius: '8px',
  boxSizing: 'border-box'
}));

interface QOTDTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const QOTDTitleBarStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<QOTDTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.xSmPadding}px` : `${theme.sizing.smPadding}px`,
}));

export const QOTDContentRightContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const dummyImg = "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const dummyQuestionsList = [
    {id: 0, question: "Which planet is the largest in our solar system?", answers: { a: 'Mars', b: "Jupiter", c: "Venus", d: "Earth" }, correctAnswer: "Jupiter", answerExplanation: "" },
    {id: 1, parentId: 0, question: "Which option is the most common incorrect answer from the previous question?", answers: { a: 'Mars', c: "Venus", d: "Earth" }, correctAnswer: "Mars", answerExplanation: "That's right! Many people mistakenly choose Mars." }
]

export default function QOTDCardBase({
  screenSize,
}: QOTDCardBaseProps) {
  const theme = useTheme();
  const [cardIsComplete, setCardIsComplete] = React.useState<boolean>(false);
  const [answer, setAnswer] = React.useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const currentQuestion = dummyQuestionsList[currentQuestionIndex];
  const [answerAlert, setAnswerAlert] = React.useState("");
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
 

  const handleAnswerSubmit = () => {
    if(answer === currentQuestion.correctAnswer) {
        setAnswerAlert("Correct! Redirecting to phase 2.");
        setIsCorrect(true);
        if(currentQuestionIndex === 0) {
            setTimeout(() => {
                setCurrentQuestionIndex((prev) => prev + 1);
                setAnswer("");
                setAnswerAlert("");
            }, 2000);
        } else if(currentQuestionIndex === 1){
            setAnswerAlert(currentQuestion.answerExplanation);
        }
    } else {
        setAnswerAlert("Not Quite. Try Again!");
        setIsCorrect(false);
    }
  };

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer((event.target as HTMLInputElement).value)
  }

  return (
    <BaseCardStyled elevation={6}>
      <QOTDTitleBarStyled screenSize={screenSize}>
        {(screenSize === ScreenSize.SMALL) && (
        <RadioContainerStyled>
          <RadioGroup
            value={answer}
            onChange={handleAnswerSelect}
            style={{overflow: 'hidden', flexWrap: 'nowrap'}}
          >
           {Object.entries(currentQuestion.answers).map(([key, value]) => {
        if (!value) return null;
        return (
            <RadioLabelStyled
            key={key}
            value={value}
            control={<RadioStyled style={{cursor: 'pointer'}} />}
            label={value}
            isSelected={answer === value}
            style={{cursor: 'pointer'}}
            />
        );
        })}
          </RadioGroup>
        </RadioContainerStyled>
          )}
      
      </QOTDTitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        <QOTDContentRightContainerStyled>
        <Box style={{width: '100%', display: 'flex', justifyContent: screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start', alignItems: 'center', gap: '14px'}}>
          {/* Question will go in <QuestionTitleStyled /> */}
          <QuestionTitleStyled sx={{ color: "#384466"}}>{currentQuestion.question}</QuestionTitleStyled>
        </Box>
          {screenSize !== ScreenSize.SMALL && (
            
        <RadioContainerStyled>
          <RadioGroup
            value={answer} 
            onChange={handleAnswerSelect}
            style={{overflow: 'hidden', flexWrap: 'nowrap'}}
          >
        {Object.entries(currentQuestion.answers).map(([key, value]) => {
        if (!value) return null;
        return (
            <RadioLabelStyled
            key={key}
            value={value}
            control={<RadioStyled style={{cursor: 'pointer'}} />}
            label={value}
            isSelected={answer === value}
            style={{cursor: 'pointer'}}
            />
        );
        })}
          </RadioGroup>
        </RadioContainerStyled>
          )}
          <Box sx={{ minHeight: "60px" }}>
          {answerAlert && ( <AnswerResponse isCorrect={Boolean(isCorrect)}>{answerAlert}</AnswerResponse>)}
          </Box>
       <CentralButton buttonType={ButtonType.VERIFY} onClick={handleAnswerSubmit} isEnabled={!!answer}  />
        </QOTDContentRightContainerStyled>
        <ImagePlaceholder>
            <img src={dummyImg} alt="qotd-img" width="100%" height="100%" style={{ borderRadius: '8px'}} />
        </ImagePlaceholder>   
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
