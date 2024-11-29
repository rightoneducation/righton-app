import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import { CentralQuestionTemplateInput } from '@righton/networking'; 

export const updateDQwithImageChange = (draftQuestion: CentralQuestionTemplateInput, inputImage: string | null, inputUrl: string | null): CentralQuestionTemplateInput => {
  if (inputImage || inputUrl){
    return {...draftQuestion, questionCard: {...draftQuestion.questionCard, image: inputImage, imageUrl: inputUrl}};
  }
  return draftQuestion;
}

export const updateDQwithImage = (draftQuestion: CentralQuestionTemplateInput, inputImage: string | null, inputUrl: string | null): CentralQuestionTemplateInput => {
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


// image conversion files to properly save images to local storage
export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  const byteString = atob(base64.split(',')[1]); // Decode base64
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i+=1) {
      uint8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export const fileToBase64 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
  });