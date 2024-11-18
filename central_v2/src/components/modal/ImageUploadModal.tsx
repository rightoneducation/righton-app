import React from 'react';
import { Box, Paper, Fade, Typography, styled } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import imageUploadIcon from '../../images/imageUploadIcon.svg';
import imageUploadClose from '../../images/imageUploadClose.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DropImageUpload from '../DropImageUpload';
import { ScreenSize, BorderStyle } from '../../lib/CentralModels';

interface IntegratedContainerProps {
  screenSize: ScreenSize
}

const IntegratedContainer = styled(Paper)<IntegratedContainerProps>(({ screenSize, theme }) => ({
  position: 'absolute',
  width: 'calc(100% - 48px)',
  maxWidth: '800px',
  flexGrow: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  background: '#FFF',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  paddingTop: screenSize === ScreenSize.SMALL ? '48px' : '114px',
  paddingLeft: screenSize === ScreenSize.SMALL ? '48px' : '150px',
  paddingRight: screenSize === ScreenSize.SMALL ? '48px' : '150px',
  paddingBottom: screenSize === ScreenSize.SMALL ? '12px' : '60px',
  gap: screenSize === ScreenSize.SMALL ? '12px' : '48px'
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
  position: 'absolute',
  top: '16px',
  right: '16px',
  cursor: 'pointer',
  zIndex: 1
}))

const DashedBorderSVG = styled('svg')(({ theme }) => ({
  position: 'relative',
  width: '100%', 
  height: '278px',
  boxSizing: 'border-box',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px', // Matches the container's border-radius
  pointerEvents: 'none', // Allows clicks through the SVG
  zIndex: 6, // Positioned behind the content
}));

const StyledDiv = styled('div')(({ theme }) => ({
  position: 'relative',
  margin: '20px auto',
  width: '20%',
  backgroundColor: 'white',
  border: '2px solid black',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    border: '2px solid #fff',
    height: '100%',
    width: '100%',
    borderRadius: '10%',
    pointerEvents: 'none',
  },
}));

interface ImageUploadModalProps {
  screenSize: ScreenSize;
  isModalOpen: boolean;
  handleImageSave: (file: File) => void;
  handleCloseModal: () => void;
  borderStyle: BorderStyle;
}

export default function ImageUploadModal({
  screenSize,
  isModalOpen,
  handleImageSave,
  handleCloseModal,
  borderStyle
}: ImageUploadModalProps) {
  const [image, setImage] = React.useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false);

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

  const modalContents = [
    image ? (
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
            <CentralButton type="file" buttonType={ButtonType.CHANGEIMAGE} isEnabled handleFileChange={handleImageChange} />
          </Box>
        </Fade>
        <img
          src={URL.createObjectURL(image)}
          alt="Uploaded"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
      
        />
      </Box>
    ) : (
      <DropImageUpload handleImageSave={handleImageChange} >
        <UploadIcon src={imageUploadIcon} alt="imageUploadIcon" />
        <DragText>Drag & Drop File here</DragText>
        <DragText style={{ fontSize: '20px' }}>or</DragText>
        <CentralButton
          type="file"
          buttonType={ButtonType.UPLOAD}
          isEnabled
          handleFileChange={handleImageChange}
        />
      </DropImageUpload>   
    )
  ];
  
  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12} screenSize={screenSize}>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleCloseModal} />
            {borderStyle === BorderStyle.CORNER_BORDER &&
              <StyledDiv style={{
                position: 'relative',
                width: '100%', 
                height: '278px',
                boxSizing: 'border-box',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              >
                {modalContents}
              </StyledDiv>
            }
            {(borderStyle === BorderStyle.DASHED_BORDER || borderStyle === BorderStyle.SOLID_BORDER) &&
              <Box style={{     
                position: 'relative',
                width: '100%', 
                height: '278px',
                borderStyle: borderStyle === BorderStyle.DASHED_BORDER ? 'dashed' : 'solid',
                borderWidth: borderStyle === BorderStyle.DASHED_BORDER ? '2px' : '1px',
                boxSizing: 'border-box',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              >
               {modalContents}
              </Box>
            }
            {borderStyle === BorderStyle.SVG &&
            <Box style={{width: '100%', height: '100%', position: 'relative'}}>
                <DashedBorderSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect
                    x="2.5" 
                    y="2.5"
                    width="95" 
                    height="95"
                    fill="none"
                    stroke="#333"
                    strokeWidth="5"
                    strokeDasharray="25 25"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </DashedBorderSVG>
                <Box style={{position: 'absolute', paddingTop: '50px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 6, width: '100%', height: '100%'}}>
                {modalContents}
                </Box>
              </Box>
            }
          <CentralButton buttonType={ButtonType.SAVE} isEnabled={!!image} onClick={handleSaveClick} />
      </IntegratedContainer>      
    </Fade>
  );
}
