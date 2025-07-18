import { Typography, styled } from '@mui/material';

// Styled components for a full Article

export const CMSHeroImage = styled('img')(() => ({
  width: '100%',
  maxWidth: '648px',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '8px',
}));

export const CMSTitleText = styled(Typography)(() => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '40px',
  lineHeight: '48px',
  color: '#FFFFFF',
}));

export const CMSHeaderText = styled(CMSTitleText)(() => ({
  fontSize: '24px',
  lineHeight: '30px',
}));

export const CMSBodyText = styled(Typography)(() => ({
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '19px',
  color: '#FFFFFF',
}));

// Styled components for a Content Card 

export const CMSCardThumbnailImage = styled('img')(() => ({
  width: '100%',
  maxWidth: '98px',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '8px',
}));

export const CMSCardTitle = styled(Typography)(() => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '16px',
  color: '#FFFFFF',
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}));

export const CMSCardCaption = styled(Typography)(() => ({
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '16px',
  color: '#FFFFFF',
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}));

export const CMSCardTag = styled(CMSCardTitle)(() => ({
  fontSize: '8px',
  lineHeight: '8px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  color: '#FFFFFF',
  border: '1px solid #FFFFFF',
  padding: '4px',
  borderRadius: '9px',
  boxSizing: 'border-box',
}));

export const CMSCardDateText = styled(CMSCardTitle)(() => ({
  fontSize: '12px',
  lineHeight: '12px',
  fontFamily: 'Rubik',
  fontWeight: 400,
  color: '#FFFFFF',
}));