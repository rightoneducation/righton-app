import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  gap: `${theme.sizing.extraExtraSmallPadding}px`,
  width: '100%',
  marginTop: `${theme.sizing.extraExtraSmallPadding}px`,
}));
