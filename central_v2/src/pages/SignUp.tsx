import React, { useState, useRef, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled} from '@mui/material/styles';
import {Box, Typography, Select, TextField, MenuItem, InputAdornment, List, ListItem, ListItemText, Button, CircularProgress, IconButton} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IAPIClients, IUserProfile } from '@righton/networking';
import { useGoogleLogin } from '@react-oauth/google';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import RightOnLogo from '../images/RightOnUserLogo.svg';
import GoogleImageSvg from "../images/googleicon.svg";

import Adpic from "../images/@.svg"
import { ReactComponent as DropDown} from "../images/dropDownArrow.svg"
import { 
  TextContainerStyled,
} from '../lib/styledcomponents/CreateQuestionStyledComponents';
import errorIcon from '../images/errorIcon.svg';
import SignUpErrorModal from '../components/modal/SignUpErrorModal';
import ModalBackground from '../components/modal/ModalBackground';



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

const GoogleSignUpButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',  // Make background transparent
  color: '#0966E0',
  padding: '10px 16px',
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Poppins, sans-serif',
  borderRadius: '8px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  border: '2px solid #0966E0',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));


const OrText = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  color: '#384466', 
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


const MiddleTextSecondRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '3.5px',
  alignItems: 'stretch'
}));

const MiddleTextFourthRow = styled(Typography)(({ theme }) => ({
  display: 'flex',
  color: '#384466', 
  fontFamily: 'Rubik, sans-serif', 
  fontWeight: 400, 
  fontSize: '16px', 
  marginBottom: '-16px'
}));


const UploadImagesAndPassword = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}));

const PasswordContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
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
  marginTop: '4px',
  gap: '24px'
}));


const LowestContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '4px',

  gap: '16px'
}));

