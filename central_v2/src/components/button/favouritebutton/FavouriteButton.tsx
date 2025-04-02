import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ButtonFavourite } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { APIClientsContext } from '../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../hooks/context/useAPIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../../../hooks/context/useCentralDataContext';
import heart from '../../../images/heart.svg';
import heartFilled from '../../../images/heartFilled.svg';

interface FavouriteButtonProps {
  isEnabled: boolean;
  id: string;
}

export default function FavouriteButton({
  isEnabled,
  id
}: FavouriteButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  


  const isFavorite = centralData.userProfile?.favoriteGameTemplateIds?.includes(id) ?? false;
  const handleButtonClick = async () => {
    setIsLoading(true);
    console.log('handleButtonClick');
    console.log(centralData);
    console.log(centralData.userProfile);
    const response = await apiClients.centralDataManager?.favoriteGameTemplate(id, centralData.userProfile);
    if (response) {
      console.log('response', response);
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: response });
    }
    setIsLoading(false);
  };
  return (
    <ButtonFavourite
      onClick={handleButtonClick}
    >
      {isLoading 
        ? <CircularProgress size="12px" style={{color: '#000'}} />
        : <img src={isFavorite ? heartFilled : heart} alt="Favourite" style={{width: '12px', height: '10px'}} />
      }
    </ButtonFavourite>
  );
}
