import React from 'react';
import { Button, styled } from '@mui/material';
import { ButtonContent, ButtonIconBlue, ButtonIconContainer, ButtonStyled, ButtonTypography } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ButtonColor } from '../ButtonModels';
import AddIcon from '../../../images/buttonIconAdd.svg';

interface IAddToGameButton {
    onClick: () => void;
}
export default function AddToGameButton({ onClick }: IAddToGameButton){
 
return (
    <ButtonStyled
    buttonColor={ButtonColor.BLUE}
    onClick={onClick}
    sx={{  fontWeight: 600, fontSize: "20px" }}
    >
      <ButtonContent>
              <ButtonIconContainer>
               <img src={AddIcon} alt="Add-to-game" />
              </ButtonIconContainer>
            Add To Game
          </ButtonContent>
    </ButtonStyled>
)
}