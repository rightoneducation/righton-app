import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameSession, IQuestion, IPhase, IHostTeamAnswersResponse } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import QuestionCard from '../../QuestionCard';
import AnswerCard from '../../AnswerCard';

interface GameInProgressContentLeftColumnProps {
  currentQuestion: IQuestion;
  localGameSession: IGameSession;
  isShortAnswerEnabled?: boolean;
  responses?: IHostTeamAnswersResponse[];
  currentPhase: IPhase;
  totalAnswers?: number;
}

export default function GameInProgressContentLeftColumn({ 
    currentQuestion,
    localGameSession,
    isShortAnswerEnabled,
    responses,
    currentPhase,
    totalAnswers
  }: GameInProgressContentLeftColumnProps
){
  const theme = useTheme();
  const sortedChoices = useMemo(() => {
    if (isShortAnswerEnabled && currentPhase === IPhase.TWO) {
      return [...currentQuestion.choices].sort((a, b) => 
        Number(a.isAnswer) - Number(b.isAnswer)
      );
    }
    return currentQuestion.choices;
  }, [isShortAnswerEnabled, currentPhase, currentQuestion.choices]);

  const filteredChoices = useMemo(() => {
    return sortedChoices.filter((sortedChoice: any) => {
      if (isShortAnswerEnabled && currentPhase === IPhase.ONE) {
        return sortedChoice.isAnswer;
      } 
      return true;
    });
  }, [sortedChoices, isShortAnswerEnabled, currentPhase]);

  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
    <ScrollBoxStyled>
      <QuestionCard 
        questionText={currentQuestion.text}
        imageUrl={currentQuestion.imageUrl}
        currentQuestionIndex={localGameSession.currentQuestionIndex}
        currentState={localGameSession.currentState}
      />
      { filteredChoices.map((choice, index) => (
        <AnswerCard 
          isCorrectAnswer={choice.isAnswer}
          isShortAnswerEnabled={isShortAnswerEnabled ?? false}
          answerIndex={index}
          answerContent={choice.text}
          instructions={currentQuestion.instructions}
          answerReason={choice.reason}
          key={uuidv4()}
          response={responses ? responses[index] : null}
          totalAnswers={totalAnswers ?? 0}
        />
      )) }
    </ScrollBoxStyled>
  </Grid>
  );
}