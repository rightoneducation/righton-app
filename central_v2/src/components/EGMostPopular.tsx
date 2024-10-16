import React from 'react';
import { Grid, Typography, Box, styled, useTheme, Grow, Fade, Skeleton } from '@mui/material';
import { IAPIClients, IGameTemplate } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/CentralModels';
import placeHolder from '../images/placeHolder.svg';
import SkeletonGameCard from './SkeletonGameCard';

interface EGMostPopularProps {
  screenSize: ScreenSize;
  apiClients: IAPIClients;
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

const GameCard = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '260px',
    padding: `12px ${theme.sizing.smPadding}px 12px ${theme.sizing.smPadding}px`,
    gap: `${theme.sizing.smPadding}px`,
    borderRadius: `${theme.sizing.smPadding}px`,
    boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
    background: 'linear-gradient(90deg, #EFEFEF 0%, #C2BEBE 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradient-animation 3s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'visible',
  
    '@keyframes gradient-animation': {
      '0%': {
        backgroundPosition: '0% 50%',
      },
      '50%': {
        backgroundPosition: '100% 50%',
      },
      '100%': {
        backgroundPosition: '0% 50%',
      },
    },
  }));

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
  const loadingCards = Array(12).fill(0);
  const isLoading = mostPopularGames.length === 0;
  const maxCards = 12;
  return (
    <EGMostPopularContainer screenSize={screenSize}>
      <MostPopularText screenSize={screenSize}>
        Most Popular
      </MostPopularText>
        <Grid container spacing={2} id="scrollableDiv" >
        {mostPopularGames.length === 0 
          ? Array.from({ length: maxCards }).map((_, index) => {
            return (
              <Grid item xs={12} md={6} xl={4} key={index}> {/* eslint-disable-line */}
                <SkeletonGameCard index={index} />
              </Grid>
            );
            })
          : mostPopularGames.map((game) => {
            return (
              <Grid item xs={12} md={6} xl={4} key={game.id}> {/* eslint-disable-line */}
               <StyledGameCard
                  game={game}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  image={game.imageUrl || placeHolder}
                  apiClients={apiClients}
                />
              </Grid>
            );
          })}
        </Grid>
    </EGMostPopularContainer>
  );
}
