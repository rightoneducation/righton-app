import React from 'react';
import { Box, Fade, Typography, styled } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import imageUploadIcon from '../../images/imageUploadIcon.svg';
import imageUploadClose from '../../images/imageUploadClose.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DropImageUpload from '../DropImageUpload';
import ImageUploadDashedBorder from './ImageUploadDashedBorder';

const IntegratedContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100% - 48px)',
  top: '50%',
  transform: 'translateY(-50%)',
  height: 'auto',
  minHeight: '400px',
  maxWidth: '800px',
  background: '#FFF',
  padding: '25px',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
  alignItems: 'center',
  boxSizing: 'border-box',
}));

const UploadIcon = styled('img')(({ theme }) => ({
  width: '60px',
  height: '60px',
}));

const DragText = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 700,
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  position: 'absolute',
  top: '40px',
  right: '40px',
  cursor: 'pointer'
}))

interface ImageUploadModalProps {
  isModalOpen: boolean;
  handleImageSave: (file: File) => void;
  handleCloseModal: () => void;
}

export default function ImageUploadModal({
  isModalOpen,
  handleImageSave,
  handleCloseModal
}: ImageUploadModalProps) {
  const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];
  const [image, setImage] = React.useState<File | null>(null);

  const handleImageChange = (file: File) => {
    if (file){
      setImage(file);
    }
  }

  const handleSaveClick = () => {
    if (image) {
      handleImageSave(image);
    }
  }

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer>
          <ImageUploadDashedBorder />
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleCloseModal} />
          {image ? (
            <Box style={{width: '100%', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <DragText>Image Preview</DragText>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '8px',
                  marginTop: '16px',
                }}
              />
              <Box style={{
                display: 'flex',
                gap: '16px',
                marginTop: '16px',
              }}>
                <CentralButton
                  buttonType={ButtonType.CHANGEIMAGE}
                  isEnabled
                  type="file"
                  handleFileChange={handleImageChange}
                />
                <CentralButton
                  buttonType={ButtonType.SAVE}
                  isEnabled
                  onClick={handleSaveClick}
                />
              </Box>
            </Box>
          ) : (
            <DropImageUpload handleImageSave={handleImageChange}>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: '16px',
              }}>
                <UploadIcon src={imageUploadIcon} alt="imageUploadIcon" />
                <DragText>Drag & Drop File here</DragText>
                <DragText style={{ fontSize: '20px' }}>or</DragText>
                <CentralButton
                  type="file"
                  buttonType={ButtonType.UPLOAD}
                  isEnabled
                  handleFileChange={handleImageChange}
                />
              </Box>
            </DropImageUpload>   
          )}
      </IntegratedContainer>      
    </Fade>
  );
}
