import { Typography } from '@mui/material';
import { ButtonType, buttonContentMap } from './PlayButtonModels';
import {
  PlayButtonBlockStyled,
  PlayButtonContent,
} from './styledcomponents/ButtonStyledComponents';

interface PlayButtonBlockProps {
  buttonType: ButtonType;
  label: string;
  isEnabled: boolean;
  onClick?: () => void;
  dataTestId?: string;
}

export function PlayButtonBlock({
  buttonType,
  label,
  isEnabled,
  onClick,
  dataTestId,
}: PlayButtonBlockProps) {
  const buttonObj = buttonContentMap[buttonType];

  return (
    <PlayButtonBlockStyled
      buttonShape={buttonObj.shape}
      buttonType={buttonType}
      disabled={!isEnabled}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <PlayButtonContent buttonShape={buttonObj.shape}>
        <Typography variant="h2">
          {label}
        </Typography>
      </PlayButtonContent>
    </PlayButtonBlockStyled>
  );
}
