import React from 'react';
import { Box, useTheme } from '@mui/material';
import { IQuestion } from '../lib/Models';
import { QuestionContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { QuestionCard } from './QuestionCard'
import { WrongAnswerCard } from './WrongAnswerCard'

interface QuestionCardProps {
  isCustomQuestion: boolean,
  labelText: string[],
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index?: number) => void,
  formData: IQuestion,
  isSubmitted: boolean,
  isFormComplete: boolean,
  isQuestionGenerating: boolean,
  handleSubmitQuestion: () => void,
  handleAddWrongAnswer: () => void,
  handleGenerateSampleQuestion: () => void,
}

export const QuestionInfoContainer = ({
  isCustomQuestion,
  labelText,
  handleInputChange,
  formData,
  isSubmitted,
  isFormComplete,
  isQuestionGenerating,
  handleSubmitQuestion,
  handleAddWrongAnswer,
  handleGenerateSampleQuestion
}: QuestionCardProps ) => {
  const theme = useTheme();
  const inputs = [
    { label: 'Wrong Answer 1', name: 'wrongAnswer1' },
    { label: 'Wrong Answer 2', name: 'wrongAnswer2' },
    { label: 'Wrong Answer 3', name: 'wrongAnswer3' },
  ];

  return (
    <QuestionContainer>
      <QuestionCard
        isCustomQuestion={isCustomQuestion}
        labelText={labelText}
        handleInputChange={handleInputChange}
        formData={formData}
        isSubmitted={isSubmitted}
        isFormComplete={isFormComplete}
        isQuestionGenerating={isQuestionGenerating}
        handleSubmitQuestion={handleSubmitQuestion}
        handleGenerateSampleQuestion={handleGenerateSampleQuestion}
      />
      <WrongAnswerCard 
        isCustomQuestion={isCustomQuestion}
        labelText={labelText}
        handleInputChange={handleInputChange}
        formData={formData}
        isSubmitted={isSubmitted}
        isFormComplete={isFormComplete}
        isQuestionGenerating={isQuestionGenerating}
        handleSubmitQuestion={handleSubmitQuestion}
        handleAddWrongAnswer={handleAddWrongAnswer}
        handleGenerateSampleQuestion={handleGenerateSampleQuestion}
      />
    </QuestionContainer>
  );
}