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
  draftQuestion: CentralQuestionTemplateInput;
  handleImageChange: (inputImage?: File, inputUrl?: string) => void;
  handleImageSave: (image?: File, inputUrl?: string) => void;
  handleCloseModal: () => void;
}

export default function ImageUploadModal({
  screenSize,
  isModalOpen,
  draftQuestion,
  handleImageChange,
  handleImageSave,
  handleCloseModal,
}: ImageUploadModalProps) {
  const theme = useTheme();
  const { imageUrl } = draftQuestion.questionCard;
  const { image } = draftQuestion.questionCard;
  const [localURL, setLocalURL] = React.useState<string | null>(null);
  const [isChangeImage, setIsChangeImage] = React.useState<boolean>(false);
  
  let imageLink: string | null = null;
  if (imageUrl)
    imageLink = imageUrl;
  else if (image && image instanceof File)
    imageLink = URL.createObjectURL(image);

  const handleChangeClick = (newImage: File) => {
    setIsChangeImage(false);
    handleImageChange(newImage);
  }

  const handleUrlChange = (newUrl: string) => {
    setIsChangeImage(false);
    handleImageChange(undefined, newUrl);
  }

  const handleClose = () => {
    setIsChangeImage(false);
    handleCloseModal();
  }

  const handleSaveClick = () => {
    if (imageUrl) {
      handleImageSave(undefined, imageUrl);
    } else if (image) {
      handleImageSave(image);
    } 
  } 

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12} screenSize={screenSize}>
        <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <QuestionTitleStyled style={{fontSize: '27px'}}>
            { image || imageUrl
              ? 'Image preview'
              : 'Upload file'
            }
          </QuestionTitleStyled>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleClose} />
        </Box>
        <DashedBox>
          {((image || imageUrl) && !isChangeImage) ? (
            <Box style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
            >
              <img
                src={imageLink ?? ''} 
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
        {((image || imageUrl) && !isChangeImage)
          ? <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${theme.sizing.mdPadding}px`}}>
              <CentralButton 
                buttonType={ButtonType.CHANGEIMAGE} 
                isEnabled 
                smallScreenOverride 
                onClick={() => setIsChangeImage(true)}
              />
              <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride  onClick={handleSaveClick}/>
            </Box>
          : <Box style={{width: '100%', position: 'relative'}}>
              <ImageURLTextContainerStyled value={imageUrl} variant="outlined" rows='1' placeholder="Add Image URL" onChange={(e)=> setLocalURL(e.target.value)}/>
              <ImageURLUploadButton onClick={() => handleUrlChange(localURL ?? '')}>
                Upload
              </ImageURLUploadButton>
            </Box>
        }
      </IntegratedContainer>      
    </Fade>
  );
}
