import React, { useState } from 'react';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';


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
    // const response = await apiClients.user.uploadTeacherId(file, fileName, fileType)
    // return response
  }

  const handleUserCreate = (user: string) => {
    setUserName(user);
    setIsUserSubmitted(true); // Trigger confirmation view
  };

  return isUserSubmitted ? (
    <Confirmation
      schoolEmail={schoolEmail}
      frontImage={frontImage} 
      backImage={backImage} 
      handlerImageUpload={handlerImageUpload}
      password={password}
    /> // Render confirmation page
  ) : (
    <SignUp
      handleUserCreate={handleUserCreate} 
      frontImage={frontImage} 
      setFrontImage={setFrontImage} 
      backImage={backImage} 
      setBackImage={setBackImage} 
      apiClients={apiClients} 
      password={password} 
      setPassword={setPassword}
      confirmPassword={confirmPassword} 
      setConfirmPassword={setConfirmPassword} 
      schoolEmail={schoolEmail} 
      setSchoolEmail={setSchoolEmail}
    /> // Render signup page
  );
}
