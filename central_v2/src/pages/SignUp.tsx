import React, { useState, useRef, useEffect  } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {Box, FormControl, Typography, Select, TextField, MenuItem, SelectChangeEvent, Button, Avatar} from '@mui/material';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import RightOnLogo from "../images/RightOnLogo.png";
import Adpic from "../images/@.svg"
import Confirmation from './Confirmation';
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

const ImagePlaceHolder = styled('img')(({ theme }) => ({
  width: 100, // Set default width
  height: 148, // Set default height
  borderRadius: 4, // Set border radius for rounded corners
  border: '2px solid #ccc', // Add border
}));

interface SignUpProps {
  handleUserCreate: (user: string) => void;
  frontImage: File | null;
  setFrontImage: React.Dispatch<React.SetStateAction<File | null>>;
  backImage: File | null;
  setBackImage: React.Dispatch<React.SetStateAction<File | null>>;
  apiClients: any; // Replace with the exact type if you have one for `apiClients`
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
}
function SignUp({ handleUserCreate, frontImage, setFrontImage, backImage, setBackImage, apiClients, password, setPassword, confirmPassword, setConfirmPassword}: SignUpProps ) {
  const [title, setTitle] = useState('Title...');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonTypeNext = ButtonType.NEXTSTEP;
  const [isNextEnabled, setIsNextEnabled] = useState(true);

  const buttonType = ButtonType.LOGIN;
  const [isEnabled, setIsEnabled] = useState(true);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);

  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setLoading(false);
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
      questionsMade: 16,
    };

    try {
      await apiClients.auth.awsSignUp(userName, schoolEmail, password);
      await apiClients.user.createUser(user); // Save user to the backend
      // let response
      // let response2;

      // // Ensure frontImage and backImage are not null
      // if (frontImage) {
      //   response = await handlerImageUpload(frontImage);
      // } else {
      //   console.error("Front image is required.");
      //   setLoading(false);
      //   return;
      // }
  
      // if (backImage) {
      //   response2 = await handlerImageUpload(backImage);
      // } else {
      //   console.error("Back image is required.");
      //   setLoading(false);
      //   return;
      // }

      // console.log(response)
      // console.log(response2)

      handleUserCreate(userName); // Trigger switch to confirmation
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };


  return (
    <SignUpMainContainer>
      <InnerBodyContainer>
        <UpperSignup>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
          <UpperSignupSubStepText>Step 1: New Account Registration</UpperSignupSubStepText>
          <UpperSignupSubGoogle>Sign Up with Google</UpperSignupSubGoogle>
        </UpperSignup>

        <OrText>Or</OrText>

        <MiddleText>
          <MiddleTextFirstRow>
            <TitleField
              select
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
            <UserTextField
              variant="outlined"
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <UserTextField
              variant="outlined"
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </MiddleTextFirstRow>
          <MiddleTextSecondRow>
            <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
            <UserTextField
              variant="outlined"
              placeholder="Username..."
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </MiddleTextSecondRow>
          <UserTextField
            variant="outlined"
            placeholder="School Email..."
            value={schoolEmail}
            onChange={(event) => setSchoolEmail(event.target.value)}
          />
          <MiddleTextFourthRow>Teacher ID Image</MiddleTextFourthRow>
        </MiddleText>

        <UploadImagesAndPassword>
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
          <PasswordContainer>
            <UserTextField
              variant="outlined"
              placeholder="Password..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={!!passwordError}
            />
            <UserTextField
              variant="outlined"
              placeholder="Confirm Password..."
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={!!passwordError}
            />
          </PasswordContainer>
        </UploadImagesAndPassword>

        <LowerLogin>
              <CentralButton buttonType={buttonTypeNext} isEnabled={isNextEnabled} onClick={handleSubmit}/>
              <LowestContainer>
                <HaveAnAccountText>
                  Already have an account?
                </HaveAnAccountText>
                <CentralButton buttonType={buttonType} isEnabled={isEnabled}  />
              </LowestContainer>
        </LowerLogin>
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}

export default function SignUpSwitch() {

  const [userName, setUserName] = useState(''); // Track the submitted username
  const [isUserSubmitted, setIsUserSubmitted] = useState(false); // Track submission state
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handlerImageUpload = async (file: File) => {
    console.log(file)
    const fileName = file.name
    const fileType = file.type
    console.log(fileName)
    console.log(fileType)
    const response = await apiClients.user.uploadTeacherId(file, fileName, fileType)
    
    console.log("response: ", response)
    return response
  }

  const handleUserCreate = (user: string) => {
    setUserName(user);
    setIsUserSubmitted(true); // Trigger confirmation view
  };

  return isUserSubmitted ? (
    <Confirmation userName={userName} frontImage={frontImage} backImage={backImage} handlerImageUpload={handlerImageUpload}
    password={password}/> // Render confirmation page
  ) : (
    <SignUp handleUserCreate={handleUserCreate} frontImage={frontImage} setFrontImage={setFrontImage} 
    backImage={backImage} setBackImage={setBackImage} apiClients={apiClients} password={password} setPassword={setPassword}
    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}/> // Render signup page
  );
}

