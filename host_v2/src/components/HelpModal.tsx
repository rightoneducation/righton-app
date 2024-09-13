import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Modal from 'react-modal';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ButtonStyled from '../lib/styledcomponents/ButtonStyled';
import Logo from '../img/rightOnLogo.svg';

interface RejoinModalProps {
  isHelpDisplayed: boolean;
  setIsHelpDisplayed: (isHelpDisplayed: boolean) => void;
}

export default function RejoinModal({
  isHelpDisplayed,
  setIsHelpDisplayed,
}: RejoinModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isHelpDisplayed}
      contentLabel="Rejoin Modal"
      style={{
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: `${theme.breakpoints.values.sm}px`,
          paddingLeft: `${theme.sizing.mdPadding}px`,
          margin: '20px',
          borderRadius: '24px',
          borderColor: theme.palette.primary.darkBlueCardColor,
          backgroundColor: theme.palette.primary.darkBlueCardColor,
          boxShadow: `0px 20px 20px rgba(0, 0, 0, 0.25)`,
          zIndex: 5
        },
        overlay: {
          height: '100%',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4
        },
      }}
      onRequestClose={() => setIsHelpDisplayed(false)}
      shouldCloseOnOverlayClick
      appElement={document.getElementById('root') || undefined}
    >
      <BodyCardContainerStyled>
        <img
          style={{
            width: `100%`,
            maxHeight: '118px',
            height: '100%',
          }}
          src={Logo}
          alt="Question"
        />
        <Typography variant="h3" style={{textAlign: 'center', color: `${theme.palette.primary.main}`}}>Welcome to RighOn! Host! </Typography>
        <Typography variant="body1" style={{textAlign: 'center', color: `${theme.palette.primary.main}`}}>Once your students have joined, press the start game button to begin! </Typography>
        <ButtonStyled
          onClick={() => {
            setIsHelpDisplayed(false);
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
            cursor: 'pointer',
          }}
        >
          OK
        </ButtonStyled>
      </BodyCardContainerStyled>
    </Modal>
  );
}
