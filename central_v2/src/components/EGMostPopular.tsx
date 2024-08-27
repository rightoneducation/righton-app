import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import { APIClients } from '@righton/networking';
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';

interface EGMostPopularProps {
  screenSize: ScreenSize;
  apiClients?: APIClients;
}

const MostPopularText = styled(Typography)(({ screenSize }: EGMostPopularProps) => ({
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? '24px' : '40px',
  color: '#02215F',
}));

interface EGMostPopularContainerProps {
  screenSize: ScreenSize;
  children: React.ReactNode;
}

function EGMostPopularContainer({ screenSize, children }: EGMostPopularContainerProps) {
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
        padding: screenSize === ScreenSize.SMALL ? '16px 24px 16px 24px' : '24px 32px 24px 32px',
        boxSizing: 'border-box',
        gap: screenSize === ScreenSize.SMALL ? '16px' : '24px',
      }}
    >
      {children}
    </Box>
  );
}

export default function EGMostPopular({ screenSize, apiClients }: EGMostPopularProps) {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    if (apiClients) {
      // first 12 games
      apiClients.gameTemplate.listGameTemplates(12, null, null, null).then(response => {
        setGames(response?.gameTemplates || []);
        const nextToken = response?.nextToken;

        // if (nextToken) {
        //   apiClients.gameTemplate.listGameTemplates(8, nextToken, null, null).then(response2 => {
        //     setGames(prevGames => [...prevGames, ...(response2?.gameTemplates || [])]);
        //   });
        // }
      });
    }
  }, [apiClients]);

  return (
    <EGMostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid
            item
            xs={12}
            md={6} // 700
            xl={4}
            key={game.id} // Using the game ID as the key
          >
            <StyledGameCard
              title={game.title}
              description={game.description}
              image={game.imageUrl}
            />
          </Grid>
        ))}
      </Grid>
    </EGMostPopularContainer>
  );
}
