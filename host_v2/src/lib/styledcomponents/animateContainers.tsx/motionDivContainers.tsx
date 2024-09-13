import { styled } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';

export const PrepGameLargeBox = styled(Box)(({ theme }) => ({

    position: 'absolute',
    top:0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 2,
    paddingTop: `${theme.sizing.mdPadding}px`,
}));

