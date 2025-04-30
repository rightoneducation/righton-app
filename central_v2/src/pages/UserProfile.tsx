import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, MenuItem, useTheme } from '@mui/material';
import { IUserProfile } from '@righton/networking';
import Adpic from "../images/@.svg"
import OwnerCard from '../components/profile/OwnerCard';
import UserProfileImageUploadModal from '../components/modal/UserProfileImageUploadModal';
import ModalBackground from '../components/modal/ModalBackground';
import { 
    TextContainerStyled,
  } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import {
    UserProfileGridContainer,
    UserProfileGridItem,
    UserProfileMainContainer,
    TitleText,
    UsernameTextContainer,
    SubHeadingText,
    BodyText,
    SubHeadingTextLight,
    UserInfoContainer,
    UserInfoItemContainer,
    ImageContainer,
    ImagePlaceHolder,
    ImageText,
    UploadImagesContainer,
    UsernameInputContainer,
    TitleField
} from '../lib/styledcomponents/UserProfileStyledComponents';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import { ScreenSize } from '../lib/CentralModels';

interface UserProfileProps {
    screenSize: ScreenSize;
}

export default function UserProfile({
    screenSize
}: UserProfileProps) {
  const theme = useTheme();
  const buttonEditInformation = ButtonType.EDITINFORMATION;
  const [isEditInformation, setIsEditInformation] = useState(true);

  const buttonChangePassword = ButtonType.CHANGEPASSWORD;
  const [isChangePassword , setIsChangePassword ] = useState(true);

  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const [draftUserProfile, setDraftUserProfile] = useState<IUserProfile>(centralData.userProfile);  
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);
  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);
  
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(true);
  const [isCloneImageChanged, setIsCloneImageChanged] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [userPic, setUserPic] = useState<{ image: File | null; imageUrl: string | null }>({
    image: null,
    imageUrl: null,
  });

  const handleEditPicture = () => {
    setIsModalOpen(true);
  };

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  }

  const handleImageSave = async (image?: File, inputUrl?: string) => {
    setIsModalOpen(false);
    // if (image) {
    //     setNewProfilePic(image);
    // } else if (inputUrl) {
    //     setDraftUserProfile(prev => ({
    //         ...prev,
    //         profilePicPath: inputUrl,
    //       }))
    // }
  }

  const handleImageChange = async (inputImage?: File | null, inputUrl?: string) => {
    setIsCloneImageChanged(true);
    if (inputImage) {
        setNewProfilePic(inputImage);
    } else if (inputUrl) {
        setNewProfilePic(null);
        setDraftUserProfile(prev => ({
            ...prev,
            profilePicPath: inputUrl,
        }))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setIsImageURLVisible(false);
    // setIsCreatingTemplate(false);
    // setIsCCSSVisible(false);
  }

  return (
        <UserProfileMainContainer>
             <UserProfileImageUploadModal 
                screenSize={screenSize}
                draftUserProfile={draftUserProfile}
                newProfilePic={newProfilePic}
                isModalOpen={isModalOpen} 
                handleImageChange={handleImageChange}
                handleImageSave={handleImageSave} 
                handleCloseModal={handleCloseModal}
            />
            <ModalBackground isModalOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)}/>
            <TitleText>My Profile</TitleText>
            <UserProfileGridContainer container wrap="nowrap">
                <Grid
                    sm
                    md={1}
                    lg={4}
                    item
                    style={{display: 'flex', justifyContent: 'flex-end'}}
                >
                    { screenSize === ScreenSize.LARGE && (
                        <Box style={{paddingLeft: `${theme.sizing.lgPadding}px`}}>
                            <OwnerCard 
                              screenSize={screenSize} 
                              draftUserProfile={draftUserProfile}
                              newProfilePic={newProfilePic}
                              handleEditPicture={handleEditPicture}
                            />
                        </Box>
                    )}
                </Grid>
                <UserProfileGridItem
                    item
                    sm={12}
                    md={4}
                    lg={4}
                    screenSize={screenSize}
                    style={{
                        width: '100%',
                        maxWidth: '672px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${theme.sizing.smPadding}px`,
                        paddingLeft: `${theme.sizing.lgPadding}px`,
                        paddingRight: `${theme.sizing.lgPadding}px`,
                    }}
                >
                    {screenSize !== ScreenSize.LARGE && (
                          <OwnerCard 
                            screenSize={screenSize} 
                            draftUserProfile={draftUserProfile}
                            newProfilePic={newProfilePic}
                            handleEditPicture={handleEditPicture}
                          />
                    )}
                    <UsernameTextContainer>
                        <SubHeadingText>Username</SubHeadingText>
                        <BodyText>( Note: username cannot be edited )</BodyText>
                    </UsernameTextContainer>
                    <UsernameInputContainer>
                        <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="Username..."
                            value="clarkinator27"
                        />
                    </UsernameInputContainer>
                    <SubHeadingText>Information</SubHeadingText>
                    <UserInfoContainer>
                        <UserInfoItemContainer>
                            <TitleField
                                select
                                value="Ms."
                            >
                                <MenuItem value="Title...">Title...</MenuItem>
                                <MenuItem value="Mr.">Mr.</MenuItem>
                                <MenuItem value="Mrs.">Mrs.</MenuItem>
                                <MenuItem value="Ms.">Ms.</MenuItem>
                                <MenuItem value="Dr.">Dr.</MenuItem>
                            </TitleField>
                            <TextContainerStyled
                                variant="outlined"
                                placeholder="First Name"
                                value="Abigail"                        
                            />
                            <TextContainerStyled
                                variant="outlined"
                                placeholder="Last Name"
                                value="Clark"
                            />
                        </UserInfoItemContainer>
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="School Email..."
                            value="aclark@realhighschool.edu"
                        />
                        <SubHeadingTextLight>Teacher ID Image</SubHeadingTextLight>
                        <UploadImagesContainer>
                            <ImageContainer>
                                <ImageText>Front</ImageText>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="front-upload"
                                    onChange={(e) => {
                                    if (e.target.files) {
                                        setFrontImage(e.target.files[0]); // Store the selected image
                                    }
                                    }}
                                />
                                { frontImage  ? 
                                    ( 
                                        <ImagePlaceHolder
                                            src={URL.createObjectURL(frontImage)}
                                            alt="Uploaded Preview"
                                            />
                                        ) : (
                                        <CentralButton
                                            buttonType={buttonTypeUpload}
                                            isEnabled={isUploadFrontEnabled}
                                            buttonWidthOverride='38px'
                                            iconOnlyOverride
                                            onClick={ async () => {
                                                const uploadInput = document.getElementById('front-upload') as HTMLInputElement;
                                                uploadInput?.click(); // Trigger file selection
                            
                                                // Wait for the user to select the file
                                                uploadInput.onchange = async (e: Event) => {
                                                    const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                                                    if (target.files) {
                                                    const file = target.files[0]; // Access the selected file
                                                    setFrontImage(file); // Store file locally
                                                    }
                                                };
                                            }}
                                        />
                                    )
                                }            
                            </ImageContainer>    
                            <ImageContainer>
                                <ImageText>Back</ImageText>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="back-upload"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setBackImage(e.target.files[0]); // Store the selected image
                                        }
                                    }}
                                />
                                {backImage 
                                ? ( <ImagePlaceHolder
                                src={URL.createObjectURL(backImage)}
                                alt="Uploaded Preview"
                                />)
                                : (<CentralButton 
                                    buttonType={buttonTypeUpload} 
                                    isEnabled={isUploadBackEnabled} 
                                    buttonWidthOverride='38px'
                                    iconOnlyOverride
                                    onClick={async () => {
                                    const uploadInput = document.getElementById('back-upload') as HTMLInputElement;
                                    uploadInput?.click(); // Trigger file selection
                
                                    // Wait for the user to select the file
                                    uploadInput.onchange = async (e: Event) => {
                                        const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                                        if (target.files) {
                                        const file = target.files[0]; // Access the selected file
                                        setBackImage(file); // Store file locally
                                        }
                                    };
                                    }}
                
                                />)
                                }
                            </ImageContainer>
                        </UploadImagesContainer>
                    </UserInfoContainer>
                   <CentralButton buttonType={ButtonType.EDITINFORMATION} isEnabled smallScreenOverride/>
                    <SubHeadingText>
                        Password
                    </SubHeadingText>
                    <TextContainerStyled
                        variant="outlined"
                        placeholder="Password..."
                        value="********"
                    />
                    <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride/>
                </UserProfileGridItem>
                <Grid  
                    sm
                    md={1}
                    lg={4} 
                    item 
                />
            </UserProfileGridContainer>
        </UserProfileMainContainer>
  )
}

