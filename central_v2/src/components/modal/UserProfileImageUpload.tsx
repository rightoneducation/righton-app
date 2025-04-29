import React from 'react';
import { Box, Paper, Fade, Typography, styled, useTheme, Avatar } from '@mui/material';
import { CentralQuestionTemplateInput, CloudFrontDistributionUrl } from '@righton/networking';
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
import Avatar1 from "../../images/Avatar1.svg";
import Avatar2 from "../../images/Avatar2.svg";
import Avatar3 from "../../images/Avatar3.svg";
import Avatar4 from "../../images/Avatar4.svg";
import Avatar5 from "../../images/Avatar5.svg";
import Avatar6 from "../../images/Avatar6.svg";

interface IntegratedContainerProps {
  screenSize: ScreenSize
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
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  padding: '40px',
  gap: '24px'
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

const OrText = styled(Typography)(({ theme }) => ({
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

const AvatarAndTextContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '750px',
    // border: '1px solid red',
    paddingTop: '16px',
    paddingBottom: '16px',
    boxSizing: 'border-box',
}));
  
const ChooseAvatarText = styled(Typography)(({ theme }) => ({
    fontSize: '24px',
    lineHeight: '24px',
    fontWeight: 700,
    textAlign: 'center'
}));


const AvatarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '31px',
    width: '750px',
    background: 'linear-gradient(180deg, #0D68B1 0%, #02215F 100% )', 
    paddingTop: '42px',
    paddingBottom: '42px',
    justifyContent: 'center',
    borderRadius: '16px',
    height: '174px',
    boxSizing: 'border-box',
    alignItems: 'center'
}));
  

const AvatarImage = styled('img')<{ selected?: boolean }>(({ selected }) => ({
    width: '90px',
    height: '90px',
    cursor: 'pointer',
    // transform: selected ? 'scale(1.1)' : 'scale(1)',
    border: selected ? '8px solid #FFF' : 'none',
    borderRadius: '50%',
    background: selected ? 'linear-gradient(135deg, #EFEFEF, #C2BEBE)' : 'none',
    // objectFit: 'cover', 
  }));
  

const SelectedText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Rubik, sans-serif',  
    fontWeight: 400,
    fontSize: '14px',  
    textAlign: 'center',  
    color: '#FFFFFF', 
    marginTop: '8px', 
  }));

const AvatarAndImageSelectedContainer = styled(Box)(({ theme }) => ({
    boxSizing: 'border-box',
}));

interface UserProfileImageUploadProps {
  screenSize: ScreenSize;
//   isClone: boolean;
//   isCloneImageChanged: boolean;
  isModalOpen: boolean;
  userPic: {
    image: File | null;
    imageUrl: string | null;
  };
  handleImageChange: (inputImage?: File, inputUrl?: string) => void;
//   handleImageSave: (image?: File, inputUrl?: string) => void;
  handleCloseModal: () => void;
}

export default function UserProfileImageUpload({
  screenSize,
//   isClone,
//   isCloneImageChanged,
  isModalOpen,
  userPic,
  handleImageChange,
  handleCloseModal,
}: UserProfileImageUploadProps) {
  const theme = useTheme();
  const { imageUrl } = userPic;
  const { image } = userPic;
  const [isChangeImage, setIsChangeImage] = React.useState<boolean>(false);
  
  let imageLink: string | null = null;
  if (imageUrl){
    imageLink = imageUrl;
    imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
  } else if (image && image instanceof File)
        imageLink = URL.createObjectURL(image);
  //   if (imageUrl)
//     imageLink = imageUrl;
//       if (isClone && !isCloneImageChanged)
//         imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
//   else if (image && image instanceof File)
//     imageLink = URL.createObjectURL(image);

  const handleChangeClick = (newImage: File) => {
    setIsChangeImage(false);
    handleImageChange(newImage);
  }
  
  const handleClose = () => {
    setIsChangeImage(false);
    handleCloseModal();
  }


  const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(null);

  const avatars = [
    { src: Avatar1, name: 'Avatar 1' },
    { src: Avatar2, name: 'Avatar 2' },
    { src: Avatar3, name: 'Avatar 3' },
    { src: Avatar4, name: 'Avatar 4' },
    { src: Avatar5, name: 'Avatar 5' },
    { src: Avatar6, name: 'Avatar 6' },
  ];

  const handleAvatarClick = (name: string) => {
    setSelectedAvatar(name);
  };


  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12} screenSize={screenSize}>
        <Box style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <CloseButton src={imageUploadClose} alt="imageUploadClose" onClick={handleClose} />
        </Box>
        <QuestionTitleStyled style={{fontSize: '27px'}}>
            { image || imageUrl
              ? 'Image preview'
              : 'Choose your own picture!'
            }
        </QuestionTitleStyled>
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
              <DragText>Drag and drop your file here</DragText>
              <OrText>Or</OrText>
              <CentralButton type="file" buttonType={ButtonType.BROWSEFILES} isEnabled handleFileChange={handleChangeClick} />
            </DropImageUpload> 
          )}
        </DashedBox>
        <AvatarAndTextContainer>
            <ChooseAvatarText>Or you can choose one of the mosters below.</ChooseAvatarText>
                <AvatarContainer>
                    {avatars.map((avatar) => (
                     <AvatarAndImageSelectedContainer key={avatar.name}>
                        <AvatarImage
                            key={avatar.name}  // Use 'name' or 'src' as the unique key
                            src={avatar.src}
                            alt={avatar.name}
                            selected={selectedAvatar === avatar.name}
                            onClick={() => handleAvatarClick(avatar.name)}
                        />
                        {selectedAvatar === avatar.name && (
                            <SelectedText>
                            Currently selected
                            </SelectedText>
                        )}
                     </AvatarAndImageSelectedContainer>
                    ))}
                </AvatarContainer>
        </AvatarAndTextContainer>
      </IntegratedContainer>      
    </Fade>
  );
}
