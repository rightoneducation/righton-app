import { Button, Box, Typography, styled } from '@mui/material';
import { ButtonColor } from '../../components/button/ButtonModels';

type ButtonStyledProps = {
  buttonColor: ButtonColor;
};

export const ButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<ButtonStyledProps>(({ theme, buttonColor }) => ({
  width: 'fit-content',
  height: '38px',
  borderRadius: '54px',
  textTransform: 'none',
  boxShadow: '0px 0px 8px 0px rgba(71, 217, 255, 0.4)',
  background:
    buttonColor === ButtonColor.RED
      ? `${theme.palette.primary.buttonGradientRed}`
      : `${theme.palette.primary.buttonGradientBlue}`,
  ':hover': {
    background:
      buttonColor === ButtonColor.RED
        ? `${theme.palette.primary.buttonGradientRed}`
        : `${theme.palette.primary.buttonGradientBlue}`,
  },
  '&:disabled': {
    background: `${theme.palette.primary.buttonGradientGrey}`,
  },
}));

export const ButtonContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  gap: '8px',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '12px',
  paddingRight: '12px',
}));

export const ButtonIconContainer = styled(Box)(({ theme }) => ({
  height: '20px',
  width: '20px',
}));

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: '700',
  color: '#FFFFFF',
}));
