import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIClients } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
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
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMoreGames = async () => {
    if (apiClients && !loading) {
      setLoading(true);
      const response = await apiClients.gameTemplate.listGameTemplates(8, nextToken, null, null);
      if (response) {
        setGames((prevGames) => [
          ...prevGames,
          ...(response.gameTemplates.map((game) => ({ ...game, id: uuidv4() })) || []),
        ]);
        setNextToken(response.nextToken || null);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiClients) {
      // Load the first 12 games initially
      apiClients.gameTemplate.listGameTemplates(12, null, null, null).then((response) => {
        if (response) {
          setGames(response.gameTemplates.map((game) => ({ ...game, id: uuidv4() })));
          setNextToken(response.nextToken || null);
        }
      });
    }
  }, [apiClients]);

  return (
    <EGMostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
      <InfiniteScroll
        dataLength={games.length}
        next={fetchMoreGames}
        hasMore={!!nextToken}
        loader={<h4>Loading more games...</h4>}
        scrollableTarget="scrollableDiv"
      >
        <Grid container spacing={2} id="scrollableDiv" style={{ height: '80vh', overflow: 'auto' }}>
          {games.map((game) => (
            <Grid
              item
              xs={12}
              md={6} // 700
              xl={4}
              key={game.id} // Using a unique ID for the key
            >
              <StyledGameCard
                title={game.title}
                description={game.description}
                image={game.imageUrl}
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </EGMostPopularContainer>
  );
}
