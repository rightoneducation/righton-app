import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import { CentralQuestionTemplateInput } from '@righton/networking'; 

export const updateDQwithCorrectAnswer = (draftQuestionInput: CentralQuestionTemplateInput, correctAnswer: string): CentralQuestionTemplateInput => {
  if (draftQuestionInput.correctCard.answerSteps.length > 0 && draftQuestionInput.correctCard.answerSteps.every((answer) => answer.length > 0) && correctAnswer.length > 0){
    if (draftQuestionInput.incorrectCards[0].isFirstEdit)
      return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answer: correctAnswer, isCardComplete: true, isFirstEdit: false}};
    return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answer: correctAnswer, isCardComplete: true}};
  }
  return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answer: correctAnswer}};
}

export const updateDQwithCorrectAnswerSteps = (draftQuestionInput: CentralQuestionTemplateInput, steps: string[]): CentralQuestionTemplateInput => {
  if (draftQuestionInput.correctCard.answer.length > 0 && steps.length > 0 && steps.every((step) => step.length > 0)){
    if (draftQuestionInput.incorrectCards[0].isFirstEdit)
      return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answerSteps: steps, isCardComplete: true, isFirstEdit: false}};
    return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answerSteps: steps, isCardComplete: true}};
  }
  return {...draftQuestionInput, correctCard: { ...draftQuestionInput.correctCard, answerSteps: steps}};
}