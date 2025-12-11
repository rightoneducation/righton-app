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
import { ConfirmStateType, TemplateType } from '../../lib/CentralModels';
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
  fontSize: '24px',
  lineHeight: '32px',
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

interface ConfirmSaveModalProps {
  isModalOpen: boolean;
  templateType: TemplateType;
  confirmState: ConfirmStateType;
  handleContinue?: () => void;
}

export default function ConfirmSaveModal({
  isModalOpen,
  templateType,
  confirmState,
  handleContinue,
}: ConfirmSaveModalProps) {
  const theme = useTheme();
  const type = templateType === TemplateType.GAME ? 'Game' : 'Question';
  let titleText = '';
  let subtitleText = '';

  switch (confirmState) {
    case ConfirmStateType.FAVORITED:
      titleText = `${type} Favorited`;
      subtitleText = `You can view your favorited ${type.toLowerCase()} in My Library.`;
      break;
    case ConfirmStateType.DRAFT:
      titleText = `${type} saved`;
      subtitleText = `A draft of your ${type.toLowerCase()} has been saved.`;
      break;
    case ConfirmStateType.PUBLISHED:
      titleText = `${type} published`;
      subtitleText = `Congratulations! Your ${type.toLowerCase()} is ready to be launched.`;
      break;
    case ConfirmStateType.UPDATED:
    default:
      titleText = `${type} updated`;
      subtitleText = `Your ${type.toLowerCase()} is ready to launch.`;
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
      <IntegratedContainer elevation={12} style={{ maxWidth: '430px', padding: `${theme.sizing.xLgPadding}px`}}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <DragText> {titleText} </DragText>
          <BodyText> {subtitleText} </BodyText>
          <CentralButton
            buttonType={ButtonType.CONTINUE}
            isEnabled
            onClick={handleContinue || (() => {})}
          />
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
