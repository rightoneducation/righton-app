import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme, progressPercent }) => ({
    position: 'absolute',
    top: '0',
    left: '0',
    width: `${progressPercent - 2}%`,
    textAlign: 'right',
    fontFamily: 'Helvetica',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: '1',
    lineHeight: '18px',
}));