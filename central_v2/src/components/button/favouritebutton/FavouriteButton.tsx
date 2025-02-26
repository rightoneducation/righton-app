import React from 'react';
import { ButtonFavourite } from '../../../lib/styledcomponents/ButtonStyledComponents';
import heart from '../../../images/heart.svg';

interface FavouriteButtonProps {
  isEnabled: boolean;
  onClick?: () => void;
}

export default function FavouriteButton({
  isEnabled,
  onClick,
}: FavouriteButtonProps) {
  return (
    <ButtonFavourite
      onClick={onClick}
    >
      <img src={heart} alt="Favourite" style={{width: '12px', height: '10px'}} />
    </ButtonFavourite>
  );
}
