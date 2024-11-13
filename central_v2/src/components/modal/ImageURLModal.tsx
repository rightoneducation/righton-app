import React, { useState, useCallback } from 'react';
import { Box, Fade, Typography, styled } from '@mui/material';
import { debounce } from 'lodash';
import imageUploadClose from '../../images/imageUploadClose.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { TextContainerStyled } from '../../lib/styledcomponents/CreateQuestionStyledComponents';


const IntegratedContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100% - 48px)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '800px',
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
  textAlign: 'left'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface ImageURLModalProps {
  isModalOpen: boolean;
  handleImageSave: (file: File) => void;
  handleCloseModal: () => void;
}

export default function ImageURLModal({
  isModalOpen,
  handleImageSave,
  handleCloseModal
}: ImageURLModalProps) {
  const [url, setUrl] = useState<string>('');

  const handleSaveClick = async  () => {
    const response = await fetch(url);
    const blob = await response.blob();
    const metadata = {
      type: blob.type
    };
    const image = new File ([blob], 'image', metadata);
    if (image) {
      handleImageSave(image);
    }
  }

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}> 
          <DragText>Image URL</DragText>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleCloseModal} />
        </Box>
        <TextContainerStyled value={url} variant="outlined" rows='1' placeholder="Image URL..." onChange={(e)=> setUrl(e.target.value)}/>
        {url.length > 0 && 
          <Fade in={url.length > 0} mountOnEnter unmountOnExit timeout={1000}>
            <Box style={{width: '100%', height: '50%', overflowY: 'auto'}}>
              <img src={url} alt="preview" width="100%" height="100%"/>
            </Box>
          </Fade>
        }
        <CentralButton buttonType={ButtonType.SAVE} onClick={handleSaveClick} isEnabled/>
      </IntegratedContainer>      
    </Fade>
  );
}
