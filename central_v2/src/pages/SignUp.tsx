import React, { useState, useRef, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled} from '@mui/material/styles';
import {Box, Typography, Select, TextField, MenuItem, InputAdornment, List, ListItem, ListItemText,} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import RightOnLogo from "../images/RightOnLogo.png";
import Adpic from "../images/@.svg"
import Confirmation from './Confirmation';
import { ReactComponent as DropDown} from "../images/dropDownArrow.svg"
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

import { 
  TextContainerStyled,
} from '../lib/styledcomponents/CreateQuestionStyledComponents';

import {
  ErrorIcon
} from '../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../images/errorIcon.svg';


const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  gap: '20px',
  height: '100%',
  width: '100%',
  maxWidth: '500px',
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  boxSizing: 'border-box',
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
  // border: '1px solid black',
  gap: '12px'
  
}));

const CustomTooltip = styled(Tooltip)({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#02215F !important', // Ensures the background applies
    color: '#FFFFFF !important', // Ensures text remains white
    fontSize: '14px',
    padding: '10px 15px',
    borderRadius: '8px',
    maxWidth: '250px', 
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiTooltip-arrow': {
    color: '#02215F !important', // Ensures arrow color matches the tooltip
  },
});




const PasswordRequirementsList = styled(List)({
  margin: 0,
  paddingLeft: '18px',
  listStyleType: 'disc',
  
});

const PasswordRequirementItem = styled(ListItem)({
  display: 'list-item', // Ensures bullet points appear
  padding: 0, // Removes extra padding from ListItem

});

const PasswordRequirementText = styled(ListItemText)({
  '& span': { // Targets the primary text inside ListItemText
    color: '#FFFFFF', 
  },
});

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
  width: '80%', // Set default width
  height: 148, // Set default height
  borderRadius: 4, // Set border radius for rounded corners
  border: '2px solid #ccc', // Add border
  objectFit: 'cover'
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
  schoolEmail: string
  setSchoolEmail: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: (value: string) => void
}
function SignUp({ handleUserCreate, frontImage, setFrontImage, backImage, setBackImage, apiClients, password, setPassword, confirmPassword, setConfirmPassword, schoolEmail, setSchoolEmail}: SignUpProps ) {
  const [title, setTitle] = useState('Title...');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const [loading, setLoading] = useState(false);

  const buttonTypeNext = ButtonType.NEXTSTEP;
  const [isNextEnabled, setIsNextEnabled] = useState(true);

  const buttonType = ButtonType.LOGIN;
  const [isEnabled, setIsEnabled] = useState(true);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);

  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();
  const togglePasswordRequirements = () => {
    setShowPasswordRequirements(!showPasswordRequirements);
  };


  const handleSubmit = async () => {
    setLoading(true);
    setPasswordError(""); // Reset error before validation
    setPasswordConfirmError("")
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      setPasswordError("Password must include at least one letter.");
      setLoading(false);
      return;
    }

    if (!/\d/.test(password)) {
      setPasswordError("Password must include at least one number.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordConfirmError("Passwords don't match");
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
      const dynamocreate = await apiClients.user.createUser(user); // Save user to the backend
      console.log(dynamocreate)

      const awssignup = await apiClients.auth.awsSignUp(userName, schoolEmail, password);
      console.log(awssignup)

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
            <TextContainerStyled
              variant="outlined"
              placeholder="Username..."
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              sx={{
                backgroundColor: 'white'
              }}
              // InputProps={{
              //   endAdornment: 
              //     <InputAdornment
              //       position="end" 
              //       sx={{ 
              //         flexDirection: 'column',
              //         // alignSelf: 'flex-start',
              //         alignItems: 'center',
              //         mt: '-20px'
              //       }}
              //     >
              //       <ErrorIcon src={errorIcon} alt='error icon'/>
              //     </InputAdornment>
              // }}
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
          <PasswordContainer>
          <TextContainerStyled
            variant="outlined"
            placeholder="Password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={!!passwordError}
            sx={{
              backgroundColor: 'white',
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {passwordError && (
                    <CustomTooltip
                      title={
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                            Passwords must:
                          </Typography>
                          <PasswordRequirementsList>
                            <PasswordRequirementItem>
                              <PasswordRequirementText primary="Be at least 8 characters in length" />
                            </PasswordRequirementItem>
                            <PasswordRequirementItem>
                              <PasswordRequirementText primary="Include at least one letter" />
                            </PasswordRequirementItem>
                            <PasswordRequirementItem>
                              <PasswordRequirementText primary="Include at least one number" />
                            </PasswordRequirementItem>
                          </PasswordRequirementsList>
                        </Box>
                      }
                      arrow
                      placement="top"
                    >
                      <img
                        src={errorIcon}
                        alt="Error"
                        style={{ cursor: 'pointer' }}
                      />
                    </CustomTooltip>
                  )}
                </InputAdornment>
              ),
            }}
            />
            <TextContainerStyled
              variant="outlined"
              placeholder="Confirm Password..."
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={!!passwordError}
              sx={{
                backgroundColor: 'white'
              }}
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                  {passwordConfirmError && (
                    <CustomTooltip
                      title={
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                            Passwords do not match.
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="top"
                    >
                      <img
                        src={errorIcon}
                        alt="Error"
                        style={{ cursor: 'pointer' }}
                      />
                    </CustomTooltip>
                  )}
                </InputAdornment>
              }}
            />
          </PasswordContainer>
        </UploadImagesAndPassword>

        <LowerLogin>
              <CentralButton buttonType={buttonTypeNext} isEnabled={isNextEnabled} onClick={handleSubmit} smallScreenOverride/>
              <LowestContainer>
                <HaveAnAccountText>
                  Already have an account?
                </HaveAnAccountText>
                <CentralButton buttonType={buttonType} isEnabled={isEnabled}  onClick={() => navigate('/login')}/>
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
  const [schoolEmail, setSchoolEmail] = useState('');

  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handlerImageUpload = async (file: File) => {
    const fileName = file.name
    const fileType = file.type
    const response = await apiClients.user.uploadTeacherId(file, fileName, fileType)
    return response
  }

  const handleUserCreate = (user: string) => {
    setUserName(user);
    setIsUserSubmitted(true); // Trigger confirmation view
  };

  return isUserSubmitted ? (
    <Confirmation schoolEmail={schoolEmail} frontImage={frontImage} backImage={backImage} handlerImageUpload={handlerImageUpload}
    password={password}/> // Render confirmation page
  ) : (
    <SignUp handleUserCreate={handleUserCreate} frontImage={frontImage} setFrontImage={setFrontImage} 
    backImage={backImage} setBackImage={setBackImage} apiClients={apiClients} password={password} setPassword={setPassword}
    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} schoolEmail={schoolEmail} setSchoolEmail={setSchoolEmail}/> // Render signup page
  );
}
