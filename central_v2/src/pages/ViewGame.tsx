import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  IGameTemplate,
  PublicPrivateType,
} from '@righton/networking';
import { Box, CircularProgress, useTheme } from '@mui/material';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';
import DetailedGameCardBase from '../components/cards/detailedgame/DetailedGameCardBase';
import ManageQuestionsButtons from '../components/button/managequestionsbutton/ManageQuestionButtons';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  CreateGameGridContainer,
  CreateGameCardGridItem,
  GameCreateButtonStack,
  TitleText,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  GameQuestionType,
  ScreenSize,
} from '../lib/CentralModels';
import ViewQuestionCards from '../components/question/ViewQuestionCards';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';

interface ViewGameProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
}

export default function ViewGame({ 
  screenSize,
  fetchElement
}: ViewGameProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const route = useMatch('/games/:gameId');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [draftGame, setDraftGame] = useState<IGameTemplate | null>(null);
  const questions = centralData.selectedGame?.questionTemplates;

  useEffect(() => {
    setIsLoading(false);
    if (centralData.selectedGame) {
      setDraftGame(centralData.selectedGame);
    }
    const id = route?.params.gameId;
    if (!centralData.selectedGame && id){
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, id);
    }

  }, [centralData.selectedGame, route ]); // eslint-disable-line 

  const handleLaunchGame = () => {
    const LAUNCH_GAME_URL = `http://dev-host.rightoneducation.com/new/Public/${centralData.selectedGame?.id}`;
    window.location.href = LAUNCH_GAME_URL;
  };

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      { isLoading ?
          <Box style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress
              style={{ color: `${theme.palette.primary.circularProgress}` }}
            />
          </Box>
        :
         centralData.selectedGame &&
          <CreateGameBoxContainer>
            <TitleText screenSize={screenSize}>View Game</TitleText>
            <CreateGameGridContainer container wrap="nowrap">
              <CreateGameCardGridItem
                item
                sm={12}
                md={10}
                lg={4}
                screenSize={screenSize}
              >
                  <DetailedGameCardBase 
                    screenSize={screenSize}
                    game={centralData.selectedGame}
                    dropShadow
                  />
                </CreateGameCardGridItem>
            </CreateGameGridContainer>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <GameCreateButtonStack sx={{ 
                ...(screenSize === ScreenSize.SMALL && { flexDirection: 'column'})
              }}>
                <CentralButton
                  smallScreenOverride
                  buttonWidthOverride='100%'
                  buttonType={ButtonType.LAUNCHGAME}
                  isEnabled
                  onClick={handleLaunchGame}
                />
              </GameCreateButtonStack>
              <GameCreateButtonStack>
                <ManageQuestionsButtons 
                  questions={questions ?? []}
                  iconButtons={iconButtons}
                  isCreate={false}
                  selectedIndex={selectedQuestionIndex}
                  setSelectedIndex={handleQuestionIndexChange}
                />
              </GameCreateButtonStack>
            </Box>
            {questions && questions.map(
              (question, index) =>
                index === selectedQuestionIndex && (
                  <ViewQuestionCards isViewGame screenSize={screenSize} question={question.questionTemplate}/>
                ),
            )}
        </CreateGameBoxContainer>
      }
    </CreateGameMainContainer>
  );
}
