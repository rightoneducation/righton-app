import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
    fontSize: '12px',
    lineHeight: '12px',
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    margin: 'auto',
}));