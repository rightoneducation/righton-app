import React, { useState } from 'react';
import { Typography, Box, useTheme, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateGameMainContainer, CreateGameBackground } from '../lib/styledcomponents/CreateGameStyledComponent';
import { 
  ScreenSize,
  TemplateType
} from '../lib/CentralModels';
import ModalBackground from '../components/modal/ModalBackground';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';

type TitleTextProps = {
  screenSize: ScreenSize;
}

const TitleText = styled(Typography)<TitleTextProps>(({ theme, screenSize }) => ({
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize:
    screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
  paddingTop: `${theme.sizing.lgPadding}px`,
}));

interface CreateGameProps {
  screenSize: ScreenSize;
}

export default function CreateGame({
  screenSize
}:CreateGameProps){
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
       <ModalBackground isModalOpen={isModalOpen} handleCloseModal={handleCloseModal}/>
       <CreatingTemplateModal isModalOpen={isModalOpen} templateType={TemplateType.GAME}/>
       <Box style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: `${theme.sizing.lgPadding}px`,
          zIndex: 1,
          position: 'relative',
          paddingLeft: `${theme.sizing.mdPadding}px`,
          paddingRight: `${theme.sizing.mdPadding}px`,
          boxSizing: 'border-box',
        }}>
          <TitleText screenSize={ScreenSize.LARGE}>Create Game</TitleText>
          {/* TODO: complete game part of screen */}
      </Box>
    </CreateGameMainContainer>
  );
}