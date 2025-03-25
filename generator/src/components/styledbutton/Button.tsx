import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ButtonType, ButtonColor, buttonContentMap } from './ButtonModels';
import {
  ButtonStyled,
  ButtonContent,
  ButtonIconContainer,
  ButtonTypography,
  ButtonIconBlue
} from '../../lib/styledcomponents/generator/ButtonStyledComponents';

interface CentralButtonProps {
  buttonType: ButtonType;
  isEnabled: boolean;
  isOnQuestionTab?: boolean;
  smallScreenOverride?: boolean;
  buttonWidthOverride?: string;
  iconOnlyOverride?: boolean;
  type?: string;
  onClick?: () => void;
  handleFileChange?: (file: File) => void;
}

export default function CentralButton({
  buttonType,
  isEnabled,
  isOnQuestionTab,
  smallScreenOverride,
  buttonWidthOverride,
  iconOnlyOverride,
  type,
  onClick,
  handleFileChange,
}: CentralButtonProps) {
  const theme = useTheme();
  const buttonObj = buttonContentMap[buttonType];
  const buttonText = 'Discard';
  const buttonColor = buttonObj.color ?? ButtonColor.BLUE;
  const buttonWidth = buttonObj.width ?? '100%';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')) && !smallScreenOverride;

  const handleButtonClick = () => {
    if (type === "file") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";
      fileInput.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && handleFileChange) {
          handleFileChange(file);
        }
      };
      fileInput.click();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <ButtonStyled
      buttonColor={buttonColor}
      disabled={!isEnabled}
      isOnQuestionTab={isOnQuestionTab ?? false}
      onClick={handleButtonClick}
      style={{width: buttonWidthOverride ?? buttonWidth}}
    >
      <ButtonContent>
        {buttonObj.icon && (
          <ButtonIconContainer>
            { buttonColor === ButtonColor.NULL
              ? <ButtonIconBlue src={buttonObj.icon}/>
              : <img src={buttonObj.icon} alt={`${buttonText}`} />
            }
          </ButtonIconContainer>
        )}
        {buttonText && !isSmallScreen && !iconOnlyOverride && <ButtonTypography buttonColor={buttonColor}> {buttonText} </ButtonTypography>}
        {buttonObj.rightIcon && (
          <ButtonIconContainer>
            { buttonColor === ButtonColor.NULL
              ? <ButtonIconBlue src={buttonObj.rightIcon}/>
              : <img src={buttonObj.rightIcon} alt={`${buttonText}`} />
            }
          </ButtonIconContainer>
        )}
      </ButtonContent>
    </ButtonStyled>
  );
}
