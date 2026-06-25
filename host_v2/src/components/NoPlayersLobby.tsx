import React from 'react';
import { Box, Typography, styled, useTheme } from '@mui/material';
import { ScreenSize } from '../lib/HostModels';
import monsterWait0 from '../img/MonsterWait0.png';
import monsterWait1 from '../img/MonsterWait1.png';
import monsterWait2 from '../img/MonsterWait2.png';
import monsterWait3 from '../img/MonsterWait3.png';

const EmptyLobbyBodyStyled = styled(Box)(({theme}) => {
  return {
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    height: '100%',
    scrollbarWidth: 'none',
    padding: '16px 12px 16px 12px',
    gap: `${theme.sizing.smPadding}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255, 0.22)',
    borderRadius: `${theme.sizing.xSmPadding}px`,
    boxSizing: 'border-box'
  }
});

const WaitingForPlayersTypographyStyled = styled(Typography)({
    width: '290px', /* this si for the phase description */
    height: '17px',
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
});

const MonsterGridStyled = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)',
    gridTemplateRows: 'repeat(3, auto)',
    gap: '4px',
});

const InternalEmptyLobbyBodyStyled = styled(Box)({
    padding: '32px',
    gap: '10px',
    display: 'flex', // Center horizontally
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
});

const SwipeTypographyStyled = styled(Typography)({
    width: '220px',
    height: '32px',
    opacity: '50%',
    fontFamily: 'Karla',
    fontWeight: '700',
    fontSize: '14px',
    letterSpacing: '-.04em',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 1)',
    lineHeight: '16.37px', /* same everything */
  });
interface NoPlayersLobbyProps {
  questionsCount?: number;
  screenSize?: ScreenSize;
}

export default function NoPlayersLobby({ questionsCount, screenSize }: NoPlayersLobbyProps) {
  const theme = useTheme();
    return (
    <EmptyLobbyBodyStyled>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${theme.sizing.smPadding}px`,
        }}
      >
        <MonsterGridStyled>
          <img src={monsterWait0} alt='monster0' style={{ gridColumn: 2, gridRow: 1, filter: 'drop-shadow(0px 8px 20px rgba(210, 99, 16, 0.3))' }} />
          <img src={monsterWait1} alt='monster1' style={{ gridColumn: 3, gridRow: 2, filter: 'drop-shadow(0px 8px 20px rgba(16, 54, 0, 0.3))' }} />
          <img src={monsterWait3} alt='monster3' style={{ gridColumn: 1, gridRow: 2, filter: 'drop-shadow(0px 8px 20px rgba(133, 3, 19, 0.3))' }} />
          <img src={monsterWait2} alt='monster2' style={{ gridColumn: 2, gridRow: 3, filter: 'drop-shadow(0px 8px 20px rgba(0, 13, 71, 0.3))' }} />
        </MonsterGridStyled>
        <Typography variant='h4' style={{fontWeight: 700, color: theme.palette.primary.main}}>
          Waiting for players to join...
        </Typography>
      </Box>
        {(questionsCount ?? 0) > 1 && screenSize !== ScreenSize.LARGE && (
          <InternalEmptyLobbyBodyStyled>
              <SwipeTypographyStyled>
                Swipe left to view game questions.
              </SwipeTypographyStyled>
          </InternalEmptyLobbyBodyStyled>
        )}
    </EmptyLobbyBodyStyled>
  );
}
