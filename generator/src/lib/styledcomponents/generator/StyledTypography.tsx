import { Typography, styled } from '@mui/material';

export const HeaderText = styled(Typography)(({ theme }) => ({
  color: 'white', 
  fontFamily: 'Poppins', 
  fontSize: '20px', 
  fontWeight: 700
}));

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

export const PlaceholderHeaderStyled = styled(CardHeaderTextStyled)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  fontSize: '20px',
  textAlign: 'center'
}));

export const PlaceholderBodyStyled = styled(PlaceholderHeaderStyled)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px'
}));

export const EditTextStyled = styled(Typography)(({ theme }) => ({
  color: `rgba(0,0,0,0.59)`,
  fontSize: '14px',
  lineHeight: '24px',
  textDecoration: 'underline',
  cursor: 'pointer'
}));

export const ExplanationTextStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.darkBlue}`,
  fontSize: '16px',
  lineHeight: '16px',
  wordWrap: 'break-word'
}));

export const EditStatusTextStyled = styled(ExplanationTextStyled)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '14px',
  paddingLeft: '8px',
}));

interface ButtonSubtextStyledProps {
  isDiscardEnabled?: boolean;
}

export const ButtonSubtextStyled = styled(Typography)<ButtonSubtextStyledProps>(({ theme, isDiscardEnabled }) => ({
  color: '#000',
  fontSize: '14px',
  lineHeight: '14px',
  fontWeight: isDiscardEnabled ? 700 : 400,
}));

export const SavedTextStyled = styled(Typography)(({ theme }) => ({
  fontSize: '40px',
  fontWeight: 700,
  color: '#229E15',
}));

export const SavedModalTextStyled = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '24px',
  color: `${theme.palette.primary.darkBlue}`,
  textAlign: 'center'
}));

export const DiscardTextStyled = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '14px',
  color: `${theme.palette.primary.darkBlue}`,
}));

export const HowToTitleStyled = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik',
  fontSize: '16px',
  lineHeight: '16px',
  color: `${theme.palette.primary.darkBlue}`,
}));

export const HowToListItemStyled = styled('li')(({ theme }) => ({
  fontFamily: 'Rubik',
  fontSize: '16px',
  lineHeight: '16px',
  color: `${theme.palette.primary.darkBlue}`,
}));


export const HowToBulletItemStyled = styled(HowToListItemStyled)(({ theme }) => ({
  marginBottom: '16px'
}));