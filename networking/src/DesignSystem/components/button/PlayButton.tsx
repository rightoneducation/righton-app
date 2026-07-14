import { Typography } from '@mui/material';
import { ButtonType, buttonContentMap } from './PlayButtonModels';
import {
  PlayButtonStyled,
  PlayButtonContent,
} from './styledcomponents/ButtonStyledComponents';

interface PlayButtonProps {
  buttonType: ButtonType;
  label: string;
  isEnabled: boolean;
  onClick?: () => void;
  dataTestId?: string;
}

export function PlayButton({
  buttonType,
  label,
  isEnabled,
  onClick,
  dataTestId,
}: PlayButtonProps) {
  const buttonObj = buttonContentMap[buttonType];

  return (
    <PlayButtonStyled
      buttonShape={buttonObj.shape}
      buttonType={buttonType}
      disabled={!isEnabled}
      onClick={onClick}
      data-testid={dataTestId}
      style={buttonObj.width ? { width: buttonObj.width } : undefined}
    >
      <PlayButtonContent buttonShape={buttonObj.shape}>
        <Typography variant="h2">
          {label}
        </Typography>
      </PlayButtonContent>
    </PlayButtonStyled>
  );
}
