import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { ButtonType, ButtonColor, buttonContentMap } from './ButtonModels';
import {
  ButtonStyled,
  ButtonContent,
  ButtonIconContainer,
  ButtonTypography,
  ButtonIconBlue,
} from '../../lib/styledcomponents/ButtonStyledComponents';

interface CentralButtonProps {
  buttonType: ButtonType;
  isEnabled: boolean;
  isOnQuestionTab?: boolean;
  smallScreenOverride?: boolean;
  buttonWidthOverride?: string;
  iconOnlyOverride?: boolean;
  type?: string;
  isReset?: boolean;
  hideIcon?: boolean;
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
  isReset,
  hideIcon,
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
  const buttonWidth = buttonObj.width ?? '100%';
  const isSmallScreen =
    useMediaQuery(theme.breakpoints.down('md')) && !smallScreenOverride;

  const handleButtonClick = () => {
    if (type === 'file') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.display = 'none';
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
      buttonColor={isReset ? ButtonColor.NULL : buttonColor}
      buttonType={buttonType}
      disabled={!isEnabled}
      isOnQuestionTab={isOnQuestionTab ?? false}
      onClick={handleButtonClick}
      isReset={isReset}
      style={{ width: buttonWidthOverride ?? buttonWidth }}
    >
      {buttonObj.icon && (
          <ButtonIconContainer>
            {(buttonColor === ButtonColor.NULL &&
              (buttonType === ButtonType.CHANGEIMAGE ||
                buttonType === ButtonType.SAVEDRAFT)) ||
                (buttonType === ButtonType.BACK) ||
                (buttonType === ButtonType.BACKTOEDIT) ||
                (buttonType === ButtonType.CREATEQUESTION) ||
            (buttonType === ButtonType.SIGNUP && isReset) ? (
              <ButtonIconBlue src={buttonObj.icon} />
            ) : (
              <img src={buttonObj.icon} alt={`${buttonText}`} />
            )}
          </ButtonIconContainer>
        )}
      <ButtonContent>
        <Box style={{ height: '20px', width: '20px' }} />
        {buttonText && !isSmallScreen && !iconOnlyOverride && (
          <ButtonTypography
            isReset={isReset}
            buttonColor={buttonColor}
            buttonType={buttonType}
          >
            {buttonText}
          </ButtonTypography>
        )}
        {buttonObj.rightIcon && (
          <ButtonIconContainer>
            {buttonColor === ButtonColor.NULL &&
            buttonType === ButtonType.CHANGEIMAGE ? (
              <ButtonIconBlue src={buttonObj.rightIcon} />
            ) : (
              <img src={buttonObj.rightIcon} alt={`${buttonText}`} />
            )}
          </ButtonIconContainer>
        )}
      </ButtonContent>
    </ButtonStyled>
  );
}
