import React, { useState } from 'react';
import { Box, CircularProgress, IconButton, InputAdornment, List, ListItem, ListItemText, styled, Tooltip, Typography, useTheme } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextContainerStyled } from '../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ErrorIcon } from '../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../images/errorIcon.svg';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';

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

const NewPasswordContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }));

  const VerifyBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
  }));

  const PasswordContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
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
    '& span': {
      // Targets the primary text inside ListItemText
      color: '#FFFFFF',
    },
  });

  interface NewPasswordInputsProps {
   password: { newPassword: string, confirmPassword: string},
   handlePasswordInputs: (password: string, type: 'new' | 'confirm') => void;
   onSubmitNewPassword: () => void;
   isVerifying: boolean;
  }

export default function NewPasswordInputs({
    password,
    handlePasswordInputs,
    onSubmitNewPassword,
    isVerifying,
}: NewPasswordInputsProps) {
    const theme = useTheme();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordMismatch, setPasswordMisMatch] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const { newPassword, confirmPassword } = password;
    // display new password field
      const handleClickShowPassword = () => setIsShowPassword((show) => !show);
      const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        event.preventDefault();
      };
      const handleMouseUpPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        event.preventDefault();
      };

    const handleClickShowConfirmPassword = () =>
        setIsShowConfirmPassword((show) => !show);
      const handleMouseDownConfirmPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        event.preventDefault();
      };
      const handleMouseUpConfirmPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        event.preventDefault();
      };
    
      const handleCheckConfirmPassword = (passwordInput: string) => {
        if(passwordInput !== newPassword) {
            setPasswordConfirmError('Passwords do not match.');   
        } else {
            setPasswordConfirmError('');
        }
      };


      const handleCheckPassword = (passwordInput: string) => {
        if (passwordInput.length > 0 && passwordInput.length < 8) {
          setPasswordError('Password must be at least 8 characters long.');
          setPasswordMisMatch(true);
        } else if (!/[A-Za-z]/.test(passwordInput)) {
          setPasswordError('Password must include at least one letter.');
          setPasswordMisMatch(true);
        } else if (!/\d/.test(passwordInput)) {
          setPasswordError('Password must include at least one number.');
          setPasswordMisMatch(true);
        } else {
          setPasswordError(''); // Clear error if all checks pass
          setPasswordMisMatch(false);
        }
        // Make sure passwords always match in case new password is modified.
        if(confirmPassword.length > 0 && confirmPassword !== passwordInput) {
            setPasswordConfirmError("Password do not match")
        } else {
            setPasswordConfirmError("");
        }
      };

    return (
        <>
        <VerifyText>Step 2: Reset Password</VerifyText>
        <EnterText>Please enter a new password that&rsquo;s not the same as your old one</EnterText>
        <NewPasswordContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <PasswordContainer>
                <TextContainerStyled
                  variant="outlined"
                  placeholder="New Password..."
                  value={password.newPassword}
                  type={isShowPassword ? 'text' : 'password'}
                  onChange={(e) => {
                    handlePasswordInputs(e.target.value, 'new');
                    handleCheckPassword(e.target.value);
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontFamily: 'Rubik',
                      height: '43px',
                    },
                    '::-ms-reveal': {
                        display: 'none',
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ gap: `${theme.sizing.xSmPadding}px` }}
                      >
                        <IconButton
                          aria-label={
                            isShowPassword
                              ? 'hide the password'
                              : 'display the password'
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
                                <Typography
                                  sx={{ fontWeight: 'bold', color: '#FFFFFF' }}
                                >
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
                  onChange={(e) => {
                    handlePasswordInputs(e.target.value, 'confirm');
                    handleCheckConfirmPassword(e.target.value);
                  }}
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  error={Boolean(passwordConfirmError && passwordMismatch)}
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiInputBase-root': {
                      fontFamily: 'Rubik',
                      height: '43px',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ gap: `${theme.sizing.xSmPadding}px` }}
                      >
                        <IconButton
                          aria-label={
                            isShowConfirmPassword
                              ? 'hide the password'
                              : 'display the password'
                          }
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          onMouseUp={handleMouseUpConfirmPassword}
                          edge="end"
                        >
                          {isShowConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                        {passwordConfirmError && (
                          <CustomTooltip
                            title={
                              <Box>
                                <Typography
                                  sx={{ fontWeight: 'bold', color: '#FFFFFF' }}
                                >
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
                    ),
                  }}
                />
              </PasswordContainer>
            </Box>
        </NewPasswordContainer>
          <VerifyBox>
                    <CentralButton
                      buttonWidthOverride="160px"
                      buttonType={ButtonType.RESET}
                      isEnabled={!passwordConfirmError && !passwordError && newPassword === confirmPassword}
                      smallScreenOverride
                      onClick={onSubmitNewPassword}
                    />
                  
                </VerifyBox>
                {isVerifying && (
                  <Box
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <CircularProgress
                      style={{ color: theme.palette.primary.darkBlueCardColor }}
                    />
                  </Box>
                )}
        </>
    )
}