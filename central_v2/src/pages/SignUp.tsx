import React, { useState, useRef  } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {Box, FormControl, Typography, Select, TextField, MenuItem, SelectChangeEvent, Button} from '@mui/material';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import RightOnLogo from "../images/RightOnLogo.png";
import Adpic from "../images/@.svg"
import { ReactComponent as DropDown} from "../images/dropDownArrow.svg"
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  gap: '20px',
  height: '100vh',
}));


const UpperSignup = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px'
  
}));


const UpperSignupSubStepText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700, 
  fontSize: '24px', 
  color: '#02215F',
  textAlign: 'center', 
}));

const UpperSignupSubGoogle = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#0966E0', 
  border: '2px solid #0966E0', // Set border to 2px with the same color
  borderRadius: '8px', // Set border radius to 8px
  backgroundColor: 'white', // Set background color to white
  minHeight: '52px',
}));

const OrText = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  color: '#384466', 
  // border: '1px solid yellow',
  fontFamily: 'Poppins, sans-serif', 
  fontWeight: 600, 
  fontSize: '16px', 
}));


const MiddleText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'

}));

const MiddleTextFirstRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid green',
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
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: '108px',
  '& .MuiSelect-select': {
    color: '#CCCCCC',
     
  },
  '&.Mui-focused .MuiSelect-select': {
    color: '#384466',
  },

  '& .MuiSelect-icon': {
    transition: 'transform 0.2s ease', // Smooth transition for rotation
    marginRight: '10px',
  },
  '&.Mui-focused .MuiSelect-icon': {
    transform: 'rotate(-180deg)', // Rotate upward when focused
  },
}));

const UserTextField = styled(TextField)(({ theme }) => ({
  border: '2px solid #CCCCCC', // Set border to 2px
  borderRadius: '8px', // Set border radius to 8px
  backgroundColor: '#FFFFFF', // Set background color to white
  width: '100%',
  '& .MuiInputBase-root': {
    borderRadius: '8px', // Ensure border radius is applied to the input field
  },
  '& .MuiInputBase-input': {
    color: '#384466', // Set text color of the input

  },
  '& .MuiInputBase-input::placeholder': {
    color: '#384466', // Set the placeholder text color
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#CCCCCC', // Set border color for the outline
  },
}));


const MiddleTextSecondRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid green',
  gap: '3.5px',
  alignItems: 'stretch'
}));

const MiddleTextFourthRow = styled(Typography)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid green',
  color: '#384466', 
  fontFamily: 'Rubik, sans-serif', 
  fontWeight: 400, 
  fontSize: '16px', 
  marginBottom: '-16px'
}));


const UploadImagesAndPassword = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid yellow',
  flexDirection: 'column',
  gap: '12px'
}));

const PasswordContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid red',
  gap: '12px'
}));


const UploadImages= styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  justifyContent: 'flex-start'
}));

const UploadImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#02215F',  // Set background color
  border: '1px solid #000000', // Set border color and width
  borderRadius: '8px',         // Set border radius
  flexDirection: 'column',
  alignItems: 'center',        // Center content vertically
  justifyContent: 'center',    // Center content horizontally
  width: '100%',
  gap: '10px',
  paddingTop: '8px',
  paddingRight: '58px',
  paddingBottom: '16px',
  paddingLeft: '58px',
}));

const ImageText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',  // Set font to Rubik
  fontWeight: 400,                  // Set font weight to 400
  fontSize: '16px',                 // Set font size to 16px
  color: '#E9F1FF',                 // Set text color to #E9F1FF
}));

const LowerLogin = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // border: '1px solid yellow',
  marginTop: '4px',
  gap: '24px'
}));


const LowestContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // border: '1px solid red',
  marginTop: '4px',

  gap: '16px'
}));

const HaveAnAccountText = styled(Typography)(({ theme }) => ({
  color: '#02215F', 
  // border: '1px solid blue',
  fontFamily: 'Rubik, sans-serif', 
  fontWeight: 400, 
  fontSize: '16px', 
}));

