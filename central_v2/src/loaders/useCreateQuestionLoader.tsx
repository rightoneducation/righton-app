import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { CreateQuestionLocalData } from '../lib/CentralModels';

export default function useCreateQuestionLoader(): CreateQuestionLocalData {
  const retreivedData = useLoaderData() as CreateQuestionLocalData; 
  return { draftQuestion: retreivedData?.draftQuestion ?? null, incompleteCards: retreivedData?.incompleteCards?? null, completeCards: retreivedData?.completeCards ?? null}
}

