import React, { useState } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DebugAuth from '../components/debug/DebugAuth';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { CreateQuestionTemplateInput, ScreenSize, BorderStyle, CreateQuestionErrorCheck } from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import CCSSTabsModalBackground from '../components/ccsstabs/CCSSTabsModalBackground';
import IncorrectAnswerCardStack from '../components/cards/createquestion/stackedcards/IncorrectAnswerCardStack';
import ModalBackground from '../components/modal/ModalBackground';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import ImageURLModal from '../components/modal/ImageURLModal';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

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
}));

const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const AISwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    background: theme.palette.primary.aiGradient,
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#111111",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
}));

interface CreateQuestionProps {
  screenSize: ScreenSize;
}

export default function CreateQuestion({
  screenSize
}:CreateQuestionProps){
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [incorrectAnswers, setIncorrectAnswers] = useState(['','','']);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(false);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [ccss, setCCSS] = useState<string>('CCSS');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [draftQuestion, setDraftQuestion] = useState<CreateQuestionTemplateInput>({
    title: '',
    image: null,
    correctAnswer: '',
    correctAnswerSteps: [],
    incorrectAnswers: [],
    ccss: 'CCSS'
  });
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  };
  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  }

  const handleImageURLClick = () => {
    setIsImageURLVisible(true);
  }

  const handleImageSave = (inputImage: File) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    console.log('here');
    console.log(inputImage);
    if (inputImage){
      setDraftQuestion((prev) => ({...prev, image: inputImage}));
    }
  }

  const handleTitleChange = (title: string) => {
    if (draftQuestion && title)
      setDraftQuestion((prev) => ({...prev, title}));
  }

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
  }

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestion((prev) => ({...prev, ccss: ccssString}));
    setIsCCSSVisible(false);
  };

  const handleClick = (cardType: string) => {
    setSelectedCard(cardType);
  };

  const verifyQuestionCard = () => {
    if (!draftQuestion.image || !draftQuestion.ccss || !draftQuestion.title)
      return false;
    return true;
  };

  const verifyCorrectAnswerCard = () => {
    
  }

  const handleSaveQuestion = () => {
    try {
      const isQuestionVerified = verifyQuestionCard();
      setIsCardSubmitted(true);
      if (draftQuestion.image && isQuestionVerified) {
        apiClients.questionTemplate.storeImageInS3(draftQuestion.image);
        navigate('/questions');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleDiscardQuestion = () => {
    navigate('/questions');
  }

  return (
    <CreateQuestionMainContainer>
       
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible} handleCloseModal={handleCloseModal}/>
       <ImageUploadModal screenSize={screenSize} isModalOpen={isImageUploadVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} borderStyle={BorderStyle.SVG}/>
       <ImageURLModal isModalOpen={isImageURLVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} />
      <>
        <CCSSTabsModalBackground
          isTabsOpen={isCCSSVisible}
          handleBackToExplore={handleBackToExplore}
        />
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
      </>
      <TitleText screenSize={ScreenSize.LARGE}>Create Question</TitleText>
      <CreateQuestionGridContainer container >
        { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingBottom: '16px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled smallScreenOverride onClick={handleDiscardQuestion} />
            </Box>
          }
        <Grid
          sm
          md
          item
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: '16px'}}
        >
          { (screenSize !== ScreenSize.SMALL && screenSize !== ScreenSize.MEDIUM) &&
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled onClick={handleDiscardQuestion} />
            </Box>
          }
        </Grid>
        <Grid
          sm={12}
          item
          style={{
            width: '100%',
            maxWidth: '672px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
          }}
        >
          <Box onClick={() => handleClick('CreateQuestionCard')} style={{ width: '100%' }}>
            <CreateQuestionCardBase
              screenSize={screenSize}
              draftQuestion={draftQuestion}
              handleTitleChange={handleTitleChange}
              handleCCSSClick={handleCCSSClick}
              isSelected={selectedCard==='CreateQuestionCard'}
              handleImageUploadClick={handleImageUploadClick}
              handleImageURLClick={handleImageURLClick}
              isCardSubmitted={isCardSubmitted}
            />
          </Box>
          <Grid
            container
            spacing={`${theme.sizing.smPadding}px`}
          >
            <SubCardGridItem 
              item
              sm={12}
              md={6}
            >
              <Box onClick={() => handleClick('CorrectAnswerCard')} style={{ width: '100%' }}>
                <CorrectAnswerCard isSelected={selectedCard === 'CorrectAnswerCard'} setSelectedCard={setSelectedCard}/>
              </Box>
            </SubCardGridItem>
            <SubCardGridItem
              item
              sm={12}
              md={6}
            >
              <Box style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                <Typography style={{textAlign: 'right', fontWeight: 500}}>
                  Try our AI-Generated Wrong Answer Explanation Prototype
                </Typography>
                <AISwitch/>
              </Box>
              <Box onClick={() => handleClick('IncorrectAnswerCard')} style={{ width: '100%' }}>
                <IncorrectAnswerCardStack isSelected={selectedCard === 'IncorrectAnswerCard'}/>
              </Box>
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}