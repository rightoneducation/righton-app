import React from 'react';
import { Grid, Typography, Box, styled, useTheme } from '@mui/material';
import { APIClients, IGameTemplate } from '@righton/networking';
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';
import placeHolder from '../images/placeHolder.svg';


interface EGMostPopularProps {
  screenSize: ScreenSize;
  apiClients: APIClients;
  mostPopularGames: IGameTemplate[];
}

interface MostPopularTextProps {
    screenSize: ScreenSize;
  }

  const MostPopularText = styled(Typography)<MostPopularTextProps>(({ theme, screenSize }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
}));

interface EGMostPopularContainerProps {
  screenSize: ScreenSize;
  children: React.ReactNode;
}

function EGMostPopularContainer({ screenSize, children }: EGMostPopularContainerProps) {
  const theme = useTheme();

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
        padding: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px` : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px ${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        boxSizing: 'border-box',
        gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : `${theme.sizing.mdPadding}px`,
      }}
    >
      {children}
    </Box>
  );
}

export default function EGMostPopular({ screenSize, apiClients, mostPopularGames }: EGMostPopularProps) {

  return (
    <EGMostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
        <Grid container spacing={2} id="scrollableDiv" style={{ }}>
          {mostPopularGames.map((game) => (
            <Grid
              item
              xs={12}
              md={6} 
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
