

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme } from '@mui/material';
import { TemplateType } from '../../lib/CentralModels';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100%)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '400px',
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

interface CreatingTemplateModalProps {
  isModalOpen: boolean;
  templateType: TemplateType;

}

export default function CreatingTemplateModal({
  isModalOpen,
  templateType
}: CreatingTemplateModalProps) {
  const theme = useTheme();
  const text = templateType === TemplateType.GAME ? 'Game' : 'Question';

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px'
        }}> 
          <DragText>Creating {text} Template </DragText>
          <CircularProgress size="48px" style={{color:`${theme.palette.primary.circularProgress}`}}/>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
