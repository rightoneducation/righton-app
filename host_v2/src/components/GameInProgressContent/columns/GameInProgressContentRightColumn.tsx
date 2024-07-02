import React from 'react';
import { Grid } from '@mui/material';
import { IGameSession, IQuestion } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import QuestionCard from '../../QuestionCard';
import AnswerCard from '../../AnswerCard';

interface GameInProgressContentRightColumnProps {
  currentQuestion: IQuestion;
  localGameSession: IGameSession;
  isShortAnswerEnabled: boolean;
}

export default function GameInProgressContentRightColumn({ 
    currentQuestion,
    localGameSession,
    isShortAnswerEnabled,
  }: GameInProgressContentRightColumnProps
){
  return (
    <Grid item xs={12} sm={isShortAnswerEnabled  ? 4 : 6} sx={{ width: '100%', height: '100%' }}>
    <ScrollBoxStyled>
      <QuestionCard 
      questionText={currentQuestion.text}
      imageUrl={currentQuestion.imageUrl}
      currentQuestionIndex={localGameSession.currentQuestionIndex}
      currentState={localGameSession.currentState}
      />
      { currentQuestion.choices.map((choice, index) => 
        <AnswerCard 
          isCorrectAnswer={choice.isAnswer}
          answerIndex={index}
          answerContent={choice.text}
          instructions={currentQuestion.instructions}
          answerReason={choice.reason}
          key={uuidv4()}
        />
      )}
    </ScrollBoxStyled>
  </Grid>
  );
}