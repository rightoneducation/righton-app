import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import { CentralQuestionTemplateInput } from '@righton/networking'; 

export const updateDQwithImageChange = (draftQuestion: CentralQuestionTemplateInput, inputImage: File | null, inputUrl: string | null): CentralQuestionTemplateInput => {
  if (inputImage || inputUrl){
    return {...draftQuestion, questionCard: {...draftQuestion.questionCard, image: inputImage, imageUrl: inputUrl}};
  }
  return draftQuestion;
}

export const updateDQwithImage = (draftQuestion: CentralQuestionTemplateInput, inputImage: File | null, inputUrl: string | null): CentralQuestionTemplateInput => {
  if (inputImage || inputUrl){
    if (draftQuestion.questionCard.ccss.length > 0 && draftQuestion.questionCard.ccss !== 'CCSS' && draftQuestion.questionCard.title){
      if (draftQuestion.correctCard.isFirstEdit){
        return {...draftQuestion, questionCard: {...draftQuestion.questionCard, image: inputImage, imageUrl: inputUrl, isCardComplete: true, isFirstEdit: false}};
      } 
      return {...draftQuestion, questionCard: {...draftQuestion.questionCard, image: inputImage, imageUrl: inputUrl, isCardComplete: true}};
    } 
    return {...draftQuestion, questionCard: {...draftQuestion.questionCard, image: inputImage, imageUrl: inputUrl}};
  }
  return draftQuestion;
}

export const updateDQwithTitle = (draftQuestion: CentralQuestionTemplateInput, inputTitle: string): CentralQuestionTemplateInput => {
  if (draftQuestion.questionCard.image && draftQuestion.questionCard.ccss.length > 0 && draftQuestion.questionCard.ccss !== 'CCSS'){
    if (draftQuestion.correctCard.isFirstEdit){
      return {...draftQuestion, questionCard: {...draftQuestion.questionCard, title: inputTitle, isCardComplete: true, isFirstEdit: false}};
    } 
    return {...draftQuestion, questionCard: {...draftQuestion.questionCard, title: inputTitle, isCardComplete: true}};
  }
  return {...draftQuestion, questionCard: {...draftQuestion.questionCard, title: inputTitle}};
}


export const updateDQwithCCSS = (draftQuestion: CentralQuestionTemplateInput, inputCCSS: string): CentralQuestionTemplateInput => {
  if (draftQuestion.questionCard.image && draftQuestion.questionCard.title){
    if (draftQuestion.correctCard.isFirstEdit){
      return {...draftQuestion, questionCard: {...draftQuestion.questionCard, ccss: inputCCSS, isCardComplete: true, isFirstEdit: false}};
    } 
    return {...draftQuestion, questionCard: {...draftQuestion.questionCard, ccss: inputCCSS, isCardComplete: true}};
  }
  return {...draftQuestion, questionCard: {...draftQuestion.questionCard, ccss: inputCCSS}};
}

export const updateDQwithQuestionClick = (draftQuestion: CentralQuestionTemplateInput): CentralQuestionTemplateInput => {
  return {...draftQuestion, questionCard: {...draftQuestion.questionCard, isCardComplete: false}}
}