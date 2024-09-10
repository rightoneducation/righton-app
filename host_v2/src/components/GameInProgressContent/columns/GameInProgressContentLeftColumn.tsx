import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameSession, IQuestion, IPhase } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import QuestionCard from '../../QuestionCard';
import AnswerCard from '../../AnswerCard';

interface GameInProgressContentLeftColumnProps {
  currentQuestion: IQuestion;
  localGameSession: IGameSession;
  isShortAnswerEnabled?: boolean;
  currentPhase: IPhase;
}

export default function GameInProgressContentLeftColumn({ 
    currentQuestion,
    localGameSession,
    isShortAnswerEnabled,
    currentPhase
  }: GameInProgressContentLeftColumnProps
){
  const theme = useTheme();
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
    <ScrollBoxStyled>
      <QuestionCard 
      questionText={currentQuestion.text}
      imageUrl={currentQuestion.imageUrl}
      currentQuestionIndex={localGameSession.currentQuestionIndex}
      currentState={localGameSession.currentState}
      />
      {currentQuestion.choices.map((choice, index) => 
        ((isShortAnswerEnabled && choice.isAnswer && currentPhase === IPhase.ONE) || !isShortAnswerEnabled || currentPhase === IPhase.TWO) &&
          <AnswerCard 
            isCorrectAnswer={choice.isAnswer}
            isShortAnswerEnabled={isShortAnswerEnabled ?? false}
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