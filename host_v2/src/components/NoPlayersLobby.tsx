import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IQuestion } from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';


const EmptyLobbyBodyStyled = styled(Box)({
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    height: '100%',
    scrollbarWidth: 'none',
    padding: '16px 12px 16px 12px',
    gap: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
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
export default function NoPlayersLobby({ questions, screenSize }: { questions: IQuestion[], screenSize: ScreenSize }) {
    return (
    <EmptyLobbyBodyStyled>
      <WaitingForPlayersTypographyStyled>
        Waiting for players to join...
      </WaitingForPlayersTypographyStyled>
      {questions.length > 1 && screenSize !== ScreenSize.LARGE && (
        <InternalEmptyLobbyBodyStyled>
            <SwipeTypographyStyled>
              Swipe left to view game questions.
            </SwipeTypographyStyled>
        </InternalEmptyLobbyBodyStyled>
      )}
    </EmptyLobbyBodyStyled>
  );
}
