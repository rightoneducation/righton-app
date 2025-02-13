

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme } from '@mui/material';
import { SavedModalTextStyled } from '../../lib/styledcomponents/generator/StyledTypography';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: '490px',
  height: 'auto',
  top: '30%',
  maxHeight: '100%',
  background: '#FFF',
  paddingTop: '22px',
  paddingBottom: '22px',
  paddingLeft: '120px',
  paddingRight: '120px',
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

interface QuestionSavedModalProps {
  isModalOpen: boolean;
}

export default function QuestionSavedModal({
  isModalOpen,
}: QuestionSavedModalProps) {
  const theme = useTheme();

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%)'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px'
        }}> 
          <SavedModalTextStyled > The question has been saved to </SavedModalTextStyled>
          <SavedModalTextStyled style={{fontWeight: 700, fontStyle: 'italic'}}>  My Questions </SavedModalTextStyled> 
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
