import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// card for question and answer
export const BodyCardStyled = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  padding: `${theme.sizing.mdPadding}px`,
  gap: `${theme.sizing.smPadding}px`,
  backgroundColor: theme.palette.primary.main,
  // boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
}));

export const BodyCardStyledBlue = styled(BodyCardStyled)(({theme}) => ({
  backgroundColor: theme.palette.primary.darkBlueCardColor
}))