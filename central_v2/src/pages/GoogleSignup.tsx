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
    gap: '24px',
    height: '100%',
    width: '100%',
    maxWidth: '500px',
    marginTop: '84px',
    boxSizing: 'border-box',
  }));

const UpperSignup = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  }));

const UpperSignupSubStepText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700, 
    fontSize: '24px', 
    color: '#02215F',
    textAlign: 'center', 
  }));

  
const TitleandNameMUI = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
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

const UsernameMUI = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '4px',
    alignItems: 'stretch'
  }));

const TeacherIdText = styled(Typography)(({ theme }) => ({
    display: 'flex',
    color: '#384466', 
    fontFamily: 'Rubik, sans-serif', 
    fontWeight: 400, 
    fontSize: '16px', 
    marginTop: '-12px'
}));
  

const UploadImages= styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-start',
    marginTop: '-20px'
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

const GetStartedContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',

}));

const ImagePlaceHolder = styled('img')(({ theme }) => ({
    width: '80%', // Set default width
    height: 148, // Set default height
    borderRadius: 4, // Set border radius for rounded corners
    border: '2px solid #ccc', // Add border
    objectFit: 'cover'
}));

interface GoogleSignupProps {
    apiClients: IAPIClients;
    frontImage: File | null;
    setFrontImage: React.Dispatch<React.SetStateAction<File | null>>;
    backImage: File | null;
    setBackImage: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function GoogleSignup({
    apiClients,
    frontImage,
    setFrontImage, 
    backImage,
    setBackImage
}: GoogleSignupProps) {

    const navigate = useNavigate(); // Initialize useNavigate
    const buttonTypeUpload = ButtonType.UPLOAD;
    const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);
    const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);

    const buttonTypeStarted = ButtonType.GETSTARTED;
    const [isGetStartedEnabled, setIsGetStartedEnabled] = useState(true);
    const centralData = useCentralDataState();
    const centralDataDispatch = useCentralDataDispatch();
    console.log(apiClients.auth.getCurrentSession());
    console.log(apiClients.auth.getFirstAndLastName());

    // Local temporary states
    const [title, setTitle] = useState('Title...') 
    const [firstName, setFirstName] = useState(centralData.userProfile?.firstName || '') 
    const [lastName, setLastName] = useState(centralData.userProfile?.lastName || '') 
    const [userName, setUserName] = useState('') 
    const userProfileInit = {
      title: 'Title...',
      firstName: centralData.userProfile?.firstName || '',
      lastName: centralData.userProfile?.lastName || '',
      userName: '',
      email: '',
      password: '',
  }
  
    const handleGetStarted = async () => {
      try {
        if(frontImage && backImage) {
          const updatedProfile = {
            ...userProfileInit, // ensures all keys are there
            firstName,
            lastName,
            userName,
            title,
          };
          const response = await apiClients.centralDataManager?.signUpGoogleBuildBackendUser(updatedProfile, frontImage, backImage);
          // need if statement for response
          if (response?.updatedUser){
            centralDataDispatch({type: 'SET_USER_PROFILE', payload: response.updatedUser});
            centralDataDispatch({type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN});
            navigate("/")
          } 
        }
      } catch (error) {
        console.error(error);
      }
    };
    

  return (
    <SignUpMainContainer>
        <InnerBodyContainer>
            <UpperSignup>
                <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
                <UpperSignupSubStepText>Step 2: Finish Setting Up Your Account</UpperSignupSubStepText>
            </UpperSignup>
            <TitleandNameMUI>
                <TitleField
                select
                value={title}
                onChange={(event) => 
                  setTitle(event.target.value)
                }
                variant="outlined"
                SelectProps={{
                    IconComponent: DropDown, // Custom icon component
                }}
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
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value)
                  }
                }
                />
                <TextContainerStyled
                variant="outlined"
                placeholder="Last Name"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value)
                }
                }
                />
          </TitleandNameMUI>
          <UsernameMUI>
            <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
            <TextContainerStyled
              variant="outlined"
              placeholder="Username..."
              value={userName}
              onChange={(event) => 
                setUserName(event.target.value)
              }
              sx={{
                backgroundColor: 'white'
              }}
            />
          </UsernameMUI>
          <TeacherIdText>Teacher ID Image</TeacherIdText>
          <UploadImages>
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
          <GetStartedContainer>
            <CentralButton 
                buttonType={buttonTypeStarted} 
                isEnabled={isGetStartedEnabled} 
                buttonWidthOverride='150px'
                onClick={handleGetStarted}
            />
          </GetStartedContainer>
        </InnerBodyContainer>
    </SignUpMainContainer>
  )
}

