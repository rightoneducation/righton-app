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
  console.log(responses);
  const sortedResponses = useMemo(() => {
    // create a deep copy to ensure immutability
    const responsesCopy: IHostTeamAnswersResponse[] = responses ? [...responses] : [];
    // // phase 1
    // if ((currentPhase === IPhase.ONE) && responses) {
    //   // if short answer is enabled, only show the correct answer
    //   if (isShortAnswerEnabled)
    //     return responsesCopy.filter((response) => response.isCorrect);
    //   // otherwise, sort the responses so the correct answer is at the top
    //   return responsesCopy.sort((a,b) => 
    //     Number(b.isCorrect) - Number(a.isCorrect)
    //   );
    // }
    // // phase 2
    // if (currentPhase === IPhase.TWO && responses) {
    //   // short answer, move the correct answer to the bottom
    //   if (isShortAnswerEnabled) {
    //     return responsesCopy.sort((a, b) => 
    //       Number(a.isCorrect) - Number(b.isCorrect)
    //     );
    //   }
    // }
    // otherwise, leave it as is
    return responsesCopy;
  }, [responses]);

  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
    <ScrollBoxStyled>
      <QuestionCard 
        questionText={currentQuestion.text}
        imageUrl={currentQuestion.imageUrl}
        currentQuestionIndex={localGameSession.currentQuestionIndex}
        currentState={localGameSession.currentState}
      />
      { sortedResponses && sortedResponses.map((response, index) => (
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