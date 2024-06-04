import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import ProgressBar from './ProgressBar';
import StartGameButton from './StartGameButton';

interface FootStartGameProps {
  teamsLength: number;
  initialClicked?: boolean; 
}



const FooterContainer = styled(Box)({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '0',
  width: '100%',
  gap: '16px',

});

const InnerFooterContainer = styled(Box)({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '92px',
  gap: '8px',

});
// need 16px between pagination and words
function FooterStartGame({ teamsLength, initialClicked=false }: FootStartGameProps) {
  return (
    <FooterContainer>
      <PaginationContainerStyled className="swiper-pagination-container" />
      <InnerFooterContainer>
        <ProgressBar teamsLength={teamsLength} />
        {/* <ButtonStyled disabled={teamsLength <= 0}>Start Game</ButtonStyled> */}
        <StartGameButton disabled={teamsLength <= 0} initialClicked={initialClicked} />
      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterStartGame;
