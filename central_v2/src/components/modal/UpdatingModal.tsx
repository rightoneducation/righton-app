import React from 'react';
import {
  Box,
  Paper,
  Fade,
  Typography,
  styled,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { ModalStateType, TemplateType } from '../../lib/CentralModels';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';

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
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box',
}));

const DragText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  width: '100%',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 700,
  textAlign: 'center',
}));

const BodyText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik',  
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center',
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
}));

interface UpdatingModalProps {
  modalState: ModalStateType;
  isModalOpen: boolean;
  templateType: TemplateType;
}

export default function UpdatingModal({
  modalState,
  isModalOpen,
  templateType,
}: UpdatingModalProps) {
  const theme = useTheme();
  let text = '';

  switch (modalState){
    case ModalStateType.DELETING:
      text = 'Deleting...';
      break;
    case ModalStateType.SAVING:
      text = 'Saving...';
      break;
    case ModalStateType.PUBLISHING:
      text = 'Publishing...';
      break;
    case ModalStateType.LOADING:
    default:
      text = 'Loading...';
    break;
  }


  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
       <Box
          style={{
            position: 'absolute',
            width: 'calc(100%)',
            height: '100%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1310,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Paper elevation={6} style={{ 
            width: '100%', 
            height: '100%', 
            maxWidth: '430px', 
            maxHeight: '225px', 
            padding: `${theme.sizing.xLgPadding}px`, 
            borderRadius: '13px', 
            boxSizing: 'border-box',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: `${theme.sizing.smPadding}px`
          }}>
              <CircularProgress size="48px" style={{ color: "#000" }} />
              <DragText style={{ color: "#000", fontWeight: 400}}> {text} </DragText>
          </Paper>
        </Box>
    </Fade>
  );
}
