import React, { useState } from 'react';
import { IUserProfile } from '@righton/networking';
import { useMatch } from 'react-router-dom';

import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';
import GoogleSignup from '../pages/GoogleSignup';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';

interface SignUpSwitchProps{
  setIsTabsOpen: (isOpen: boolean) => void;
  checkForUniqueEmail: (email: string) => Promise<boolean>;
}

export default function SignUpSwitch({
  setIsTabsOpen,
  checkForUniqueEmail,
}:SignUpSwitchProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [step, setStep] = useState<'signup' | 'confirmation' | 'googlesignup'>('signup');
  const googlenextstep = useMatch('/nextstep') !== null;
  
  // Override step dynamically if googlenextstep is true
  const centralData = useCentralDataState();

  console.log("central data signup switch: ", centralData)
  const getCurrentStep = () => {
    switch (centralData.userStatus) {
      case UserStatusType.GOOGLE_SIGNUP:
        return 'googlesignup';
      case UserStatusType.NONVERIFIED:
        return 'confirmation';
      default:
        return step;
    }
  };

  const currentStep = getCurrentStep();
  console.log("Currentstep: ", currentStep)

  const handlerImageUpload = async (file: File) => {
    const fileName = file.name;
    const fileType = file.type;
  };
  
  switch (currentStep) {
    case 'confirmation':
      return (
        <Confirmation
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
          centralData={centralData}
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
          handleUserCreate={() => setStep('confirmation')}
          frontImage={frontImage}
          setFrontImage={setFrontImage}
          backImage={backImage}
          setBackImage={setBackImage}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          checkForUniqueEmail={checkForUniqueEmail}
        />
      );
  }
  
}
