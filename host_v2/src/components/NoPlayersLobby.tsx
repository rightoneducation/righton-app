import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ITeam } from '@righton/networking';

const EmptyLobbyBodyStyled = styled(Box)({
    margin: 'auto',
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    scrollbarWidth: 'none',
    padding: '16px 12px 16px 12px',
    gap: '12px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
});

const WaitingForPlayersTypographyStyled = styled(Typography)({
    width: '100%', /* this si for the phase description */
    height: '17px',
    font: 'Rubik',
    fontWeight: '400',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 1)',
    lineHeight: '16.59px', /* same everything */
    textAlign: 'center',
});

const InternalEmptyLobbyBodyStyled = styled(Box)({
    width: '100%',
    height: '96px',
    padding: '32px',
    gap: '10px',
    display: 'flex', // Center horizontally
    // justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
});

const SwipeTypographyStyled = styled(Typography)({
    width: '228px', /* this si for the phase description */
    height: '32px',
    opacity: '50%',
    font: 'Karla',
    fontWeight: '700',
    fontSize: '14px',
    letterSpacing: '-.04em',
    color: 'rgba(255, 255, 255, 1)',
    lineHeight: '16.37px', /* same everything */
  });
export default function NoPlayersLobby() {
    return (
    <EmptyLobbyBodyStyled>
      <WaitingForPlayersTypographyStyled>
        Waiting for players to join...
      </WaitingForPlayersTypographyStyled>
      <InternalEmptyLobbyBodyStyled>
        <SwipeTypographyStyled>
            Swipe to the left to show the questions in this game.
        </SwipeTypographyStyled>
      </InternalEmptyLobbyBodyStyled>
    </EmptyLobbyBodyStyled>
  );
}
