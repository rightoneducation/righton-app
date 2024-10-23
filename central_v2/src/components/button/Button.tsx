import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonType, ButtonColor, buttonContentMap } from './ButtonModels';
import { ButtonStyled, ButtonContent, ButtonIconContainer, ButtonTypography } from '../../lib/styledcomponents/ButtonStyledComponents';

interface CentralButtonProps {
  buttonType: ButtonType;
  isEnabled: boolean;
  onClick?: () => void;
}

export default function CentralButton ({
  buttonType,
  isEnabled,
  onClick
}: CentralButtonProps) {
  const { t } = useTranslation();
  const buttonObj = buttonContentMap[buttonType];
  const buttonText = buttonObj.textKey ? t(`button.${buttonObj.textKey}`) : null;
  const buttonColor = buttonObj.color ?? ButtonColor.BLUE;

  return (
    <ButtonStyled buttonColor={buttonColor} disabled={!isEnabled} onClick={onClick}>
      <ButtonContent>
      { buttonObj.icon && 
        <ButtonIconContainer>
          <img src={buttonObj.icon} alt={`${buttonText}`}/>
        </ButtonIconContainer>
      }
      { buttonText && 
        <ButtonTypography> {buttonText} </ButtonTypography>
      } 
      { buttonObj.rightIcon && 
        <ButtonIconContainer>
          <img src={buttonObj.rightIcon} alt={`${buttonText}`}/>
        </ButtonIconContainer>
      }
      </ButtonContent>
    </ButtonStyled>
  );
}