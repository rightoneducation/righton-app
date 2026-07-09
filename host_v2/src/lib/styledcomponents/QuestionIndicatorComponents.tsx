import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const BasePhasePill = styled(Box)({
  width: '64px',
  height: '20px',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  fontFamily: 'Poppins',
  fontSize: '12px',
  fontWeight: 400,
});

export const PhasePillSelected = styled(BasePhasePill)(({ theme }) => ({
  backgroundColor: theme.palette.designSystem.foreground.base,
  color: theme.palette.designSystem.surface.host,
}));

export const PhasePillUnselected = styled(BasePhasePill)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'rgba(255, 255, 255, 0.7)',
});

export const PhasePillUnplayed = styled(BasePhasePill)({
  backgroundColor: 'transparent',
  color: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
});
