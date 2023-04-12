import { styled } from '@mui/material/styles';
import { Paper, Stack } from '@mui/material';

export const BodyCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: '16px',
  backgroundColor: theme.palette.primary.main,
}));

export const BodyCardContainer = styled(Stack)({
  width: '100%',
  alignItems: 'center',
});
