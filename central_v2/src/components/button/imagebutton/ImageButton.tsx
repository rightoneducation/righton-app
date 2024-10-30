import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { imageButtonContentMap, ImageButtonType } from './ImageButtonModels';
import { ImageButtonStyled, ImageButtonIcon, ImageButtonText } from '../../../lib/styledcomponents/ImageButtonStyledComponents';

import { ButtonType } from '../ButtonModels';

interface ImageButtonProps {
  isEnabled: boolean;
  imageButtonType: ImageButtonType;
  onClick?: () => void;
}

export default function ImageButton({
  isEnabled,
  imageButtonType,
  onClick,
}: ImageButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const buttonObj = imageButtonContentMap[imageButtonType];
  const buttonText = buttonObj.textKey
  ? t(`imageButton.${buttonObj.textKey}`)
  : null;

  return (
    <ImageButtonStyled
      onClick={onClick}
    >
      <ImageButtonIcon src={buttonObj.icon} />
      <ImageButtonText> {buttonText} </ImageButtonText>
    </ImageButtonStyled>
  );
}
