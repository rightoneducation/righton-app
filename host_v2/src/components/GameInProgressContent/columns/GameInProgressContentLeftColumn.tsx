import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameSession, IQuestion, IPhase, IHostTeamAnswersResponse, GameSessionState } from '@righton/networking';
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
  const correctResponse = responses && responses[correctResponseIndex];

  // at the prepare stage `responses` isn't populated yet, so derive response-shaped
  // objects from the question's choices. multiChoiceCharacter is assigned by position
  // (0->A, 1->B, ...) over the full choices array *before* filtering, mirroring
  // buildEmptyHostTeamAnswer in HostDataManagerAPIClient so letters match gameplay.
  const isPrepare = localGameSession.currentState === GameSessionState.TEAMS_JOINING;
  const prepareResponses: IHostTeamAnswersResponse[] = currentQuestion.choices.map((choice, index) => ({
    normAnswer: [choice.text],
    rawAnswer: choice.text,
    count: 0,
    multiChoiceCharacter: String.fromCharCode(65 + index),
    isCorrect: choice.isAnswer,
    reason: choice.reason,
    teams: [],
  }));
  const prepareCorrectResponse = prepareResponses.find((response) => response.isCorrect);
  const prepareIncorrectResponses = prepareResponses.filter((response) => !response.isCorrect);

  // phase 1
  if (responses && isShortAnswerEnabled){
    if (currentPhase === IPhase.ONE) {
      // if short answer is enabled, only show the correct answer
      responsesCopy = responsesCopy.filter((response) => response.isCorrect);
    // phase 2
    } else {
      // short answer, move the correct answer to the bottom
      responsesCopy = responsesCopy.filter((response) => (response.isCorrect || response.isSelectedMistake)).sort((a, b) => 
        Number(a.isCorrect) - Number(b.isCorrect)
      );
    }
  }
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
    <ScrollBoxStyled sx={{ gap: '12px' }}>
      <QuestionCardGameplay
        questionText={currentQuestion.text}
        imageUrl={currentQuestion.imageUrl}
        answerContent={(isPrepare ? prepareCorrectResponse : correctResponse)?.rawAnswer || ''}
        instructions={currentQuestion.instructions}
        isShortAnswerEnabled={isShortAnswerEnabled ?? false}
        letterCode={(isPrepare ? prepareCorrectResponse : correctResponse)?.multiChoiceCharacter || ''}
      />
      <IncorrectAnswersCard
        responses={isPrepare ? prepareIncorrectResponses : responsesCopy}
        isShortAnswerEnabled={isShortAnswerEnabled ?? false}
      />
    </ScrollBoxStyled>
  </Grid>
  );
}