import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, MenuItem, useTheme, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IUserProfile, CloudFrontDistributionUrl } from '@righton/networking';
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
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';


interface UserProfileProps {
    screenSize: ScreenSize;
}

export default function UserProfile({
    screenSize
}: UserProfileProps) {
  const theme = useTheme();
  const [isEditInformationHighlight, setEditInformationHighlight] = useState(true);
  // const [isSaveInformationHighlight, setSaveInformationHighlight] = useState(false);

  const [isEditInformation, setIsEditInformation] = useState(false);

  const buttonChangePassword = ButtonType.CHANGEPASSWORD;
  const [isChangePassword , setIsChangePassword ] = useState(true);

   // password input field 
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
  

  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const [draftUserProfile, setDraftUserProfile] = useState<IUserProfile>(centralData.userProfile);  
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);
  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);
  
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(true);
  const [isCloneImageChanged, setIsCloneImageChanged] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const [frontImage, setFrontImage] = useState<File | null>(null); 
  const [backImage, setBackImage] = useState<File | null>(null); 

  useEffect(() => {
    if (centralData.userProfile) {
        setDraftUserProfile(centralData.userProfile)
      }

  }, [centralData.userProfile]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleEditPicture = () => {
    setIsModalOpen(true);
  };

  const handleEditInformation = () => {
    setIsEditInformation(true);
    setEditInformationHighlight(false)
  }

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  }

  const handleImageSave = async (image?: File, inputUrl?: string) => {
    setIsModalOpen(false);
    try{
        const response = await apiClients.centralDataManager?.userProfileImageUpdate(draftUserProfile, newProfilePic);
        if (response?.updatedUser){
            centralDataDispatch({type: 'SET_USER_PROFILE', payload: response.updatedUser});
        } 
    } catch(error){
        console.error(error);
    }

  }

  const handleImageChange = async (inputImage?: File | null, inputUrl?: string) => {
    setIsCloneImageChanged(true);
    if (inputImage) {
        setNewProfilePic(inputImage);
        setDraftUserProfile(prev => ({
            ...prev,
            profilePicPath: '',
        }))
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
  }


    const handleGetStarted = async () => {
      setEditInformationHighlight(true)
      setIsEditInformation(false)
      try {
        const updatedUser = { ...draftUserProfile };
        const response = await apiClients.centralDataManager?.userProfileInformationUpdate(updatedUser, centralData.userProfile, frontImage ?? null, backImage ?? null);
        if (response?.updatedUser){
            centralDataDispatch({type: 'SET_USER_PROFILE', payload: response.updatedUser});
        } 
      } catch (error) {
        console.error(error);
      }
    };
    
    const renderFrontImageSection = () => {
        if (frontImage) {
          return (
            <ImagePlaceHolder
              src={URL.createObjectURL(frontImage)}
              alt="Uploaded Preview"
            />
          );
        }
      
        if (draftUserProfile.frontIdPath) {
          return (
            <ImagePlaceHolder
              src={`${CloudFrontDistributionUrl}${draftUserProfile.frontIdPath}`}
              alt="Uploaded Preview"
            />
          );
        }
        return (
          <CentralButton
            buttonType={buttonTypeUpload}
            isEnabled={isUploadFrontEnabled}
            buttonWidthOverride='38px'
            iconOnlyOverride
            onClick={async () => {
              const uploadInput = document.getElementById('front-upload') as HTMLInputElement;
              uploadInput?.click();
      
              uploadInput.onchange = async (e: Event) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  const file = target.files[0];
                  setFrontImage(file);
                }
              };
            }}
          />
        );
      };

      const renderBackImageSection = () => {
        if (backImage) {
          return (
            <ImagePlaceHolder
              src={URL.createObjectURL(backImage)}
              alt="Uploaded Preview"
            />
          );
        }
      
        if (draftUserProfile.backIdPath) {
          return (
            <ImagePlaceHolder
              src={`${CloudFrontDistributionUrl}${draftUserProfile.backIdPath}`}
              alt="Uploaded Preview"
            />
          );
        }
      
        return (
          <CentralButton
            buttonType={buttonTypeUpload}
            isEnabled={isUploadBackEnabled}
            buttonWidthOverride="38px"
            iconOnlyOverride
            onClick={async () => {
              const uploadInput = document.getElementById('back-upload') as HTMLInputElement;
              uploadInput?.click();
      
              uploadInput.onchange = async (e: Event) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  const file = target.files[0];
                  setBackImage(file);
                }
              };
            }}
          />
        );
      };
      

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
                        <BodyText>( Note: email cannot be edited )</BodyText>
                    </UsernameTextContainer>
                    <UsernameInputContainer>
                        <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="Username..."
                            value={draftUserProfile.userName}
                            onChange={(event) => 
                                setDraftUserProfile({
                                    ...draftUserProfile, 
                                    userName: event.target.value  
                                  })
                              }
                            disabled={!isEditInformation}
                        />
                    </UsernameInputContainer>
                    <SubHeadingText>Information</SubHeadingText>
                    <UserInfoContainer>
                        <UserInfoItemContainer>
                            <TitleField
                                select
                                value={draftUserProfile.title}
                                onChange={(event) => 
                                    setDraftUserProfile({
                                      ...draftUserProfile, 
                                      title: event.target.value  
                                    })
                                  }
                                disabled={!isEditInformation}  
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
                                value={draftUserProfile.firstName}
                                onChange={(event) => 
                                    setDraftUserProfile({
                                        ...draftUserProfile, 
                                        firstName: event.target.value  
                                      })
                                  }
                                disabled={!isEditInformation}                        
                            />
                            <TextContainerStyled
                                variant="outlined"
                                placeholder="Last Name"
                                value={draftUserProfile.lastName}
                                onChange={(event) => 
                                    setDraftUserProfile({
                                        ...draftUserProfile, 
                                        lastName: event.target.value  
                                      })
                                  }
                                disabled={!isEditInformation}
                            />
                        </UserInfoItemContainer>
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="School Email..."
                            value={draftUserProfile.email}
                            disabled
                        />
                        <SubHeadingTextLight>Teacher ID Image</SubHeadingTextLight>
                        <UploadImagesContainer>
                            <ImageContainer
                                onClick={() => {
                                    if (frontImage || draftUserProfile.frontIdPath) {
                                    const uploadInput = document.getElementById('front-upload') as HTMLInputElement;
                                    uploadInput?.click(); // Trigger file selection
                                    }
                                }}
                                style={{ cursor: frontImage || draftUserProfile.frontIdPath ? 'pointer' : 'default' }}
                            >
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
                                    disabled={!isEditInformation}
                                />
                                {renderFrontImageSection()}    
                            </ImageContainer>    
                            <ImageContainer
                                onClick={() => {
                                    if (backImage || draftUserProfile.backIdPath) {
                                    const uploadInput = document.getElementById('back-upload') as HTMLInputElement;
                                    uploadInput?.click(); // Trigger file selection
                                    }
                                }}
                                style={{ cursor: backImage || draftUserProfile.backIdPath ? 'pointer' : 'default' }}
                            >
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
                                    disabled={!isEditInformation}
                                />
                                {renderBackImageSection()}
                            </ImageContainer>
                        </UploadImagesContainer>
                    </UserInfoContainer>
                   {isEditInformationHighlight ? 
                   <CentralButton buttonType={ButtonType.EDITINFORMATION} isEnabled smallScreenOverride onClick={handleEditInformation}/>
                    : <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride onClick={handleGetStarted}/>}

                    <SubHeadingText>
                        Password
                    </SubHeadingText>
                    <TextContainerStyled
                        variant="outlined"
                        placeholder="Password..."
                        type={isShowPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={
                                  isShowPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                              >
                                {isShowPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                    />
                    <CentralButton buttonType={ButtonType.CHANGEPASSWORD} isEnabled smallScreenOverride/>
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

