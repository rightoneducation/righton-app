import { Typography, styled } from '@mui/material';

export const CardHeaderTextStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.darkBlue}`,
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px'
}));

export const FooterTextStyled = styled(CardHeaderTextStyled)(({ theme }) => ({
  fontWeight: 300,
}));

export const FooterBoldStyled = styled(CardHeaderTextStyled)(({ theme }) => ({
  textDecoration: 'underline',
}));

export const WrongAnswerNumberStyled = styled(Typography)(({ theme }) => ({
  paddingLeft: '9px',
  minWidth: '20px',
  color: `${theme.palette.primary.darkPurple}`,
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',
  fontFamily: 'Rubik',
  boxSizing: 'border-box'
}));

