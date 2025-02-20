import React, { useState } from 'react';
import { Typography, Box, useTheme, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  PublicPrivateType,
} from '@righton/networking';
import { CreateGameMainContainer, CreateGameBackground } from '../lib/styledcomponents/CreateGameStyledComponent';
import { 
  ScreenSize,
  CreateQuestionHighlightCard,
  TemplateType
} from '../lib/CentralModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ModalBackground from '../components/modal/ModalBackground';
import ImageUploadModal from '../components/modal/ImageUploadModal';
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
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(false);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  // const localData = useCreateQuestionLoader();
  
  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsImagePreviewVisible(false);
    setIsCreatingTemplate(false);
    setIsCCSSVisible(false);
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible || isCreatingTemplate || isCCSSVisible} handleCloseModal={handleCloseModal}/>
       {/* <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
       <ImageUploadModal 
          draftQuestion={draftQuestion} 
          screenSize={screenSize}  
          isModalOpen={isImageUploadVisible} 
          handleImageChange={handleImageChange}
          handleImageSave={handleImageSave} 
          handleCloseModal={handleCloseModal}
        /> */}
       <CreatingTemplateModal isModalOpen={isCreatingTemplate} templateType={TemplateType.QUESTION}/>
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
      </Box>
    </CreateGameMainContainer>
  );
}