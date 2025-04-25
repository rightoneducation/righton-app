import React, { useState } from 'react'
import { useTheme, styled} from '@mui/material/styles';
import {Box, Typography, Select, TextField, MenuItem, InputAdornment, List, ListItem, ListItemText, Button,} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { APIClients, IAPIClients, IUserProfile } from '@righton/networking';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import RightOnLogo from "../images/RightOnUserLogo.svg";
import Adpic from "../images/@.svg"

import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { ReactComponent as DropDown} from "../images/dropDownArrow.svg"
import { 
    TextContainerStyled,
  } from '../lib/styledcomponents/CreateQuestionStyledComponents';

import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import { UserStatusType } from '../lib/CentralModels';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingTop: '24px',
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingBottom: '172px',
    gap: '24px',
    height: 'fit-content'
  }));


const MyProfileText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700, 
    fontSize: '40px', 
    color: '#02215F',
    textAlign: 'center', 
    lineHeight: '40px'
}));

const MiddleContentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '16px',
    height: 'fit-content'
}));

const LeftProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    background: '#02215F',
    paddingTop: '26px',
    boxSizing: 'border-box',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '16px',
    alignItems: 'center',
    height: '890px',      // <----- HARD CODED LEFT CONTAINER
}));
const LeftProfileTopContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '191px',
    alignItems: 'center',
}));

const LeftNameText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold', 
    fontSize: '40px', 
    color: '#FFFFFF',
    textAlign: 'center', 
    width: '100%',
}));

const AtUserNameContainerAndAccount = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '139px',
    gap: '8px',
    alignItems: 'center'
}));

const AtUserNameContainer = styled(Box)(({ theme }) => ({
    width: '100%',
}));

const AtUserNameText = styled(Typography)(({ theme }) => ({
    background: '#7E1E81',
    color: '#FFFFFF',
    textAlign: 'center',
    borderRadius: '20px',
    paddingTop: '4px',
    paddingBottom: '4px',
}));

const LeftAccountCreatedContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const LeftAccountCreatedInfo = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 400, 
    fontSize: '14px', 
    color: '#FFFFFF',
}));
const LeftDateText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 400, 
    fontSize: '12px', 
    color: '#FFFFFF',
}));

const LeftBottomContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '8px'
}));

const LeftBottomGamesQuestionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '8px'
}));

const LeftBottomGamesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    background: 'rgba(255, 255, 255, 0.09)', // light transparent background
    backdropFilter: 'blur(5.4px)',
    borderRadius: '8px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '8px',
    paddingBottom: '13px',
    boxSizing: 'border-box',
    width: "100%"
}));

const LeftBottomGamesText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 400, 
    fontSize: '12px', 
    color: '#CCCCCC',
    minWidth: '149px'
}));

const LeftBottomGamesNumber = styled(Typography)(({ theme }) => ({
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 400, 
    fontSize: '35.76px', 
    color: '#FFFFFF',
    lineHeight: '100%'
}));

const RightProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    paddingLeft: '32px',
    paddingTop: '36px',
    paddingRight: '564px'
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
  gap: '12px'
}));

const MiddleTextFirstRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
  }));

const MiddleTextSecondRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '3.5px',
    alignItems: 'stretch'
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

