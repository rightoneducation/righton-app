import { Typography } from '@mui/material';
import { HostButtonType, hostButtonContentMap } from './HostButtonModels';
import {
  HostButtonStyled,
  HostButtonContent,
} from './styledcomponents/ButtonStyledComponents';

interface HostButtonProps {
  buttonType: HostButtonType;
  label: string;
  isEnabled: boolean;
  onClick?: () => void;
  dataTestId?: string;
}

export function HostButton({
  buttonType,
  label,
  isEnabled,
  onClick,
  dataTestId,
}: HostButtonProps) {
  const buttonObj = hostButtonContentMap[buttonType];

  return (
    <HostButtonStyled
      buttonShape={buttonObj.shape}
      buttonVariant={buttonObj.variant}
      disabled={!isEnabled}
      onClick={onClick}
      data-testid={dataTestId}
      style={buttonObj.width ? { width: buttonObj.width } : undefined}
    >
      <HostButtonContent buttonShape={buttonObj.shape}>
        <Typography
          variant="h2"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '30px',
            textTransform: 'none',
            color: 'inherit',
          }}
        >
          {label}
        </Typography>
      </HostButtonContent>
    </HostButtonStyled>
  );
}
