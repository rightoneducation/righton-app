import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ScreenSize } from '../../lib/HostModels';
import PaginationContainerStyled from '../../lib/styledcomponents/PaginationContainerStyled';

interface FooterGameEndedProps {
  teamsLength: number;
  screenSize: ScreenSize;
  isGameSelected: boolean;
}

const ButtonStyled = styled(Button)({
  border: '2px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px #47D9FF 30%',
  '&:disabled': {
    background: '#032563',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '100%',
    cursor: 'not-allowed',
    boxShadow: '0px 5px 22px 0px #47D9FF 30%',

  },
});

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
function FooterGameEnded({ teamsLength, screenSize, isGameSelected }: FooterGameEndedProps) {
  return (
    <FooterContainer>
      { screenSize === ScreenSize.SMALL && 
        <PaginationContainerStyled className="swiper-pagination-container" />
      }
      <InnerFooterContainer>
        <ButtonStyled disabled={isGameSelected === false}>
          {isGameSelected ? 'Start Selected Game' : 'Exit To Righton Central'}
        </ButtonStyled>      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterGameEnded;
