import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ITeam } from '@righton/networking';


const EmptyLobbyBodyStyled = styled(Box)({
    // margin: 'auto',
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    scrollbarWidth: 'none',
    padding: '16px 12px 16px 12px',
    gap: '12px',
    // width: '100%',
    // height: '157px', when i add this it makes it not 157?
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
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

const InternalEmptyLobbyBodyStyled = styled(Box)({
    // height: '96px',
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
