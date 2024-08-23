import React from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // Using UUID for unique keys
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';

interface EGMostPopularProps {
  screenSize: ScreenSize;
}
const MostPopularText = styled(Typography)(() => ({
    width: '270px',
    lineHeight: '60px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: '40px',
    height: '60px',
    color: '#02215F',

  }));
function EGMostPopularContainer({ children }: { children: React.ReactNode }) {
    return (
      <Box
        sx={{
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#E9F1FF',
          padding: 2,
        }}
      >
        {children}
      </Box>
    );
  }
  

export default function EGMostPopular({ screenSize }: EGMostPopularProps) {
  const games = Array.from({ length: 12 }, () => ({
    id: uuidv4(),
  })); // Example data with unique IDs

  return (
    <EGMostPopularContainer>
      <MostPopularText>
        Most Popular
      </MostPopularText>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={game.id} // Using a unique ID as the key
          >
            <StyledGameCard />
          </Grid>
        ))}
      </Grid>
    </EGMostPopularContainer>
  );
}