export default function UserProfile() {
  const buttonTypeNext = ButtonType.NEXTSTEP;
  const [isNextEnabled, setIsNextEnabled] = useState(true);

  const buttonEditPicture = ButtonType.EDITPICTURE;
  const [isEditPicture, setIsEditPicture] = useState(true);

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
        <InnerBodyContainer>
            <MyProfileText>My Profile</MyProfileText>
            <MiddleContentContainer>
                <LeftProfileContainer>
                    <LeftProfileTopContainer>
                        <LeftNameText>
                            Ms. Clark
                        </LeftNameText>
                        <img src={RightOnLogo} alt="Right On Logo" style={{ width: '165px', height: '165px' }} />
                        <AtUserNameContainerAndAccount>
                            <AtUserNameContainer >
                                <AtUserNameText>
                                    @clarkinator27
                                </AtUserNameText>
                            </AtUserNameContainer>
                            <LeftAccountCreatedContainer>
                                <LeftAccountCreatedInfo>
                                    Account Created
                                </LeftAccountCreatedInfo>
                                <LeftDateText>
                                    11/18/2023
                                </LeftDateText>
                            </LeftAccountCreatedContainer>
                        </AtUserNameContainerAndAccount>
                    </LeftProfileTopContainer>
                    
                    <LeftBottomContainer>
                        <LeftBottomGamesQuestionContainer>
                            <LeftBottomGamesContainer>
                                <LeftBottomGamesText>
                                    Games Made
                                </LeftBottomGamesText>
                                <LeftBottomGamesNumber>
                                    16
                                </LeftBottomGamesNumber>
                            </LeftBottomGamesContainer>
                            <LeftBottomGamesContainer>
                                <LeftBottomGamesText>
                                    Question Made
                                </LeftBottomGamesText>
                                <LeftBottomGamesNumber>
                                    120
                                </LeftBottomGamesNumber>
                            </LeftBottomGamesContainer>
                        </LeftBottomGamesQuestionContainer>
                        <LeftBottomGamesContainer>
                                <LeftBottomGamesText>
                                    Games Used
                                </LeftBottomGamesText>
                                <LeftBottomGamesNumber>
                                    16
                                </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>
                    </LeftBottomContainer>
                </LeftProfileContainer>
                <RightProfileContainer>
                    <RightUserNoteContainer>
                        <RightUsernameText>Username</RightUsernameText>
                        <RightNoteText>(Note: username cannot be edited)</RightNoteText>
                    </RightUserNoteContainer>
                    <MiddleTextSecondRow>
                        <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
                        <TextContainerStyled
                        variant="outlined"
                        placeholder="Username..."
                        value="clarkinator27"
                        // onChange={(event) => centralDataDispatch({
                        //     type: 'SET_USER_PROFILE', 
                        //     payload: {...centralData.userProfile, userName: event.target.value}
                        // })
                        // }
                        // sx={{
                        //     backgroundColor: 'white'
                        // }}
                        />
                    </MiddleTextSecondRow>
                    <InformationText>Information</InformationText>
                    <MiddleText>
                        <MiddleTextFirstRow>
                            <TitleField
                            select
                            value="Ms."
                            // onChange={(event) => centralDataDispatch({
                            //     type: 'SET_USER_PROFILE',
                            //     payload: {...centralData.userProfile, title: event.target.value} 
                            // })
                            // }
                            // variant="outlined"
                            // SelectProps={{
                            //     IconComponent: DropDown, // Custom icon component
                            // }}
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
                            // onChange={(event) => centralDataDispatch({
                            //     type: 'SET_USER_PROFILE', 
                            //     payload: {...centralData.userProfile, firstName: event.target.value}
                            // })
                            // }
                            />
                            <TextContainerStyled
                            variant="outlined"
                            placeholder="Last Name"
                            value="Clark"
                            // onChange={(event) => centralDataDispatch({
                            //     type: 'SET_USER_PROFILE', 
                            //     payload: {...centralData.userProfile, lastName: event.target.value}
                            //     })
                            // }
                            />
                        </MiddleTextFirstRow>
                        <TextContainerStyled
                            variant="outlined"
                            placeholder="School Email..."
                            value="aclark@realhighschool.edu"
                        //     onChange={(event) => centralDataDispatch({
                        //     type: 'SET_USER_PROFILE', 
                        //     payload: {...centralData.userProfile, email: event.target.value}
                        //     })
                        // }
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
                            {frontImage 
                                ? ( <ImagePlaceHolder
                                src={URL.createObjectURL(frontImage)}
                                alt="Uploaded Preview"
                                />)
                                : (<CentralButton
                                buttonType={buttonTypeUpload}
                                isEnabled={isUploadFrontEnabled}
                                buttonWidthOverride='38px'
                                iconOnlyOverride
                                onClick={async () => {
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
                            />)
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
                        // onChange={(event) => centralDataDispatch({
                        //     type: 'SET_USER_PROFILE', 
                        //     payload: {...centralData.userProfile, password: event.target.value}
                        // })
                        // }
                        // error={!!passwordError}
                        // sx={{
                        //     backgroundColor: 'white',
                        // }}
                        // InputProps={{
                        //     endAdornment: (
                        //     <InputAdornment position="end">
                        //         {passwordError && (
                        //         <CustomTooltip
                        //             title={
                        //             <Box>
                        //                 <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                        //                 Passwords must:
                        //                 </Typography>
                        //                 <PasswordRequirementsList>
                        //                 <PasswordRequirementItem>
                        //                     <PasswordRequirementText primary="Be at least 8 characters in length" />
                        //                 </PasswordRequirementItem>
                        //                 <PasswordRequirementItem>
                        //                     <PasswordRequirementText primary="Include at least one letter" />
                        //                 </PasswordRequirementItem>
                        //                 <PasswordRequirementItem>
                        //                     <PasswordRequirementText primary="Include at least one number" />
                        //                 </PasswordRequirementItem>
                        //                 </PasswordRequirementsList>
                        //             </Box>
                        //             }
                        //             componentsProps={{
                        //             tooltip: {
                        //                 sx: {
                        //                 bgcolor: `${theme.palette.primary.extraDarkBlue}`,
                        //                 color: '#FFFFFF !important', // Ensures text remains white
                        //                 fontSize: '14px',
                        //                 padding: '10px 15px',
                        //                 borderRadius: '8px',
                        //                 maxWidth: '250px', 
                        //                 boxSizing: 'border-box',
                        //                 boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        //                 '& .MuiTooltip-arrow': {
                        //                     color: `${theme.palette.primary.extraDarkBlue}`,
                        //                 },
                        //                 },
                        //             },
                        //             }}
                        //             arrow
                        //             placement="top"
                        //         >
                        //             <img
                        //             src={errorIcon}
                        //             alt="Error"
                        //             style={{ cursor: 'pointer' }}
                        //             />
                        //         </CustomTooltip>
                        //         )}
                        //     </InputAdornment>
                        //     ),
                        // }}
                    />
                    <ChangePasswordButtonContainer>
                        <CentralButton buttonType={buttonChangePassword} isEnabled={isChangePassword} smallScreenOverride/>
                    </ChangePasswordButtonContainer>

                </RightProfileContainer>
            </MiddleContentContainer>
        </InnerBodyContainer>
  )
}

