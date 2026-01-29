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
import { TemplateType } from '../../lib/CentralModels';
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

interface DiscardGameModalProps {
  isModalOpen: boolean;
  templateType: TemplateType;
  handleDiscardClick?: () => void;
  handleCloseDiscardModal?: () => void;
  handleSaveEditedGame?: () => void;
  isUpdatingTemplate?: boolean;
}

export default function DiscardGameModal({
  isModalOpen,
  templateType,
  handleDiscardClick,
  handleCloseDiscardModal,
  isUpdatingTemplate,
  handleSaveEditedGame,
}: DiscardGameModalProps) {
  const theme = useTheme();
  const text = templateType === TemplateType.GAME ? 'Game' : 'Question';
  const text2 = isUpdatingTemplate ? 'Updating' : 'Creating';

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
            <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.mdPadding}px` }}>
              <DragText> Leave without saving? </DragText>
              <BodyText> You have unsaved changes. Please choose one of the following to avoid losing progress. </BodyText>
              <Box style={{ display: 'flex', flexDirection:'column', gap: `${theme.sizing.xSmPadding}px` }}>
              <CentralButton
                buttonType={ButtonType.DISCARD}
                isEnabled
                onClick={handleDiscardClick}
              />
              <CentralButton
                buttonType={ButtonType.UPDATE}
                isEnabled
                onClick={handleSaveEditedGame}
              />
              <CentralButton
                buttonType={ButtonType.BACKTOEDIT}
                isEnabled
                onClick={handleCloseDiscardModal}
              />
              </Box>
            </Box>
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
