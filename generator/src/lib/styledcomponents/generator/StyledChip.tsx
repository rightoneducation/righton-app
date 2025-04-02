import { Chip, styled } from '@mui/material';

interface ChipProps {
  isSelected: boolean;
}

export const ChipStyled = styled(Chip)<ChipProps>(({ theme, isSelected }) => ({
  textTransform: 'none',
  border: `2px solid ${theme.palette.primary.buttonPrimaryDefault}`,
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.buttonPrimaryDefault,
  backgroundColor: isSelected ? theme.palette.primary.buttonPrimaryDefault : 'transparent',
  ':hover': {
    backgroundColor: isSelected ? theme.palette.primary.buttonPrimaryDefault : theme.palette.primary.chipHover,
  },
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  cursor: 'pointer'
}));