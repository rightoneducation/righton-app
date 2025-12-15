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

interface SaveGameModalProps {
  isModalOpen: boolean;
  templateType: TemplateType;
  handlePublishGame?: () => void;
  handleCloseSaveGameModal?: () => void;
  handleSaveDraft?: () => void;
  isCardErrored?: boolean;
}

export default function SaveGameModal({
  isModalOpen,
  templateType,
  handlePublishGame,
  handleCloseSaveGameModal,
  handleSaveDraft,
  isCardErrored,
}: SaveGameModalProps) {
  const theme = useTheme();
  const text = templateType === TemplateType.GAME ? 'Game' : 'Question';

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
              {/* eslint-disable-next-line no-nested-ternary */}
              {
              isCardErrored ? 
              (
                <>
                  <DragText> Missing required fields! </DragText>
                  <BodyText> All required input fields need to be completed before you can publish this question. </BodyText>
                </>
              ) :
              (
                <>
                  <DragText> Ready to publish! </DragText>
                  <BodyText> You&apos;re all set. Publish to add it to My Library and make it discoverable if it&apos;s set to public. </BodyText>
                </>
              )}
            <Box style={{ display: 'flex', flexDirection:'column', gap: `${theme.sizing.xSmPadding}px` }}>
              <CentralButton
                buttonType={ButtonType.PUBLISH}
                isEnabled={!isCardErrored}
                onClick={handlePublishGame}
              />
              <CentralButton
                buttonType={ButtonType.SAVEDRAFTBLUE}
                isEnabled
                onClick={handleSaveDraft}
              />
              <CentralButton
                buttonType={ButtonType.BACKTOEDIT}
                isEnabled
                onClick={handleCloseSaveGameModal}
              />
              </Box>
            </Box>
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
