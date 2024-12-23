import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { ButtonType, ButtonColor, buttonContentMap } from './ButtonModels';
import {
  ButtonStyled,
  ButtonContent,
  ButtonIconContainer,
  ButtonTypography,
} from '../../lib/styledcomponents/ButtonStyledComponents';

interface CentralButtonProps {
  buttonType: ButtonType;
  isEnabled: boolean;
  smallScreenOverride?: boolean;
  type?: string;
  onClick?: () => void;
  handleFileChange?: (file: File) => void;
}

export default function CentralButton({
  buttonType,
  isEnabled,
  smallScreenOverride,
  type,
  onClick,
  handleFileChange,
}: CentralButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const buttonObj = buttonContentMap[buttonType];
  const buttonText = buttonObj.textKey
    ? t(`button.${buttonObj.textKey}`)
    : null;
  const buttonColor = buttonObj.color ?? ButtonColor.BLUE;
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
      onClick={handleButtonClick}
    >
      <ButtonContent>
        {buttonObj.icon && (
          <ButtonIconContainer>
            <img src={buttonObj.icon} alt={`${buttonText}`} />
          </ButtonIconContainer>
        )}
        {buttonText && !isSmallScreen && <ButtonTypography> {buttonText} </ButtonTypography>}
        {buttonObj.rightIcon && (
          <ButtonIconContainer>
            <img src={buttonObj.rightIcon} alt={`${buttonText}`} />
          </ButtonIconContainer>
        )}
      </ButtonContent>
    </ButtonStyled>
  );
}
