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
  // create a deep copy to ensure immutability and sort by multichoice
  let responsesCopy: IHostTeamAnswersResponse[] = responses ? [...responses].sort((a: any, b: any) => a.multiChoiceCharacter.localeCompare(b.multiChoiceCharacter)): [];
  // phase 1
  if (responses && isShortAnswerEnabled){
    if (currentPhase === IPhase.ONE) {
      // if short answer is enabled, only show the correct answer
      responsesCopy = responsesCopy.filter((response) => response.isCorrect);
    // phase 2
    } else {
      // short answer, move the correct answer to the bottom
      console.log(responsesCopy);
      responsesCopy = responsesCopy.filter((response) => (response.isCorrect || response.isSelectedMistake)).sort((a, b) => 
        Number(a.isCorrect) - Number(b.isCorrect)
      );
    }
  }
  console.log(responsesCopy);
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
    <ScrollBoxStyled>
      <QuestionCard 
        questionText={currentQuestion.text}
        imageUrl={currentQuestion.imageUrl}
        currentQuestionIndex={localGameSession.currentQuestionIndex}
        currentState={localGameSession.currentState}
      />
      { responsesCopy && responsesCopy.map((response, index) => (
        response.multiChoiceCharacter !== `–` &&
          <AnswerCard 
            isCorrectAnswer={response.isCorrect}
            isShortAnswerEnabled={isShortAnswerEnabled ?? false}
            answerIndex={index}
            answerContent={response.rawAnswer}
            instructions={currentQuestion.instructions}
            answerReason={response.reason ?? ''}
            key={uuidv4()}
            response={response}
          />
      )) }
    </ScrollBoxStyled>
  </Grid>
  );
}