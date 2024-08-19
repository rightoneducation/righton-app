import { styled } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';

export const Phase2DiscussLargeBox = styled(Box)(({ theme }) => ({

    position: 'absolute',
    top:0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 2,
    paddingTop: `${theme.sizing.mdPadding}px`,
}));

