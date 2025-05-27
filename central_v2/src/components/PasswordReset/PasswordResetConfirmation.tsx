import React, { useState, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, Box, Typography, CircularProgress, InputAdornment, Tooltip, IconButton, ListItem, ListItemText, List } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from "../button/Button";
import { 
    TextContainerStyled,
  } from '../../lib/styledcomponents/CreateQuestionStyledComponents';
import ConfirmationErrorModal from '../modal/ConfirmationErrorModal';
import RightOnLogo from '../../images/RightOnUserLogo.svg';
import ModalBackground from '../modal/ModalBackground';
import { ErrorIcon } from '../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../images/errorIcon.svg';

// Styled components
const OuterBody = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    alignItems: 'center',
    backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
}));

const InnerBody = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '672px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px',
    boxSizing: 'border-box',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));

const VerifyText = styled(Typography)(({ theme }) => ({
    color: '#02215F',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '36px',
    textAlign: 'center',
}));

const EnterText = styled(Typography)(({ theme }) => ({
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    fontFamily: 'Rubik, sans-serif',
    color: '#02215F',
}));

const CodeandResendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
}));

const UserCodeTextBoxesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
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

const PasswordContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px'
  
}));

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

const UserCodeTextBoxes = styled(TextContainerStyled)(({ theme }) => ({
    width: '40px',
    height: '54px',
    textAlign: 'center',
    input: {
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 700,
        fontSize: '20px',
        color: theme.palette.primary.darkBlue,
    },
}));

const ResendCodeText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    color: '#02215F',
    textDecoration: 'underline',
    textAlign: 'center',
    cursor: 'pointer',
}));

const VerifyBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));

// Props interface
interface PasswordResetProps {
 setIsTabsOpen: (isOpen: boolean) => void;
 handleNextStep: () => void;
 step: number;
}