export default function SignUp() {

  const [title, setTitle] = useState('Title...');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [userName, setUserName] = useState(''); 
  const [schoolEmail, setSchoolEmail] = useState(''); 

  const [imageFront, setImageFront] = useState<File | null>(null);
  const [imageBack, setImageBack] = useState<File | null>(null);

  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [passwordError, setPasswordError] = useState('')

  const buttonType = ButtonType.LOGIN;
  const [isEnabled, setIsEnabled] = useState(true);

  const buttonTypeNext = ButtonType.NEXTSTEP;
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);

  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);

  const apiClients = useTSAPIClientsContext(APIClientsContext);

const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setFirstName(event.target.value);
}
const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setLastName(event.target.value);
}
const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setUserName(event.target.value);
}
const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(event.target.value);
  setPasswordError('');
}

const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setConfirmPassword(event.target.value);
  setPasswordError('');
}

const handleSchoolEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSchoolEmail(event.target.value);
}

const handleImageFrontChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setImageFront(file);
  }
};

const handleImageBackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setImageBack(file);
  }
};
const handleSubmit = () => {
  if (password !== confirmPassword){
    setPasswordError("Passwords don't match")
    return;
  }

  const user = {
    userName,
    title,
    firstName,
    lastName,
    email: schoolEmail,
    password,
    gamesMade: 77, 
    questionsMade: 16 
  };
  
  apiClients.user.createUser(user)
  .then(response => {
    console.log('User Created:', response)
  }).catch(error => {
    console.error('Error creating user:', error)
  })
};



  return (
      <SignUpMainContainer>
        <InnerBodyContainer>
          <UpperSignup >
            <img src={RightOnLogo} alt="Right On Logo" style={{width: '200px', height: '200px'}}/> 
            <UpperSignupSubStepText>
              Step 1: New Account Registration
            </UpperSignupSubStepText>
            <UpperSignupSubGoogle>
              Sign Up with Google
            </UpperSignupSubGoogle>
          </UpperSignup>

          <OrText>
              Or
          </OrText>

          <MiddleText>
            <MiddleTextFirstRow>
              <TitleField
                select
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                variant="outlined"
                SelectProps={{
                  IconComponent: DropDown,  // Custom icon component
                }}
                >
                  <MenuItem value="Title...">
                    Title...
                  </MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
              </TitleField>
              <UserTextField
                variant="outlined"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange} 
              />
              <UserTextField
                variant="outlined"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange} 
              />
            </MiddleTextFirstRow>
            <MiddleTextSecondRow>
                <img src={Adpic} alt="Adpic" style={{width: '26px'}}/>
                <UserTextField 
                  variant="outlined"
                  placeholder="Username..."
                  value={userName}
                  onChange={handleUserNameChange} 
                />
            </MiddleTextSecondRow>
            <UserTextField
              variant="outlined"
              placeholder="School Email..."
              value={schoolEmail}
              onChange={handleSchoolEmailChange}/>
            <MiddleTextFourthRow>
              Teacher ID Image
            </MiddleTextFourthRow>
          </MiddleText>

          <UploadImagesAndPassword>
            <UploadImages >
                <UploadImageContainer>
                  <ImageText>Front</ImageText>
                  <CentralButton buttonType={buttonTypeUpload} isEnabled={isUploadFrontEnabled} />
                </UploadImageContainer>

                <UploadImageContainer>
                    <ImageText>Back</ImageText>
                    <CentralButton buttonType={buttonTypeUpload} isEnabled={isUploadBackEnabled} />
                </UploadImageContainer>
            </UploadImages>
            <PasswordContainer>
              <UserTextField
                  variant="outlined"
                  placeholder="Password..."
                  value={password}
                  onChange={handlePasswordChange} 
                  error = {!!passwordError}
                  />
              <UserTextField
                  variant="outlined"
                  placeholder="Confirm Password..."
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={!!passwordError}
                  // helperText={passwordError}
                  />
            </PasswordContainer>
          </UploadImagesAndPassword>

          <LowerLogin>
              <CentralButton buttonType={buttonTypeNext} isEnabled={isNextEnabled} />
              <LowestContainer>
                <HaveAnAccountText>
                  Already have an account?
                </HaveAnAccountText>
                <CentralButton buttonType={buttonType} isEnabled={isEnabled} onClick={handleSubmit} />
              </LowestContainer>
          </LowerLogin>
        </InnerBodyContainer>
      </SignUpMainContainer>
  );
}
