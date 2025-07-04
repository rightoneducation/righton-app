import { Typography, styled } from '@mui/material';

export const CMS_HeroImage = styled('img')(() => ({
  width: '100%',
  maxWidth: '568px',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '8px',
}));

export const CMS_TitleText = styled(Typography)(() => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '40px',
  lineHeight: '48px',
  color: '#FFFFFF',
}));

export const CMS_HeaderText = styled(CMS_TitleText)(() => ({
  fontSize: '24px',
  lineHeight: '30px',
}));

export const CMS_BodyText = styled(Typography)(() => ({
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#FFFFFF',
}));

