import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameSession, IQuestion } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import QuestionCard from '../../QuestionCard';
import AnswerCard from '../../AnswerCard';

interface GameInProgressContentLeftColumnProps {
  currentQuestion: IQuestion;
  localGameSession: IGameSession;
}

export default function GameInProgressContentLeftColumn({ 
    currentQuestion,
    localGameSession,
  }: GameInProgressContentLeftColumnProps
){
  const theme = useTheme();
  const { questions, currentQuestionIndex } = localGameSession;
  const { isShortAnswerEnabled } = questions[currentQuestionIndex];
  console.log(isShortAnswerEnabled);
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingRight: `${theme.sizing.mdPadding}px` }}>
    <ScrollBoxStyled>
      <QuestionCard 
      questionText={currentQuestion.text}
      imageUrl={currentQuestion.imageUrl}
      currentQuestionIndex={localGameSession.currentQuestionIndex}
      currentState={localGameSession.currentState}
      />
      { isShortAnswerEnabled
        ? currentQuestion.choices
            .map((choice, index) => ({ ...choice, originalIndex: index }))
            .sort((a, b) => (a.isAnswer ? 1 : 0) - (b.isAnswer ? 1 : 0))
            .map((choice) => 
              <AnswerCard 
                isCorrectAnswer={choice.isAnswer}
                answerIndex={choice.originalIndex}  // Use the original index here
                answerContent={choice.text}
                instructions={currentQuestion.instructions}
                answerReason={choice.reason}
                key={uuidv4()}
                isShortAnswerEnabled={isShortAnswerEnabled}
              />
            )
        : currentQuestion.choices.map((choice, index) => 
            <AnswerCard 
              isCorrectAnswer={choice.isAnswer}
              answerIndex={index}
              answerContent={choice.text}
              instructions={currentQuestion.instructions}
              answerReason={choice.reason}
              key={uuidv4()}
              isShortAnswerEnabled={isShortAnswerEnabled}
            />
          )
      }
      
    </ScrollBoxStyled>
  </Grid>
  );
}