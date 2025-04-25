import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, TextField, MenuItem, useTheme } from '@mui/material';
import Adpic from "../images/@.svg"
import OwnerCard from '../components/profile/OwnerCard';
import { 
    TextContainerStyled,
  } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { UserProfileGridContainer, UserProfileGridItem, UserProfileMainContainer } from '../lib/styledcomponents/UserProfileStyledComponents';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import { ScreenSize } from '../lib/CentralModels';

const MyProfileText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700, 
    fontSize: '40px', 
    color: '#02215F',
    textAlign: 'center', 
    lineHeight: '40px'
}));

const RightUserNoteContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',

    textAlign: 'center'
}));

const RightUsernameText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600, 
    fontSize: '16px', 
    color: '#000000',
}));

const RightNoteText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    color: '#000000',
  }));  

const InformationText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600, 
    fontSize: '16px', 
    color: '#384466',
    textAlign: 'center', 
}));

const MiddleText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
}));

const MiddleTextFirstRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
  }));

const MiddleTextSecondRow = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gap: '3.5px',
    alignItems: 'stretch',
}));

const TitleField = styled(TextField)(({ theme }) => ({
    border: '2px solid #CCCCCC', 
    borderRadius: '8px', 
    backgroundColor: '#FFFFFF',
    minWidth: '108px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px', // Ensure consistent border radius
    },
    '& .MuiSelect-select': {
      color: '#384466',
    },
    '& .MuiSelect-icon': {
      transition: 'transform 0.2s ease', // Smooth transition for rotation
      marginRight: '10px',
    },
    '&.Mui-focused .MuiSelect-icon': {
      transform: 'rotate(-180deg)', // Rotate upward when focused
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove the default border
    },
  }));

const MiddleTextFourthRow = styled(Typography)(({ theme }) => ({
  display: 'flex',
  color: '#384466', 
  fontFamily: 'Rubik, sans-serif', 
  fontWeight: 400, 
  fontSize: '16px', 
  marginBottom: '-4px'
}));


const UploadImages= styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  justifyContent: 'flex-start'
}));

const UploadImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#02215F', 
  border: '1px solid #000000', 
  borderRadius: '8px',        
  flexDirection: 'column',
  alignItems: 'center',       
  justifyContent: 'center',    
  width: '100%',
  gap: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  boxSizing: 'border-box'
}));

const ImageText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',  
  fontWeight: 400,                  
  fontSize: '16px',                
  color: '#E9F1FF',                 
}));


const ImagePlaceHolder = styled('img')(({ theme }) => ({
  width: '80%', 
  height: 148, 
  borderRadius: 4, 
  border: '2px solid #ccc', 
  objectFit: 'cover'
}));

const EditInformationButtonContainer = styled(Box)(({ theme }) => ({
    width: '168px',
  }));

const ChangePasswordButtonContainer = styled(Box)(({ theme }) => ({
    width: '211px',
}));

const PasswordText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600, 
    fontSize: '16px', 
    color: '#000000',
    textAlign: 'center', 
}));

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

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);
  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);
  
  return (
        <UserProfileMainContainer>
            <MyProfileText>My Profile</MyProfileText>
            <UserProfileGridContainer container wrap="nowrap">
                <Grid
                    sm
                    md={1}
                    lg={4}
                    item
                    style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '16px', gap: '200px'}}
                >
                    <OwnerCard />
                </Grid>
                <UserProfileGridItem
                    item
                    sm={12}
                    md={10}
                    lg={4}
                    screenSize={screenSize}
                    style={{
                        width: '100%',
                        maxWidth: '672px',
                        minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${theme.sizing.smPadding}px`,
                        paddingLeft: `${theme.sizing.lgPadding}px`,
                        paddingRight: `${theme.sizing.lgPadding}px`,
                    }}
                >
                    <RightUserNoteContainer>
                        <RightUsernameText>Username</RightUsernameText>
                        <RightNoteText>( Note: username cannot be edited )</RightNoteText>
                    </RightUserNoteContainer>
                    <MiddleTextSecondRow>
                        <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="Username..."
                            value="clarkinator27"
                        />
                    </MiddleTextSecondRow>
                    <InformationText>Information</InformationText>
                    <MiddleText>
                        <MiddleTextFirstRow>
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
                        </MiddleTextFirstRow>
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="School Email..."
                            value="aclark@realhighschool.edu"
                        />
                        <MiddleTextFourthRow>Teacher ID Image</MiddleTextFourthRow>
                        <UploadImages >
                            <UploadImageContainer>
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
                            </UploadImageContainer>    
                            <UploadImageContainer>
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
                            </UploadImageContainer>
                        </UploadImages>
                    </MiddleText>
                    <EditInformationButtonContainer>
                        <CentralButton buttonType={buttonEditInformation} isEnabled={isEditInformation} smallScreenOverride/>
                    </EditInformationButtonContainer>
                    <PasswordText>
                        Password
                    </PasswordText>
                    <TextContainerStyled
                        variant="outlined"
                        placeholder="Password..."
                        value="********"
                    />
                    <ChangePasswordButtonContainer>
                        <CentralButton buttonType={buttonChangePassword} isEnabled={isChangePassword} smallScreenOverride/>
                    </ChangePasswordButtonContainer>
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

