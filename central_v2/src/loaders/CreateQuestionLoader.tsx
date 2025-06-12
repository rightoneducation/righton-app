import React from 'react';
import {
  CentralQuestionTemplateInput,
  IncorrectCard,
} from '@righton/networking';
import { StorageKey, CreateQuestionLocalData } from '../lib/CentralModels';

export default function CreateQuestion(): CreateQuestionLocalData {
  const storageObject = window.localStorage.getItem(StorageKey);
  let parsedObject: CentralQuestionTemplateInput | null = null;
  let incompleteAnswers: IncorrectCard[] = [];
  let completeAnswers: IncorrectCard[] = [];
  if (storageObject) {
    parsedObject = JSON.parse(storageObject) as CentralQuestionTemplateInput;
    incompleteAnswers = parsedObject.incorrectCards.filter(
      (card) => card.isCardComplete === false,
    );
    completeAnswers = parsedObject.incorrectCards.filter(
      (card) => card.isCardComplete,
    );
  }
  return {
    draftQuestion: parsedObject ?? null,
    incompleteCards: incompleteAnswers.length > 0 ? incompleteAnswers : null,
    completeCards: completeAnswers.length > 0 ? completeAnswers : null,
  };
}
