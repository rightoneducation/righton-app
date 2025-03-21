import React, { useState } from 'react';
import { IUserProfile } from '@righton/networking';
import { useMatch } from 'react-router-dom';

import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';
import GoogleSignup from '../pages/GoogleSignup';

interface SignUpSwitchProps{
  userProfile: IUserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<IUserProfile>>;
  setIsTabsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignUpSwitch({
  userProfile,
  setUserProfile,
  setIsTabsOpen
}:SignUpSwitchProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isUserSubmitted, setIsUserSubmitted] = useState(false); // Track submission state
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(true); // Track submission state

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [step, setStep] = useState<'signup' | 'confirmation' | 'googlesignup'>('signup');
  const googlenextstep = useMatch('/nextstep') !== null;
  
  // Override step dynamically if googlenextstep is true
  const currentStep = googlenextstep ? 'googlesignup' : step;
  
  const handlerImageUpload = async (file: File) => {
    const fileName = file.name;
    const fileType = file.type;
  };
  
  switch (currentStep) {
    case 'confirmation':
      return (
        <Confirmation
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          frontImage={frontImage ?? new File([''], 'filename')}
          backImage={backImage ?? new File([''], 'filename')}
          handlerImageUpload={handlerImageUpload}
          setIsTabsOpen={setIsTabsOpen}
        />
      );
    case 'googlesignup':
      return (
        <GoogleSignup
          apiClients={apiClients}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          frontImage={frontImage}
          setFrontImage={setFrontImage}
          backImage={backImage}
          setBackImage={setBackImage}
        />
      );
    case 'signup':
    default:
      return (
        <SignUp
          apiClients={apiClients}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          handleUserCreate={() => setStep('confirmation')}
          frontImage={frontImage}
          setFrontImage={setFrontImage}
          backImage={backImage}
          setBackImage={setBackImage}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      );
  }
  
}
