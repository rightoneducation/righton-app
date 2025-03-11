import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ButtonFavourite } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { APIClientsContext } from '../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../hooks/context/useAPIClientsContext';
import { UserProfileContext, UserProfileDispatchContext } from '../../../lib/context/UserProfileContext';
import { useUserProfileContext, useUserProfileDispatchContext } from '../../../hooks/context/useUserProfileContext';
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
  const userProfile = useUserProfileContext(UserProfileContext);
  const userProfileDispatch = useUserProfileDispatchContext(UserProfileDispatchContext);
  const isFavorite = userProfile?.favoriteGameTemplateIds?.includes(id) ?? false;
  const handleButtonClick = async () => {
    setIsLoading(true);
    const response = await apiClients.centralDataManager?.favoriteGameTemplate(id, userProfile);
    if (response) {
      userProfileDispatch({ type: 'update_user_profile', payload: response });
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
