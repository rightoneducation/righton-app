import React from 'react';
import { Box, Paper, Fade, Typography, styled, useTheme } from '@mui/material';
import { CentralQuestionTemplateInput } from '@righton/networking';
import imageUploadIcon from '../../images/imageUploadIcon.svg';
import imageUploadClose from '../../images/imageUploadClose.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DropImageUpload from '../DropImageUpload';
import { ScreenSize, BorderStyle } from '../../lib/CentralModels';
import {
  QuestionTitleStyled,
} from '../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { 
  ImageURLTextContainerStyled,
  ImageURLUploadButton
} from '../../lib/styledcomponents/CreateQuestionStyledComponents';

interface IntegratedContainerProps {
  screenSize: ScreenSize
}

const IntegratedContainer = styled(Paper)<IntegratedContainerProps>(({ screenSize, theme }) => ({
  position: 'absolute',
  width: 'calc(100% - 48px)',
  maxWidth: '800px',
  flexGrow: 0,
  top: '50%',
  left: '50%',
  transform: 'translateY(-50%) translateX(-50%)',
  background: '#FFF',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  padding: '40px',
  gap: '56px'
}));

const UploadIcon = styled('img')(({ theme }) => ({
  width: '60px',
  height: '60px',
}));

const DragText = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  lineHeight: '24px',
  fontWeight: 700,
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  zIndex: 1
}))

const DashedBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%', 
  height: '278px',
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderRadius: '8px',
  boxSizing: 'border-box',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#F9F9F9'
}));

interface ImageUploadModalProps {
  screenSize: ScreenSize;
  isModalOpen: boolean;
  modalImage: File | null;
  draftQuestion: CentralQuestionTemplateInput;
  modalImageUrl: string | null;
  debouncedModalImageUrl: string | null;
  handleImageUrlChange: (debouncedQuestion: CentralQuestionTemplateInput, url: string) => void;
  handleImageChange: (file: File) => void;
  handleImageSave: (file: File) => void;
  handleCloseModal: () => void;
  borderStyle: BorderStyle;
}

export default function ImageUploadModal({
  screenSize,
  isModalOpen,
  modalImage,
  draftQuestion,
  modalImageUrl,
  debouncedModalImageUrl,
  handleImageUrlChange,
  handleImageChange,
  handleImageSave,
  handleCloseModal,
  borderStyle
}: ImageUploadModalProps) {
  const theme = useTheme();
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false);
  const imageUrl = modalImageUrl ?? draftQuestion.questionCard.imageUrl;
  const { image } = draftQuestion.questionCard;
  let imageLink: string | null = null;
  if (modalImage && modalImage instanceof File)
    imageLink = URL.createObjectURL(modalImage);
   else if (image && image instanceof File)
     imageLink = URL.createObjectURL(image);

  const handleChangeClick = (newImage: File) => {
    handleImageChange(newImage);
  }

  const handleSaveClick = () => {
    if (modalImage) {
      handleImageSave(modalImage);
    } else if (image) {
      handleImageSave(image);
    }
  } 

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12} screenSize={screenSize}>
        <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <QuestionTitleStyled style={{fontSize: '27px'}}>
            Upload Image
          </QuestionTitleStyled>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleCloseModal} />
        </Box>
        <DashedBox>
          {(imageLink) ? (
            <Box style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            >
              <Box 
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  width: '100%',
                  backgroundColor: isMouseOver ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0)',
                  transition: 'background-color 0.75s',
                }} 
              />
              <Fade in={isMouseOver} mountOnEnter unmountOnExit timeout={750} >
                <Box style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                }}>
                  <CentralButton type="file" buttonType={ButtonType.BROWSEFILES} isEnabled handleFileChange={handleChangeClick} />
                </Box>
              </Fade>
              <img
                src={imageLink} 
                alt="Uploaded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ) : (
            <DropImageUpload handleImageSave={handleChangeClick} >
              <UploadIcon src={imageUploadIcon} alt="imageUploadIcon" />
              <DragText>Drag & drop your file here or</DragText>
              <CentralButton type="file" buttonType={ButtonType.BROWSEFILES} isEnabled handleFileChange={handleChangeClick} />
            </DropImageUpload>   
          )}
        </DashedBox>
        <Box style={{width: '100%', position: 'relative'}}>
        <ImageURLTextContainerStyled value={imageUrl} variant="outlined" rows='1' placeholder="Add Image URL" onChange={(e)=> handleImageUrlChange(draftQuestion, e.target.value)}/>
        <ImageURLUploadButton>
          Upload
        </ImageURLUploadButton>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
