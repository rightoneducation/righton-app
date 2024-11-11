import React from 'react';
import { Box, Fade, Typography, styled } from '@mui/material';
import imageUploadIcon from '../../images/imageUploadIcon.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

const IntegratedContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  margin: 'auto',
  borderRadius: '16px',
  marginLeft: '20px',
  marginRight: '20px',
  width: '100%',
  height: '100%',
  maxWidth: '800px',
  maxHeight: '400px',
  background: '#FFF',
  padding: '25px',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
}));

const UploadIcon = styled('img')(({ theme }) => ({
  width: '60px',
  height: '60px',
}));

const DragText = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 700,
}));

interface ImageUploadModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

export default function ImageUploadModal({
  isModalOpen,
  handleCloseModal,
}: ImageUploadModalProps) {
  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer>
        <svg
          width="calc(100% - 50px)" 
          height="calc(100% - 50px)"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: '25px',
            left: '25px',
            boxSizing: 'border-box',
          }}
        >
          <rect
            x="5"
            y="5"
            width="calc(100% - 10px)"
            height="calc(100% - 10px)"
            fill="none"
            stroke="#333"
            strokeWidth="5"
            strokeDasharray="20, 20"
            strokeDashoffset="10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <UploadIcon src={imageUploadIcon} alt="imageUploadIcon" />
        <DragText>Drag & Drop File here</DragText>
        <DragText style={{ fontSize: '20px' }}>or</DragText>
        <CentralButton buttonType={ButtonType.UPLOAD} isEnabled onClick={() => {}} />
      </IntegratedContainer>
    </Fade>
  );
}
