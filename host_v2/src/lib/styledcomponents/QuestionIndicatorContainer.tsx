import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

export default styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: `${theme.sizing.extraExtraSmallPadding}px`,
}));
