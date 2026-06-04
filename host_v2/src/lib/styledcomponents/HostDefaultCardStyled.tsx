import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// card for question and answer
export default styled(Paper)(({ theme }) => ({
  display: 'flex',
  paddingTop: `${theme.sizing.mdPadding}px`,
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingBottom: `${theme.sizing.mdPadding}px`,
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
  alignSelf: 'stretch',
  backgroundColor: theme.palette.primary.darkBlueCardColor,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  // boxShadow: '0px 4px 10px 0px rgba(15, 27, 40, 0.45)',
}));
