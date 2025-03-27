import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { CreateGameLocalData } from '../lib/CentralModels';

export default function useCreateGameLoader(): CreateGameLocalData {
  const retreivedData = useLoaderData() as CreateGameLocalData; 
  return { gameTemplate: retreivedData.gameTemplate }
}