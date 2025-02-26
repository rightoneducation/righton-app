import React from 'react';
import { CentralQuestionTemplateInput, IncorrectCard } from '@righton/networking';
import { CreateQuestionHighlightCard } from '../../CentralModels';

export const getNextHighlightCard =(currentId: CreateQuestionHighlightCard): CreateQuestionHighlightCard | null  => {
  const values = Object.values(CreateQuestionHighlightCard);
  const currentIndex = values.indexOf(currentId);
  if (currentIndex === -1 || currentIndex === values.length - 1) {
    return null; // No next value or current is the last
  }
  return values[currentIndex + 1] as CreateQuestionHighlightCard;
}

export const handleMoveAnswerToComplete = (newAnswers: IncorrectCard[], completeAnswers: IncorrectCard[]): { newIncompleteAnswers: IncorrectCard[], newCompleteAnswers: IncorrectCard[] } => {
  const [movingAnswer, ...newIncompleteAnswers] = newAnswers;
  const newCompleteAnswer = { ...movingAnswer, isCardComplete: true };
  const newCompleteAnswers = [newCompleteAnswer, ...completeAnswers]
  return { newIncompleteAnswers, newCompleteAnswers }
};

export const updateDQwithIncorrectAnswers = (draftQuestionInput: CentralQuestionTemplateInput, incompleteAnswers: IncorrectCard[], completeAnswers: IncorrectCard[]): CentralQuestionTemplateInput => {
  const incomplete = incompleteAnswers.map(answer => {
    return {...answer, isCardComplete: false}
   }
  );
  const complete = completeAnswers.map(answer => {
    return {...answer, isCardComplete: true}
  })
  const newDraftQuestion = {...draftQuestionInput, incorrectCards: [...complete, ...incomplete]}
  return newDraftQuestion;
}

export const handleIncorrectCardClick = (completeAnswers: IncorrectCard[], clickedCard: CreateQuestionHighlightCard): IncorrectCard | null  => {
  const clickedAnswer = completeAnswers.find((answer) => answer.id === clickedCard);
  let newCompleteAnswer = null;
  if (clickedAnswer)
    newCompleteAnswer = {...clickedAnswer, isCardComplete: false};
  return newCompleteAnswer;
}

export const updateDQwithIncorrectAnswerClick = (draftQuestion: CentralQuestionTemplateInput, clickedCard: CreateQuestionHighlightCard): CentralQuestionTemplateInput => {
  const newCards = draftQuestion.incorrectCards.map((answer) => {
    if (answer.id === clickedCard)
      return { ...answer, isCardComplete: false };
    return answer;
  });
  const newDraftQuestion = {...draftQuestion, incorrectCards: [...newCards]}
  return newDraftQuestion;
}