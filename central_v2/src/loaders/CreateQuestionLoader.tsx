import React from 'react';
import { CentralQuestionTemplateInput } from '@righton/networking';
import { StorageKey, CreateQuestionLocalData } from '../lib/CentralModels';


export  default function CreateQuestion(): CreateQuestionLocalData {
    const storageObject = window.localStorage.getItem(StorageKey);
    let parsedObject;
    let incompleteAnswers;
    let completeAnswers;
    if (storageObject){
      parsedObject = JSON.parse(storageObject) as CentralQuestionTemplateInput;
      incompleteAnswers = parsedObject.incorrectCards.filter((card) =>  card.isCardComplete === false);
      completeAnswers = parsedObject.incorrectCards.filter((card) => card.isCardComplete);
    }
    return {draftQuestion: parsedObject, incompleteCards: incompleteAnswers, completeCards: completeAnswers }
  
}