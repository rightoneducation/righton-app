import React, { useState, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { IUserProfile } from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import { 
    TextContainerStyled,
  } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import RightOnLogo from "../images/RightOnLogo.png";

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

const UserCodeTextBoxes = styled(TextContainerStyled)(({ theme }) => ({
    width: '40px',
    height: '54px',
    textAlign: 'center',
    input: {
        textAlign: 'center',
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
interface ConfirmationProps {
    userProfile: IUserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<IUserProfile>>;
    frontImage: File;
    backImage: File;
    handlerImageUpload: (file: File) => Promise<any>;
}

// Use function declaration for the component
function Confirmation({ userProfile, setUserProfile, frontImage, backImage, handlerImageUpload}: ConfirmationProps) {
    const theme = useTheme();
    const [code, setCode] = useState(Array(6).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const apiClients = useTSAPIClientsContext(APIClientsContext);
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

    const handleSubmit = async () => {
        setIsVerifying(true);
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            alert('Please enter all 6 digits of the confirmation code.');
        }
        try {
            const response = await apiClients.centralDataManager?.signUpConfirmAndBuildBackendUser(userProfile, fullCode, frontImage, backImage);
            setUserProfile((prev) => response?.updatedUser ?? prev);
            setIsVerifying(false);
            navigate('/');
        } catch (error: any) {
            setIsVerifying(false);
            console.error('Error confirming sign up:', error);
        }
    };
    const handleResendCodeClick = async () => {
        try {
            await apiClients.auth.awsResendConfirmationCode(userProfile.email);
            console.log('Confirmation code resent!');
        } catch (error) {
            console.error('Error resending confirmation code:', error);
        }
    };
    const setInputRef = (index: number, el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    };

    const uniqueKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
    const buttonTypeVerify = ButtonType.VERIFY;
    const [isVerify, setIsVerify] = useState(true);

    return (
        <OuterBody>
            <InnerBody>
                <ImageContainer>
                    <img src={RightOnLogo} alt="Right On Logo" style={{ width: '280px', height: '280px' }} />
                </ImageContainer>
                <VerifyText>Step 2: Verify Email</VerifyText>
                <EnterText>Enter the verification code you have received in your email</EnterText>
                <CodeandResendContainer>
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
                </CodeandResendContainer>
                <VerifyBox>
                    <CentralButton buttonType={buttonTypeVerify} isEnabled={isVerify && !isVerifying} smallScreenOverride onClick={handleSubmit} />
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

export default Confirmation;