import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ButtonFavourite } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { APIClientsContext } from '../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../../hooks/context/useCentralDataContext';
import heart from '../../../images/heart.svg';
import heartFilled from '../../../images/heartFilled.svg';

interface FavouriteButtonProps {
  isEnabled: boolean;
  isGame: boolean;
  id: string;
}

export default function FavouriteButton({
  isEnabled,
  isGame,
  id,
}: FavouriteButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  const isFavorite = isGame
    ? centralData.userProfile?.favoriteGameTemplateIds?.includes(id)
    : centralData.userProfile?.favoriteQuestionTemplateIds?.includes(id);

  const handleButtonClick = async () => {
    setIsLoading(true);
    let response;
    if (isGame)
      response = await apiClients.centralDataManager?.favoriteGameTemplate(
        id,
        centralData.userProfile,
      );
    else
      response = await apiClients.centralDataManager?.favoriteQuestionTemplate(
        id,
        centralData.userProfile,
      );
    if (response) {
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: response });
    }
    setIsLoading(false);
  };
  return (
    <ButtonFavourite onClick={handleButtonClick}>
      {isLoading ? (
        <CircularProgress size="12px" style={{ color: '#000' }} />
      ) : (
        <img
          src={isFavorite ? heartFilled : heart}
          alt="Favourite"
          style={{ width: '12px', height: '10px' }}
        />
      )}
    </ButtonFavourite>
  );
}
