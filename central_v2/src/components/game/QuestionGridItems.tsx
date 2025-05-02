import React from 'react';
import {
  Grid,
  Box,
  Typography,
  useTheme,

  Switch,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AnswerType,
  CentralQuestionTemplateInput,
  IncorrectCard,
  PublicPrivateType,
} from '@righton/networking';

import {
  CreateQuestionHighlightCard,
  ScreenSize,
} from '../../lib/CentralModels';
import { SubCardGridItem } from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import CorrectAnswerCard from '../cards/createquestion/CorrectAnswerCard';
import CreateQuestionCardBase from '../cards/createquestion/CreateQuestionCardBase';
import IncorrectAnswerCardStack from '../cards/createquestion/stackedcards/IncorrectAnswerCardStack';

const AISwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#CCCCCC',
    opacity: 1,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      left: 12,
    },
    '&::after': {
      right: 12,
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-thumb': {
    background: theme.palette.primary.aiGradient,
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#CCCCCC',
  },
}));


interface IQuestionElements {
  screenSize: ScreenSize;
  draftQuestion: CentralQuestionTemplateInput;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
  isAIEnabled: boolean;
  highlightCard: CreateQuestionHighlightCard;
  incompleteIncorrectAnswers: IncorrectCard[];
  completeIncorrectAnswers: IncorrectCard[];
  isPublic: boolean;
  isMultipleChoice: boolean;
  handleAnswerType: () => void;
  handleImageUploadClick: () => void;
  handlePublicPrivateChange: (val: PublicPrivateType) => void;
  handleSaveQuestion: () => Promise<void>;
  handleDiscardQuestion: () => void;
  handleAIError: () => void;
  handleClick: (cardType: CreateQuestionHighlightCard) => void
  handleNextCardButtonClick: (cardData: IncorrectCard) => void;
  handleCCSSClick: () => void;
  handleAIIsEnabled: () => void;
  handleIncorrectCardStackUpdate: (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => void;
  handleDebouncedTitleChange: (title: string, draftQuestionInput: CentralQuestionTemplateInput) => void;
  handleDebouncedCorrectAnswerChange: (correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => void;
  handleDebouncedCorrectAnswerStepsChange: (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => void
}

export default function QuestionElements({
  screenSize,
  draftQuestion,
  isCardSubmitted,
  isCardErrored,
  highlightCard,
  isAIEnabled,
  isAIError,
  completeIncorrectAnswers,
  incompleteIncorrectAnswers,
  isPublic,
  isMultipleChoice,
  handleAnswerType,
  handlePublicPrivateChange,
  handleNextCardButtonClick,
  handleIncorrectCardStackUpdate,
  handleDebouncedCorrectAnswerChange,
  handleDebouncedTitleChange,
  handleDebouncedCorrectAnswerStepsChange,
  handleDiscardQuestion,
  handleSaveQuestion,
  handleCCSSClick,
  handleClick,
  handleAIError,
  handleAIIsEnabled,
  handleImageUploadClick,
}: IQuestionElements) {
  const theme = useTheme();
  const { questionCard, correctCard } = draftQuestion;
  const isQuestionCardErrored = isCardErrored && !questionCard.isCardComplete;
  const isCorrectCardErrored = isCardErrored && !correctCard.isCardComplete;

 
  return (
    <>
      <Grid
        sm={12}
        md={10}
        lg={4}
        item
        style={{
          width: '100%',
          maxWidth: '672px',
          minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.mdPadding}px`,
        }}
      >
        <Box
          onClick={() => handleClick(CreateQuestionHighlightCard.QUESTIONCARD)}
          style={{ width: '100%' }}
        >
          <CreateQuestionCardBase
            isCreateGame
            screenSize={screenSize}
            draftQuestion={draftQuestion}
            handleTitleChange={handleDebouncedTitleChange}
            handleCCSSClick={handleCCSSClick}
            isHighlight={
              highlightCard === CreateQuestionHighlightCard.QUESTIONCARD
            }
            handleImageUploadClick={handleImageUploadClick}
            handlePublicPrivateChange={handlePublicPrivateChange}
            handleAnswerType={handleAnswerType}
            isCardSubmitted={isCardSubmitted}
            isCardErrored={isQuestionCardErrored}
            isAIError={isAIError}
            isPublic={isPublic}
            isMultipleChoice={isMultipleChoice}
          />
        </Box>
        <Grid container spacing={`${theme.sizing.smPadding}px`}>
          <SubCardGridItem item sm={12} md={6}>
            <Box
              onClick={() =>
                handleClick(CreateQuestionHighlightCard.CORRECTANSWER)
              }
              style={{ width: '100%' }}
            >
              <CorrectAnswerCard
                draftQuestion={draftQuestion}
                isHighlight={
                  highlightCard === CreateQuestionHighlightCard.CORRECTANSWER
                }
                handleCorrectAnswerChange={handleDebouncedCorrectAnswerChange}
                handleCorrectAnswerStepsChange={
                  handleDebouncedCorrectAnswerStepsChange
                }
                isCardSubmitted={isCardSubmitted}
                isCardErrored={isCorrectCardErrored}
                isAIError={isAIError}
              />
            </Box>
          </SubCardGridItem>
          <SubCardGridItem item sm={12} md={6}>
            <Box
              style={{ width: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Typography style={{ textAlign: 'right', fontWeight: 500 }}>
                Try our AI-Generated Wrong Answer Explanation Prototype
              </Typography>
              <AISwitch
                checked={isAIEnabled}
                onChange={() => handleAIIsEnabled()}
              />
            </Box>
            <IncorrectAnswerCardStack
              draftQuestion={draftQuestion}
              completeIncorrectAnswers={completeIncorrectAnswers}
              incompleteIncorrectAnswers={incompleteIncorrectAnswers}
              highlightCard={highlightCard}
              handleNextCardButtonClick={handleNextCardButtonClick}
              handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
              handleCardClick={handleClick}
              handleAIError={handleAIError}
              isCardSubmitted={isCardSubmitted}
              isAIEnabled={isAIEnabled}
              isAIError={isAIError}
            />
          </SubCardGridItem>
        </Grid>
      </Grid>
      <Grid sm md={1} lg={4} item />
    </>
  );
}
