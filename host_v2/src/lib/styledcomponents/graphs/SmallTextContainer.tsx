import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.xSmPadding}px`,
  textAlign: 'center'
}));

export const SmallText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '14px',
  lineHeight: '14px',
  color: `${theme.typography.h2.color}`,
  fontWeight: `${theme.typography.body1.fontWeight}`,
}));