import React from 'react';
import { useLoaderData } from 'react-router-dom';
import type { CreateGameDraftLocalData } from './CreateGameLoader';

export default function useCreateGameLoader(): CreateGameDraftLocalData {
  const retrievedData = useLoaderData() as CreateGameDraftLocalData | undefined;
  return {
    draftGame: retrievedData?.draftGame ?? null,
    draftQuestionsList: retrievedData?.draftQuestionsList ?? null,
    phaseTime: retrievedData?.phaseTime ?? null,
  };
}
