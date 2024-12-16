import React from 'react';
import { Paper, Box, Switch, Typography, CircularProgress, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';

const DebugPanelStyled = styled(Paper)(({ theme }) => ({
  height: 'auto',
  width: '100px',
  position: 'absolute',
  padding: '16px',
  borderRadius: '16px',
  boxSizing: 'border-box',
  bottom: '20px',
  right: '20px',
  zIndex: 10,
  backgroundColor: 'rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const DebugSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    backgroundColor: "#F0F0F0", // Unchecked thumb color
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#111111", // Unchecked track color
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: "#3958BF", // **Checked thumb color** (change to your desired color)
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111', // Track color when checked
  },
}));

export default function DebugAuth(){
  const [checked, setChecked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const handleLogin = async () => {
    
    setIsLoading(true);
    if (!checked){
      const response = await apiClients.auth.awsSignIn('debuguser', 'debugpassword123');
      console.log(response);
      apiClients.auth.verifyAuth().then((isAuth) => {
        if (isAuth) {
          console.log('User Login Confirmed')
          return setChecked(true);
        }
        console.log('User Login Failed');
        return setChecked(false);
      });
      setIsLoading(false);
      return;
    }
    setChecked(true);
    apiClients.auth.awsSignOut();
    setIsLoading(false);
  }

  const getIcon = () => {
    if (isLoading) 
      return <CircularProgress color="inherit" size="30px" />;
    if (checked)
      return <CheckCircleIcon style={{ color: "#000", height: '30px', width: '30px' }} />;
    return <ClearIcon style={{ color: "#000", height: '30px', width: '30px' }} />;
  }

  return (
    <DebugPanelStyled>
      <Typography style={{
        fontSize: '20px',
        fontWeight: 700,
        color: "#FFF"
      }}>Login:</Typography>
      <DebugSwitch checked={checked} onChange={handleLogin}/>      
      {getIcon()}
    </DebugPanelStyled>
  )
}