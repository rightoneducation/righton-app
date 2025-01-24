import {Button, Box, styled, Typography} from '@mui/material';

export const ImageButtonStyled = styled(Button)(({ theme }) => ({ // eslint-disable-button
  width: '190px',
  height: '38px',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0px 0px 8px 0px rgba(71, 217, 255, 0.4)',
  background: `${theme.palette.primary.extraDarkBlue}`,
  ':hover': {
    background: `${theme.palette.primary.extraDarkBlue}`,
  },
  display: 'flex',
  justifyContent: 'flex-start',
  paddingLeft: '24px',
  paddingTop: '10px',
  paddingBottom: '10px',
  gap: '8px'
}));

export const ImageButtonIcon = styled('img')(({theme}) => ({
  height: '20px',
  width: '20px'
}));

export const ImageButtonText = styled(Typography)(({theme}) => ({
  fontSize: '16px',
  color: `${theme.palette.primary.main}`
}));