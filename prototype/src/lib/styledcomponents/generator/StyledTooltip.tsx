import { Tooltip, styled } from '@mui/material';

export const TooltipStyled = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: `${theme.palette.primary.darkBlueCardColor} !important`, // Ensures the background applies
    color: `${theme.palette.primary.main} !important`, // Ensures text remains white
    fontSize: '14px',
    padding: '10px 15px',
    borderRadius: '8px',
    maxWidth: '250px', 
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    marginRight: '23px !important'
  },
  '& .MuiTooltip-arrow': {
    color: `${theme.palette.primary.darkBlueCardColor} !important`, // Ensures arrow color matches the tooltip
  },
}));