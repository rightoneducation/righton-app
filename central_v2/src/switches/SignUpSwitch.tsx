import React, { useState } from 'react';
import { IUserProfile } from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';

export default function SignUpSwitch() {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const blankUserProfile = {
    title: 'Title...',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  }
  const [userProfile, setUserProfile] = useState<IUserProfile>(blankUserProfile);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isUserSubmitted, setIsUserSubmitted] = useState(false); // Track submission state
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const handlerImageUpload = async (file: File) => {
    const fileName = file.name
    const fileType = file.type
    // const response = await apiClients.user.uploadTeacherId(file, fileName, fileType)
    // return response
  }

  const handleUserCreate = () => {
    setIsUserSubmitted(true); // Trigger confirmation view
  };

  return isUserSubmitted ? (
    <Confirmation
      userProfile={userProfile}
      frontImage={frontImage ?? new File([''], 'filename')} 
      backImage={backImage ?? new File([''], 'filename')} 
      handlerImageUpload={handlerImageUpload}
    />
  ) : (
    <SignUp
      apiClients={apiClients} 
      userProfile={userProfile}
      setUserProfile={setUserProfile}
      handleUserCreate={handleUserCreate} 
      frontImage={frontImage} 
      setFrontImage={setFrontImage} 
      backImage={backImage} 
      setBackImage={setBackImage} 
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
    />
  );
}