// Use function declaration for the component
function PasswordResetConfirmation({ setIsTabsOpen, step, handleNextStep }: PasswordResetProps) {
    const theme = useTheme();
    const [code, setCode] = useState(Array(6).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCodeError, setIsCodeError] = useState(false);
    const [passwordMismatch, setPasswordMisMatch] = useState(false);
    const [passwordError, setPasswordError] = useState<string>("");
    const [password, setPassword] = useState<{ newPassword: string; confirmPassword: string}>({
        newPassword: "",
        confirmPassword: ""
    });
    const { newPassword, confirmPassword } = password;
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const centralData = useCentralDataState();
    const centralDataDispatch = useCentralDataDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]); // Refs for each input box

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]*$/.test(value)) return; // Only allow numeric input
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Automatically move to the next input box if a character is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleConfirmationError = () => {
        setIsTabsOpen?.(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        setIsVerifying(true);
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            alert('Please enter all 6 digits of the confirmation code.');
        }
        try {
            // const response = await apiClients.centralDataManager?.signUpConfirmAndBuildBackendUser(centralData.userProfile, fullCode, frontImage, backImage);
            // centralDataDispatch({type: 'SET_USER_PROFILE', payload: response?.updatedUser});
            setIsVerifying(false);
            handleNextStep();
        } catch (error: any) {
            setIsVerifying(false);
            console.log(error);
            const errorInfo = Object.getOwnPropertyNames(error).reduce((acc, key) => {
                acc[key] = error[key];
                return acc;
              }, {} as any);
              
              console.log(errorInfo); // now includes message, stack, etc.
           
            if (error.message === 'CodeMismatchException: Invalid verification code provided, please try again.') {
                handleConfirmationError();
            }
        }
    };

    const handleUpdatePassword = async () => {
        setIsVerifying(true);
        // check for password match
        if(password.newPassword !== password.confirmPassword) {
            setPasswordMisMatch(true);
            return;
        }

        // Make sure code is not less than 6 chars
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            alert('Please enter all 6 digits of the confirmation code.');
        }

        try {
            const updatePassword = {
                username: centralData.userProfile.email,
                newPassword: password.newPassword,
                confirmationCode: fullCode,
            }
            await apiClients.auth.awsConfirmResetPassword(updatePassword);
                navigate('/');
        } catch(error: any) {
            setIsVerifying(false);
            console.log(error);
            const errorInfo = Object.getOwnPropertyNames(error).reduce((acc, key) => {
                acc[key] = error[key];
                return acc;
              }, {} as any);
        }
    }
    const handleResendCodeClick = async () => {
        try {
            await apiClients.auth.awsResendConfirmationCode(centralData.userProfile.email);
        } catch (error) {
            console.error('Error resending confirmation code:', error);
        }
    };
    const setInputRef = (index: number, el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    };

    const handleCheckPassword = (passwordInput: string) => {
        
        if (passwordInput.length > 0 && passwordInput.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            setPasswordMisMatch(true);
          } else if (!/[A-Za-z]/.test(passwordInput)) {
            setPasswordError("Password must include at least one letter.");
            setPasswordMisMatch(true);
          } else if (!/\d/.test(passwordInput)) {
            setPasswordError("Password must include at least one number.");
            setPasswordMisMatch(true);
          } else {
            setPasswordError(""); // Clear error if all checks pass
            setPasswordMisMatch(false);
          }
    }

    const [isVerify, setIsVerify] = useState(true);
    const uniqueKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
    const buttonTypeVerify = ButtonType.VERIFY;

    let verifyText = "";
    let enterText = "";

    if(step === 1) {
        verifyText = "Step 1: Verify Account";
        enterText = "Enter the verification code you have received in your email";
    } else if(step === 2) {
        verifyText = "Step 2: Reset Password";
        enterText = "Please enter a new password that's not the same as your old one";
    }

    const handlePasswordInputs = (pw: string, inputType: 'new' | 'confirm') => {
        if(inputType === 'new') {
            setPassword((prev) => ({...prev, newPassword: pw }))
        } else if(inputType === 'confirm') {
            setPassword((prev) => ({... prev, confirmPassword: pw}))
        }
    }

            const [isShowPassword, setIsShowPassword] = useState(false);
            const handleClickShowPassword = () => setIsShowPassword((show) => !show);
            const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
            };
            const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
            };


                 const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
                  const [passwordConfirmError, setPasswordConfirmError] = useState('');
                const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);
                const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                };
                const handleMouseUpConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                };

    return (
        <OuterBody>
            <ConfirmationErrorModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userProfile={centralData.userProfile} setIsTabsOpen={setIsTabsOpen}/>
            <ModalBackground isModalOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)}/>
            <InnerBody>
                <ImageContainer>
                    <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
                </ImageContainer>
                <VerifyText>{verifyText}</VerifyText>
                <EnterText>{enterText}</EnterText>
                <CodeandResendContainer>
                    {step === 1 && (
                        <>
                        <UserCodeTextBoxesContainer>
                            {code.map((value, index) => (
                                <UserCodeTextBoxes
                                    variant="outlined"
                                    key={`code-${uniqueKeys[index]}`}
                                    inputRef={(el) => setInputRef(index, el)}
                                    value={value}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    inputProps={{ maxLength: 1 }}
                                />
                            ))}
                        </UserCodeTextBoxesContainer>
                        <ResendCodeText onClick={handleResendCodeClick}>Resend Code</ResendCodeText>
                        </>
                    )}

                    {step === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center', gap:'12px'}}>
        {/* <TextContainerStyled
            variant="outlined" 
            sx={{ 
              '& .MuiInputBase-root': {
                fontFamily: 'Rubik',
                height: '43px',
              },
              '& .MuiInputBase-input': {
                color: '#384466',
                opacity: passwordMismatch ? 1 : 0.5,
                '&::placeholder': {
                  color: passwordMismatch ? '#D0254D': '#384466',
                  opacity: passwordMismatch ? 1 : 0.5,
                },
                '&:focus': {
                  color: '#384466',
                  opacity: 1,
                },
                '&:focus::placeholder': {
                  color: '#384466',
                  opacity: 1,
                },
              },
            }}
            placeholder="New Password..." 
            error={passwordMismatch}
            value={password.newPassword}
            onChange = {(e) => {
                handlePasswordInputs(e.target.value, 'new');
                handleCheckPassword(e.target.value);
            }}
            // type="password"
            InputProps={{
              startAdornment: 
                (passwordMismatch) &&
                <InputAdornment
                  position="start" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    mt: '10px'
                  }}
                >
                  <ErrorIcon src={errorIcon} alt='error icon'/>
                </InputAdornment>
            }}
          >
            <Typography>{password.newPassword}</Typography>
          </TextContainerStyled>

          <TextContainerStyled
            variant="outlined" 
            sx={{ 
              '& .MuiInputBase-root': {
                fontFamily: 'Rubik',
                height: '43px',
              },
              '& .MuiInputBase-input': {
                color: '#384466',
                opacity: passwordMismatch ? 1 : 0.5,
                '&::placeholder': {
                  color: passwordMismatch ? '#D0254D': '#384466',
                  opacity: passwordMismatch ? 1 : 0.5,
                },
                '&:focus': {
                  color: '#384466',
                  opacity: 1,
                },
                '&:focus::placeholder': {
                  color: '#384466',
                  opacity: 1,
                },
              },
            }}
            placeholder="Confirm Password" 
            error={passwordMismatch}
            value={password.confirmPassword}
            onChange = {(e) => {
                handlePasswordInputs(e.target.value, 'confirm');

                if (confirmPassword.length > 0 && confirmPassword.length < 8) {
                    setPasswordError("Password must be at least 8 characters long.");
                  } else if (!/[A-Za-z]/.test(confirmPassword)) {
                    setPasswordError("Password must include at least one letter.");
                  } else if (!/\d/.test(confirmPassword)) {
                    setPasswordError("Password must include at least one number.");
                  } else {
                    setPasswordError(""); // Clear error if all checks pass
                  }
            }}
            // type="password"
            InputProps={{
              startAdornment: 
                (passwordMismatch) &&
                <InputAdornment
                  position="start" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    mt: '10px'
                  }}
                >
                  <ErrorIcon src={errorIcon} alt='error icon'/>
                </InputAdornment>
            }}
          >
            <Typography>{password.confirmPassword}</Typography>
          </TextContainerStyled> */}

<PasswordContainer>
          <TextContainerStyled
            variant="outlined"
            placeholder="New Password..."
            value={password.newPassword}
            type={isShowPassword ? "text" : "password"}
            onChange = {(e) => {
                handlePasswordInputs(e.target.value, 'new');
                handleCheckPassword(e.target.value);
            }}
            sx={{
                '& .MuiInputBase-root': {
                    fontFamily: 'Rubik',
                    height: '43px',
                  },
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
              onChange = {(e) => {
                handlePasswordInputs(e.target.value, 'confirm');
                handleCheckPassword(e.target.value);
            }}
           
              type={isShowConfirmPassword ? "text" : "password"}
              error={!!passwordError}
              sx={{
                backgroundColor: 'white',
                '& .MuiInputBase-root': {
                    fontFamily: 'Rubik',
                    height: '43px',
                  },
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
                        </Box>
                    )}
                </CodeandResendContainer>
                <VerifyBox>
                   {step === 1 && <CentralButton buttonWidthOverride='160px' buttonType={buttonTypeVerify} isEnabled={isVerify && !isVerifying} smallScreenOverride onClick={handleSubmit} />}
                   {step === 2 && <CentralButton buttonWidthOverride='160px' buttonType={ButtonType.RESET} isEnabled={password.newPassword === password.confirmPassword} smallScreenOverride onClick={handleSubmit} />}
                </VerifyBox>
                    {isVerifying && 
                        <Box style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/>
                        </Box>
                    } 
            </InnerBody>
        </OuterBody>
    );
}

export default PasswordResetConfirmation;