const HaveAnAccountText = styled(Typography)(({ theme }) => ({
  color: '#02215F', 
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
  apiClients: IAPIClients;
  handleUserCreate: () => void;
  frontImage: File | null;
  setFrontImage: React.Dispatch<React.SetStateAction<File | null>>;
  backImage: File | null;
  setBackImage: React.Dispatch<React.SetStateAction<File | null>>;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  checkForUniqueEmail: (email: string) => Promise<boolean>;
}
export default function SignUp({ 
  apiClients, 
  handleUserCreate, 
  frontImage, 
  setFrontImage, 
  backImage, 
  setBackImage,
  confirmPassword,
  setConfirmPassword,
  checkForUniqueEmail,
}: SignUpProps ) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

    // password input field 
    const [isShowPassword, setIsShowPassword] = useState(false);
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

     const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);
    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    const handleMouseUpConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };



  const [localSignUp, setLocalSignUp] = useState({
    title: centralData.userProfile.title ?? 'Title...',
    firstName: centralData.userProfile.firstName ?? '',
    lastName: centralData.userProfile.lastName ?? '',
    email: centralData.userProfile.email ?? '',
    userName: centralData.userProfile.userName ?? '',
    password: centralData.userProfile.password ?? '',
  });

  const [loading, setLoading] = useState(false);

  const buttonTypeNext = ButtonType.NEXTSTEP;
  const [isNextEnabled, setIsNextEnabled] = useState(true);

  const buttonType = ButtonType.LOGIN;
  const [isEnabled, setIsEnabled] = useState(true);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);

  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();
  const togglePasswordRequirements = () => {
    setShowPasswordRequirements(!showPasswordRequirements);
  };


  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');
    const isUniqueEmail = await checkForUniqueEmail(localSignUp.email);
    if (!isUniqueEmail) {
      setErrorMessage('Email already exists. Please use a different email.');
      setLocalSignUp((prev) => ({
        ...prev,
        email: '',
      }));
      setIsModalOpen(true);
      setLoading(false);
      return;
    }
    
    const { title, firstName, lastName, email, userName, password } = localSignUp;
    const newProfile = {
      ...centralData.userProfile,
      title,
      firstName,
      lastName,
      email,
      userName,
      password
    }

    if(passwordError || passwordConfirmError){
      setLoading(false);
      return
    }

    // Cleared all the checks from here. All checks are being done in real time.

    try {
      await apiClients.centralDataManager?.signUpSendConfirmationCode(newProfile);
      centralDataDispatch({
        type: 'SET_USER_PROFILE',
        payload: {
          ...centralData.userProfile,
          title,
          firstName,
          lastName,
          email,
          userName,
          password
        },
      });
      handleUserCreate(); // Trigger switch to confirmation
    } catch (error) {
      setIsModalOpen(true);
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const idToken = credentialResponse.access_token; // Use `access_token` for OAuth login
        if (idToken) {
          const response = await apiClients.auth.awsSignInFederated();
        } else {
          console.error('Google sign-in token is missing');
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    },
    onError: () => {
      console.error('Google Sign-In Failed');
    },
  });

  const handleGoogleClick = async () => {
    googleLogin();
  }

  return (
    <SignUpMainContainer>
      <SignUpErrorModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} errorMessage={errorMessage}/>
      <ModalBackground isModalOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)}/>
      <InnerBodyContainer>
        <UpperSignup>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
          <UpperSignupSubStepText>Step 1: New Account Registration</UpperSignupSubStepText>
          {/* <UpperSignupSubGoogle>Sign Up with Google</UpperSignupSubGoogle> */}
          <GoogleSignUpButton onClick={handleGoogleClick} variant="contained">
            <img src={GoogleImageSvg} alt="Google Icon" width="30px" height="30px" />
            Sign up with Google
          </GoogleSignUpButton>


        </UpperSignup>

        <OrText>Or</OrText>

        <MiddleText>
          <MiddleTextFirstRow>
            <TitleField
              select
              value={localSignUp.title}
              onChange={(event) => setLocalSignUp((prev) => ({
                ...prev,
                title: event.target.value,
              }))}
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
              value={localSignUp.firstName}
              onChange={(event) => setLocalSignUp((prev) => ({
                ...prev,
                firstName: event.target.value,
              }))}
            />
            <TextContainerStyled
              variant="outlined"
              placeholder="Last Name"
              value={localSignUp.lastName}
              onChange={(event) => setLocalSignUp((prev) => ({
                ...prev,
                lastName: event.target.value,
              }))}
            />
          </MiddleTextFirstRow>
          <MiddleTextSecondRow>
            <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
            <TextContainerStyled
              variant="outlined"
              placeholder="Username..."
              value={localSignUp.userName}
              onChange={(event) => setLocalSignUp((prev) => ({
                ...prev,
                userName: event.target.value,
              }))}
              sx={{
                backgroundColor: 'white'
              }}
            />
          </MiddleTextSecondRow>
          <TextContainerStyled
            variant="outlined"
            placeholder="School Email..."
            value={localSignUp.email}
            onChange={(event) => setLocalSignUp((prev) => ({
              ...prev,
              email: event.target.value,
            }))}
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
            value={localSignUp.password}
            type={isShowPassword ? "text" : "password"}
            onChange={(event) => {
              const newPassword = event.target.value;
              setLocalSignUp((prev) => ({
                ...prev,
                password: newPassword,
              }));

              // Real-time validation checks
              if (newPassword.length > 0 && newPassword.length < 8) {
                setPasswordError("Password must be at least 8 characters long.");
              } else if (!/[A-Za-z]/.test(newPassword)) {
                setPasswordError("Password must include at least one letter.");
              } else if (!/\d/.test(newPassword)) {
                setPasswordError("Password must include at least one number.");
              } else {
                setPasswordError(""); // Clear error if all checks pass
              }
        
              // Populate the state when password dont match else elear confirm password error if passwords match
              if (newPassword !== confirmPassword) {
                setPasswordConfirmError("Passwords don't match");
              } else {
                setPasswordConfirmError("");
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{gap: `${theme.sizing.xSmPadding}px`}}>
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
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: `${theme.palette.primary.extraDarkBlue}`,
                            color: '#FFFFFF !important', // Ensures text remains white
                            fontSize: '14px',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            maxWidth: '250px', 
                            boxSizing: 'border-box',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                            '& .MuiTooltip-arrow': {
                              color: `${theme.palette.primary.extraDarkBlue}`,
                            },
                          },
                        },
                      }}
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
              onChange={(event) => {
                const newConfirmPassword = event.target.value;
                setConfirmPassword(newConfirmPassword);

                // Real-time match check
                if (newConfirmPassword !== localSignUp.password) {
                  setPasswordConfirmError("Passwords don't match");
                } else {
                  setPasswordConfirmError(""); // Clear error if matched
                }
              }}
              type={isShowConfirmPassword ? "text" : "password"}
              error={!!passwordError}
              sx={{
                backgroundColor: 'white'
              }}
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end" style={{gap: `${theme.sizing.xSmPadding}px`}}>
                    <IconButton
                      aria-label={
                        isShowConfirmPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      onMouseUp={handleMouseUpConfirmPassword}
                      edge="end"
                    >
                      {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    {passwordConfirmError && (
                      <CustomTooltip
                        title={
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                              Passwords do not match.
                            </Typography>
                          </Box>
                        }
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: `${theme.palette.primary.extraDarkBlue}`,
                              color: '#FFFFFF !important', // Ensures text remains white
                              fontSize: '14px',
                              padding: '10px 15px',
                              borderRadius: '8px',
                              maxWidth: '250px', 
                              boxSizing: 'border-box',
                              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                              '& .MuiTooltip-arrow': {
                                color: `${theme.palette.primary.extraDarkBlue}`,
                              },
                            },
                          },
                        }}
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
          { loading 
            ? <Box style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/>
              </Box> 
            : <>
                <CentralButton buttonType={buttonTypeNext} isEnabled={isNextEnabled} onClick={handleSubmit} smallScreenOverride/>
                <LowestContainer>
                  <HaveAnAccountText>
                    Already have an account?
                  </HaveAnAccountText>
                  <CentralButton buttonType={buttonType} isEnabled={isEnabled}  onClick={() => navigate('/login')}/>
                </LowestContainer>
              </>
          } 
        </LowerLogin>
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}