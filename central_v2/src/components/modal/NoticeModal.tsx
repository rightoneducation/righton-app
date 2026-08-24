import React from 'react';
import { Box, Paper, Fade, Typography, styled } from '@mui/material';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import closeX from '../../images/closeX.svg';

const IntegratedContainer = styled(Paper)(({ theme }) => ({
  // NB: Fade below clones this element with an inline `style`, and inline wins
  // over a styled() class -- so position/top/transform must agree there too or
  // edits here silently do nothing. Fixed (not absolute) to centre on the
  // viewport like ModalBackground, rather than on an unpositioned ancestor.
  position: 'fixed',
  borderRadius: '16px',
  width: 'calc(90%)',
  height: 'auto',
  top: '50%',
  transform: 'translate(-50%, -50%)',
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

const HeaderText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center',
}));

const BodyText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center',
}));

const ItemList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: '20px',
  alignSelf: 'center',
  textAlign: 'left',
}));

const ItemText = styled('li')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
}));

interface NoticeModalProps {
  isModalOpen: boolean;
  header: string;
  body?: string;
  items?: string[];
  onClose: () => void;
}

/**
 * Generic notice dialog. Design has not specced inline states for these flows,
 * so success/failure detail is surfaced here rather than added to the screen.
 */
export default function NoticeModal({
  isModalOpen,
  header,
  body = '',
  items = [],
  onClose,
}: NoticeModalProps) {
  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <IntegratedContainer elevation={12}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
          }}
        >
          <Box
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <CloseButton src={closeX} alt="Close" onClick={onClose} />
          </Box>
          <HeaderText> {header} </HeaderText>
          {body.length > 0 && <BodyText> {body} </BodyText>}
          {items.length > 0 && (
            <ItemList>
              {items.map((item) => (
                <ItemText key={item}>{item}</ItemText>
              ))}
            </ItemList>
          )}
          <Box style={{ display: 'flex', gap: '16px' }}>
            <CentralButton
              buttonType={ButtonType.CLOSE}
              isEnabled
              smallScreenOverride
              onClick={onClose}
            />
          </Box>
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
