import React from 'react';
import { Box, Paper, Fade, Typography, styled, useTheme } from '@mui/material';
import { CloudFrontDistributionUrl } from '@righton/networking';
import imageUploadIcon from '../../../images/imageUploadIcon.svg';

import imageUploadClose from '../../../images/imageUploadClose.svg';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';
import DropImageUpload from '../../DropImageUpload';
import { ScreenSize, BorderStyle } from '../../../lib/CentralModels';
import { QuestionTitleStyled } from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  ImageURLTextContainerStyled,
  ImageURLUploadButton,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { TGameTemplateProps } from '../../../lib/CreateGameModels';

interface IntegratedContainerProps {
  screenSize: ScreenSize;
}

const IntegratedContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<IntegratedContainerProps>(({ screenSize, theme }) => ({
  position: 'absolute',
  width: 'calc(100% - 48px)',
  maxWidth: '800px',
  flexGrow: 0,
  top: '50%',
  left: '50%',
  transform: 'translateY(-50%) translateX(-50%)',
  background: '#FFF',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  padding: '40px',
  gap: '56px',
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
  zIndex: 1,
}));

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
  backgroundColor: '#F9F9F9',
}));

interface GameImageUploadModalProps {
  screenSize: ScreenSize;
  isClone: boolean;
  isCloneImageChanged: boolean;
  isModalOpen: boolean;
  draftGame: TGameTemplateProps;
  handleImageChange: (inputImage?: File, inputUrl?: string) => void;
  handleImageSave: (image?: File, inputUrl?: string) => void;
  handleCloseModal: () => void;
}

export default function GameImageUploadModal({
  screenSize,
  isClone,
  isCloneImageChanged,
  isModalOpen,
  draftGame,
  handleImageChange,
  handleImageSave,
  handleCloseModal,
}: GameImageUploadModalProps) {
  const theme = useTheme();
  const { imageUrl, image } = draftGame;
  const [localURL, setLocalURL] = React.useState<string | null>(null);
  const [isChangeImage, setIsChangeImage] = React.useState<boolean>(false);

  let imageLink: string | null = null;
  if (imageUrl) {
    imageLink = imageUrl;
    if (isClone && !isCloneImageChanged)
      imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
  } else if (image && image instanceof File)
    imageLink = URL.createObjectURL(image);

  const handleChangeClick = (newImage: File) => {
    setIsChangeImage(false);
    handleImageChange(newImage);
  };

  const handleUrlChange = (newUrl: string) => {
    setIsChangeImage(false);
    handleImageChange(undefined, newUrl);
  };

  const handleClose = () => {
    setIsChangeImage(false);
    handleCloseModal();
  };

  const handleSaveClick = () => {
    if (imageUrl) {
      handleImageSave(undefined, imageUrl);
    } else if (image) {
      handleImageSave(image);
    }
  };

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12} screenSize={screenSize}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <QuestionTitleStyled style={{ fontSize: '27px' }}>
            {image || imageUrl ? 'Image preview' : 'Upload file'}
          </QuestionTitleStyled>
          <CloseButton
            src={imageUploadClose}
            alt="imageUploadClose"
            onClick={handleClose}
          />
        </Box>
        <DashedBox>
          {(image || imageUrl) && !isChangeImage ? (
            <Box
              style={{
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
            <DropImageUpload handleImageSave={handleChangeClick}>
              <UploadIcon src={imageUploadIcon} alt="imageUploadIcon" />
              <DragText>Drag & drop your file here or</DragText>
              <CentralButton
                type="file"
                buttonType={ButtonType.BROWSEFILES}
                isEnabled
                handleFileChange={handleChangeClick}
              />
            </DropImageUpload>
          )}
        </DashedBox>
        {(image || imageUrl) && !isChangeImage ? (
          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: `${theme.sizing.mdPadding}px`,
            }}
          >
            <CentralButton
              buttonType={ButtonType.CHANGEIMAGE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride={
                screenSize === ScreenSize.SMALL ? '100%' : undefined
              }
              onClick={() => setIsChangeImage(true)}
            />
            <CentralButton
              buttonType={ButtonType.SAVE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride={
                screenSize === ScreenSize.SMALL ? '100%' : undefined
              }
              onClick={handleSaveClick}
            />
          </Box>
        ) : (
          <Box style={{ width: '100%', position: 'relative' }}>
            <ImageURLTextContainerStyled
              value={localURL}
              variant="outlined"
              rows="1"
              placeholder="Add Image URL"
              onChange={(e) => setLocalURL(e.target.value)}
            />
            <ImageURLUploadButton
              onClick={() => handleUrlChange(localURL ?? '')}
            >
              Upload
            </ImageURLUploadButton>
          </Box>
        )}
      </IntegratedContainer>
    </Fade>
  );
}
