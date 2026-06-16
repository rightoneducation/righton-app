import { ReactNode, CSSProperties } from 'react';
import { Typography } from '@mui/material';
import { HostButtonType, hostButtonContentMap } from './HostButtonModels';
import {
  HostButtonStartStyled,
  HostButtonGameStyled,
  HostButtonSortStyled,
  HostButtonContent,
} from './styledcomponents/ButtonStyledComponents';

interface HostButtonProps {
  buttonType: HostButtonType;
  label: string;
  isEnabled: boolean;
  onClick?: () => void;
  dataTestId?: string;
  icon?: ReactNode;
  style?: CSSProperties;
}

export function HostButton({
  buttonType,
  label,
  isEnabled,
  onClick,
  dataTestId,
  icon,
  style,
}: HostButtonProps) {
  const buttonObj = hostButtonContentMap[buttonType];

  const buttonLabel = [
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
  ]
  switch(buttonType){
    case HostButtonType.SORT:
      return (
        <HostButtonSortStyled
          disabled={!isEnabled}
          onClick={onClick}
          data-testid={dataTestId}
          style={style}
        >
          <HostButtonContent>
            {icon}
          </HostButtonContent>
        </HostButtonSortStyled>
      );
    case HostButtonType.PREPARE_GAME:
    case HostButtonType.NEXT_QUESTION:
    case HostButtonType.END_GAME:
    case HostButtonType.EXIT_TO_CENTRAL:
      return (
        <HostButtonStartStyled
          disabled={!isEnabled}
          onClick={onClick}
          data-testid={dataTestId}
          style={buttonObj.width ? { width: buttonObj.width } : undefined}
        >
          <HostButtonContent>
            { buttonType === HostButtonType.PREPARE_GAME &&
              <img src={(isEnabled ? buttonObj.icon : buttonObj.disableIcon) ?? ''} alt='icon'/>
            }
            {buttonLabel} 
          </HostButtonContent>
        </HostButtonStartStyled>
      );
    default:
      return (
        <HostButtonGameStyled
          disabled={!isEnabled}
          onClick={onClick}
          data-testid={dataTestId}
          style={buttonObj.width ? { width: buttonObj.width } : undefined}
        >
          <HostButtonContent>
            { buttonType === HostButtonType.START_GAME &&
              <img src={(isEnabled ? buttonObj.icon : buttonObj.disableIcon) ?? ''} alt='icon'/>
            }
            {buttonLabel} 
          </HostButtonContent>
        </HostButtonGameStyled>
      )
  }
}
