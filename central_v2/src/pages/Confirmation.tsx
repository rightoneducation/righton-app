import React, { useState, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { TextField, Box, Typography } from '@mui/material';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from "../components/button/Button";
import RightOnLogo from "../images/RightOnLogo.png";

// Styled components
const OuterBody = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
    justifyContent: 'center',
}));

const InnerBody = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
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

const UserCodeTextBoxes = styled(TextField)(({ theme }) => ({
    width: '40px',
    height: '54px',
    borderRadius: '8px',
    border: '2px solid #FFFFFF',
    color: '#FFFFFF',
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
}));

const VerifyBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));

// Props interface
interface ConfirmationProps {
    userName?: string;
    frontImage?: File | null;
    backImage?: File | null;
    handlerImageUpload?: (file: File) => Promise<any>;
    password?: string
}

// Use function declaration for the component
function Confirmation({ userName = '', frontImage, backImage, handlerImageUpload, password}: ConfirmationProps) {
    const [code, setCode] = useState(Array(6).fill(''));
    const apiClients = useTSAPIClientsContext(APIClientsContext);

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
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            alert('Please enter all 6 digits of the confirmation code.');
            return;
        }
        try {
            await apiClients.auth.awsConfirmSignUp(userName, fullCode);
            console.log('Confirmation successful!');

        } catch (error) {
            console.error('Error confirming sign-up:', error);
        }

        try {
            if(password) {
                await apiClients.auth.awsSignIn(userName, password);
                console.log('Confirmation successful!');
            }
        } catch (error) {
            console.error('Error Signing in user:', error);
        }

        try {
            let response
            let response2;

            // Ensure frontImage and backImage are not null
            if (frontImage && handlerImageUpload) {
            response = await handlerImageUpload(frontImage);
            } else {
            console.error("Front image is required.");
            return;
            }
            if (backImage && handlerImageUpload) {
            response2 = await handlerImageUpload(backImage);
            } else {
            console.error("Back image is required.");
            return;
            }
            console.log("Image Uploaded Successfully.")
        } catch (error) {
            console.error('Error Uploading Images:', error);
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
                                key={`code-${uniqueKeys[index]}`}
                                inputRef={(el) => setInputRef(index, el)}
                                value={value}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{ maxLength: 1 }}
                            />
                        ))}
                    </UserCodeTextBoxesContainer>
                    <ResendCodeText>Resend Code</ResendCodeText>
                </CodeandResendContainer>
                <VerifyBox>
                    <CentralButton buttonType={buttonTypeVerify} isEnabled={isVerify} onClick={handleSubmit} />
                </VerifyBox>
            </InnerBody>
        </OuterBody>
    );
}

export default Confirmation;