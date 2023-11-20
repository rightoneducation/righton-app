import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SidebarButtons } from '../lib/CentralModels';
import SidebarButton from './SidebarButton';
import SidebarStyled from '../lib/styledcomponents/layout/SiderbarStyled';
import RightOnLogo from '../img/rightOnLogo.svg';

interface SidebarProps {
  handleButtonClick: (buttonText: SidebarButtons) => void;
}

export default function Sidebar({
  handleButtonClick
}: SidebarProps) {
  const theme = useTheme();
  return (
    <SidebarStyled>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', background: '#2D2D2D', height: '100px', width: '100%', padding: '10px', }} >
        <img src={RightOnLogo} style={{
            width: '50%',
            padding: '10px',
            margin: '10px'
        }} alt="Right On" />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
       <SidebarButton buttonType={SidebarButtons.GLOBAL_GAMES} handleButtonClick={handleButtonClick}/>
       <SidebarButton buttonType={SidebarButtons.GLOBAL_QUESTIONS} handleButtonClick={handleButtonClick}/>
       <SidebarButton buttonType={SidebarButtons.CREATE_GLOBAL_GAME} handleButtonClick={handleButtonClick}/>
       <SidebarButton buttonType={SidebarButtons.CREATE_GLOBAL_QUESTION} handleButtonClick={handleButtonClick}/>
      </Box>
    </SidebarStyled>
  );
}
