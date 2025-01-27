import React from 'react';
import { Box, Paper, Fade, Typography, styled } from '@mui/material';
import { CentralQuestionTemplateInput } from '@righton/networking';
import imageUploadClose from '../../images/imageUploadClose.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { TextContainerStyled } from '../../lib/styledcomponents/CreateQuestionStyledComponents';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100% - 48px)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '672px',
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
  draftQuestion: CentralQuestionTemplateInput;
  modalImageUrl: string | null;
  debouncedModalImageUrl: string | null;
  handleImageUrlChange: (debouncedQuestion: CentralQuestionTemplateInput, url: string) => void;
  handleImageSave: (image: undefined, inputUrl: string) => void;
  handleCloseModal: () => void;
}

export default function ImageURLModal({
  isModalOpen,
  draftQuestion,
  modalImageUrl,
  debouncedModalImageUrl,
  handleImageUrlChange,
  handleImageSave,
  handleCloseModal
}: ImageURLModalProps) {
  const imageUrl = modalImageUrl ?? draftQuestion.questionCard.imageUrl;
  const handleSaveClick = async  () => {
    if (!imageUrl) {
      return;
    }
    handleImageSave(undefined, imageUrl);
  }

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}> 
          <DragText>Image URL</DragText>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleCloseModal} />
        </Box>
        <TextContainerStyled value={imageUrl} variant="outlined" rows='1' placeholder="Image URL..." onChange={(e)=> handleImageUrlChange(draftQuestion, e.target.value)}/>
        <Fade in={imageUrl !== undefined && imageUrl !== null && imageUrl.length > 0} mountOnEnter unmountOnExit timeout={1000}>
          <Box style={{width: '100%', height: '50%', overflowY: 'auto'}}>
            <img src={debouncedModalImageUrl ?? ''} alt="preview" width="100%" height="100%"/>
          </Box>
        </Fade>
        <CentralButton buttonType={ButtonType.SAVE} onClick={handleSaveClick} isEnabled/>
      </IntegratedContainer>      
    </Fade>
  );
}
