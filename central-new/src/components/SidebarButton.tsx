import React from 'react';
import { Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SidebarButtons } from '../lib/CentralModels';
import  sidebarButtonImage  from '../img/sidebarButtonImage.svg'

interface SidebarProps {
  buttonType: SidebarButtons
  handleButtonClick: (buttonType: SidebarButtons) => void;
}

export default function Sidebar({
  buttonType,
  handleButtonClick
}: SidebarProps) {
  const theme = useTheme();
  return (
      <Button sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center',  width: '100%', padding: '10px', textTransform: 'none' }} 
        onClick={() => handleButtonClick(buttonType)}
      >
        <img src={sidebarButtonImage} style={{
            padding: '10px',
            margin: '10px'
        }} alt="Explore" />
        <Typography style={{color: '#2D2D2D'}}>
          {buttonType}
        </Typography>
      </Button>
  );
}