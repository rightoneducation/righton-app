import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameSession, IQuestion, IPhase, IHostTeamAnswersResponse } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import QuestionCardGameplay from '../../QuestionCardGameplay';
import IncorrectAnswersCard from '../../IncorrectAnswersCard';

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
  let responsesCopy: IHostTeamAnswersResponse[] = responses ? [...responses].filter((response) => !response.isCorrect).sort((a: any, b: any) => a.multiChoiceCharacter.localeCompare(b.multiChoiceCharacter)): [];
  const correctResponseIndex = (responses && responses.findIndex((response) => response.isCorrect)) ?? 0;
  const correctResponse = responses && responses[correctResponseIndex]

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
      <QuestionCardGameplay
        questionText={currentQuestion.text}
        imageUrl={currentQuestion.imageUrl}
        answerContent={correctResponse?.rawAnswer || ''}
        instructions={currentQuestion.instructions}
        isShortAnswerEnabled={isShortAnswerEnabled ?? false}
        letterCode={correctResponse?.multiChoiceCharacter || ''}
      />
      <IncorrectAnswersCard 
        responses={responsesCopy}
        isShortAnswerEnabled={isShortAnswerEnabled ?? false}
      />
    </ScrollBoxStyled>
  </Grid>
  );
}