import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// card for question and answer
export default styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: `${theme.sizing.smPadding}px`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
  alignSelf: 'stretch',
  backgroundColor: theme.palette.primary.darkBlueCardColor,
  borderRadius: `${theme.sizing.mdPadding}px`,
  boxShadow: '0px 4px 10px 0px rgba(15, 27, 40, 0.45)',
}));
