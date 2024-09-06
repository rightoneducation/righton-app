import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIClients, IGameTemplate } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid'; 
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';
import placeHolder from '../images/placeHolder.svg';


interface EGMostPopularProps {
  screenSize: ScreenSize;
  apiClients: APIClients;
  searchedGames: IGameTemplate[];
}

interface MostPopularTextProps {
    screenSize: ScreenSize;
  }

const MostPopularText = styled(Typography)(({ screenSize }: MostPopularTextProps) => ({
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
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-start',
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

export default function EGMostPopular({ screenSize, apiClients, searchedGames }: EGMostPopularProps) {

  return (
    <EGMostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
        <Grid container spacing={2} id="scrollableDiv" style={{ }}>
          {searchedGames.map((game) => (
            <Grid
              item
              xs={12}
              md={6} // 700
              xl={4}
              key={game.id} 
            >
              <StyledGameCard
                game={game}
                id={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl || placeHolder}
                apiClients={apiClients}
              />
            </Grid>
          ))}
        </Grid>
    </EGMostPopularContainer>
  );
}
