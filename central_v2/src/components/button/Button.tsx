import React from 'react';
import { ButtonType, ButtonColor, buttonContentMap } from './ButtonModels';
import { ButtonStyled, ButtonContent, ButtonIconContainer, ButtonTypography } from '../../lib/styledcomponents/ButtonStyledComponents';

interface CentralButtonProps {
  buttonType: ButtonType;
  isEnabled: boolean;
};

export default function CentralButton ({
  buttonType,
  isEnabled
}: CentralButtonProps) {
  const buttonObj = buttonContentMap[buttonType];
  const color = buttonObj.color ? buttonObj.color : ButtonColor.BLUE;

  return (
    <ButtonStyled color={color} disabled={!isEnabled}>
      <ButtonContent>
      { buttonObj.icon && 
        <ButtonIconContainer>
          <img src={buttonObj.icon} alt={`${buttonObj.text}`}/>
        </ButtonIconContainer>
      }
      { buttonObj.text && 
        <ButtonTypography> {buttonObj.text} </ButtonTypography>
      } 
      { buttonObj.rightIcon && 
        <ButtonIconContainer>
          <img src={buttonObj.rightIcon} alt={`${buttonObj.text}`}/>
        </ButtonIconContainer>
      }
      </ButtonContent>
    </ButtonStyled>
  );
}