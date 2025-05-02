

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/CentralModels';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100%)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '352px',
  background: '#FFF',
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingLeft: '24px',
  paddingRight: '24px',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box'
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface DiscardModalProps {
  isModalOpen: boolean;
  screenSize: ScreenSize;
  handleDiscardClick: (discard: boolean) => void;

}

export default function DiscardModal({
  isModalOpen,
  screenSize,
  handleDiscardClick
}: DiscardModalProps) {
  
  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%)', paddingLeft: '24px', paddingRight: '24px', boxSizing: 'border-box'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px',
        }}> 
          <DragText>Are you sure?</DragText>
          <Box style={{
            width: '100%',
            display: 'flex', 
            flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '16px',
          }}>
            <CentralButton buttonType={ButtonType.YES} isEnabled smallScreenOverride onClick={() => handleDiscardClick(true)}/>
            <CentralButton buttonType={ButtonType.NO} isEnabled smallScreenOverride onClick={() => handleDiscardClick(false)}/>
          </Box>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
