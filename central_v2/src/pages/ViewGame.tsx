import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  IGameTemplate,
  PublicPrivateType,
} from '@righton/networking';
import { Box, Grid, CircularProgress, useTheme } from '@mui/material';
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
  UserStatusType,
} from '../lib/CentralModels';
import ViewQuestionCards from '../components/question/ViewQuestionCards';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import EditModal from '../components/modal/EditModal';  
import DeleteModal from '../components/modal/DeleteModal';
import ModalBackground from '../components/modal/ModalBackground';
import EditToolTip from '../components/tooltips/EditToolTip';

interface ViewGameProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: () => void;
}

export default function ViewGame({ 
  screenSize,
  fetchElement,
  fetchElements
}: ViewGameProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const route = useMatch('/games/:type/:gameId');
  const libRoute = useMatch('/library/games/:type/:gameId');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [draftGame, setDraftGame] = useState<IGameTemplate | null>(null);
  const questions = centralData.selectedGame?.game?.questionTemplates;

  const isEditEnabled = centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile?.id === centralData.selectedGame?.game?.userId;
  
  useEffect(() => {
    setIsLoading(false);
    if (centralData?.selectedGame?.game) {
      setDraftGame(centralData.selectedGame.game);
    }
    let id = '';
    if (route) 
      id = route?.params.gameId ?? '';
    else if (libRoute)
      id = libRoute?.params.gameId ?? '';
    if (!centralData.selectedGame || !centralData.selectedGame.game && id){
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, id);
    }
  }, [centralData.selectedGame, route ]); // eslint-disable-line 
  
  const handleLaunchGame = () => {
    const LAUNCH_GAME_URL = `http://dev-host.rightoneducation.com/new/Public/${centralData.selectedGame?.game?.id}`;
    window.location.href = LAUNCH_GAME_URL;
  };

  const handleCloneGame = () => {
    navigate(`/clone/game/${centralData.selectedGame?.game?.publicPrivateType}/${centralData.selectedGame?.game?.id}`);
  };

  const handleProceedToEdit = () => {
    navigate(`/edit/game/${centralData.selectedGame?.game?.publicPrivateType}/${centralData.selectedGame?.game?.id}`); 
  };

  const handleEditGame = () => {
    if (centralData.selectedGame?.game?.publicPrivateType === PublicPrivateType.PUBLIC) {
      setIsModalOpen(true);
    } else {
      handleProceedToEdit();
    }
  };

  const handleDeleteGame = () => {
    setIsDeleteModalOpen(true);
  }

  const handleProceedToDelete = async () => {
    try{
      if (centralData && centralData.selectedGame && centralData.selectedGame.game) {
        const gameQuestions = centralData?.selectedGame?.game?.questionTemplates?.map((item) => item.gameQuestionId) ?? [];
        const {game} = centralData.selectedGame;
        if (gameQuestions.length > 0 && game && game.publicPrivateType) {
          const gameQuestionPromises = gameQuestions.map(async (questionId) => {
            apiClients.gameQuestions.deleteGameQuestions(
              game.publicPrivateType,
              questionId
            );
          });
          await Promise.all(gameQuestionPromises);
        }
        await apiClients.gameTemplate.deleteGameTemplate(game.publicPrivateType, centralData.selectedGame.game.id);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
    setIsDeleteModalOpen(false);
    centralDataDispatch({type: 'SET_SELECTED_GAME', payload: null});
    fetchElements();
    centralDataDispatch({type: 'SET_SEARCH_TERMS', payload: null})
    navigate('/');
  }

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
  };

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleBackClick = () => {
    if (libRoute) {
      navigate('/library');
    } else {
      navigate('/');
    }
  }

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      <ModalBackground
        isModalOpen={isModalOpen || isDeleteModalOpen}
        handleCloseModal={handleCloseEditModal}
      />
      <EditModal
        isModalOpen={isModalOpen}
        gameQuestion={GameQuestionType.GAME}
        setIsModalOpen={setIsModalOpen}
        handleProceedToEdit={handleProceedToEdit}
      />
      <DeleteModal
        isModalOpen={isDeleteModalOpen}
        gameQuestion={GameQuestionType.GAME}
        setIsModalOpen={setIsDeleteModalOpen}
        handleProceedToDelete={handleProceedToDelete}
      />
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
            { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
              <Box style={{
                width: '100%', 
                maxWidth: '672px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: `${theme.sizing.xSmPadding}px`, 
                paddingBottom: '16px',
              }}>
                 <CentralButton buttonType={ButtonType.BACK} isEnabled onClick={handleBackClick} smallScreenOverride buttonWidthOverride='275px'/>
                 {centralData.userStatus === UserStatusType.LOGGEDIN &&
                  <>
                    <CentralButton buttonType={ButtonType.CLONE} isEnabled onClick={handleCloneGame} smallScreenOverride buttonWidthOverride='275px'/>
                    <EditToolTip isEditEnabled={isEditEnabled} isOnQuestionTab={false}>
                      <CentralButton 
                        buttonType={ButtonType.EDIT} 
                        isEnabled={isEditEnabled}
                        onClick={handleEditGame} 
                        smallScreenOverride
                        buttonWidthOverride='275px'
                      />
                    </EditToolTip>
                    <EditToolTip isEditEnabled={isEditEnabled} isOnQuestionTab={false}>
                      <CentralButton 
                        buttonType={ButtonType.DELETE} 
                        isEnabled={isEditEnabled}
                        onClick={handleDeleteGame} 
                        smallScreenOverride
                        buttonWidthOverride='275px'
                      />
                    </EditToolTip>
                  </>
                 }
              </Box>
            }
            <CreateGameGridContainer container wrap="nowrap">
               <Grid
                  sm
                  md={1}
                  lg={4}
                  item
                  style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '16px', gap: '20px'}}
                >
                  { (screenSize !== ScreenSize.SMALL && screenSize !== ScreenSize.MEDIUM) &&
                    <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
                      <CentralButton buttonType={ButtonType.BACK} isEnabled onClick={handleBackClick}/>
                      { centralData.userStatus === UserStatusType.LOGGEDIN &&
                        <>
                          <CentralButton buttonType={ButtonType.CLONE} isEnabled onClick={handleCloneGame} smallScreenOverride/>
                            <EditToolTip isEditEnabled={isEditEnabled} isOnQuestionTab={false}>
                              <Box style={{width: '100%'}}>
                                <CentralButton 
                                  buttonType={ButtonType.EDIT} 
                                  isEnabled={isEditEnabled}
                                  onClick={handleEditGame} 
                                  smallScreenOverride
                                  buttonWidthOverride='275px'
                                />
                              </Box>
                            </EditToolTip>
                            <EditToolTip isEditEnabled={isEditEnabled} isOnQuestionTab={false}>
                              <Box style={{width: '100%'}}>
                                <CentralButton 
                                  buttonType={ButtonType.DELETE} 
                                  isEnabled={isEditEnabled}
                                  onClick={handleDeleteGame} 
                                  smallScreenOverride
                                  buttonWidthOverride='275px'
                                />
                              </Box>
                            </EditToolTip> 
                        </>
                      }
                    </Box>
                  }
                </Grid>
              <CreateGameCardGridItem
                item
                sm={12}
                md={10}
                lg={4}
                screenSize={screenSize}
                style={{
                  width: '100%',
                  maxWidth: '672px',
                  minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${theme.sizing.xLgPadding}px`,
                }}
              >
                  <DetailedGameCardBase 
                    screenSize={screenSize}
                    game={centralData.selectedGame.game}
                    dropShadow
                  />
                </CreateGameCardGridItem>
                 <Grid  
                          sm
                          md={1}
                          lg={4} item />
            </CreateGameGridContainer>
            <Box style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <GameCreateButtonStack sx={{ 
                ...(screenSize === ScreenSize.SMALL && { flexDirection: 'column'})
              }}>
                <CentralButton
                  smallScreenOverride
                  buttonWidthOverride='100%'
                  buttonType={ButtonType.LAUNCHGAME}
                  isEnabled={questions !== null && questions !== undefined && questions.length > 0}
                  onClick={handleLaunchGame}
                />
              </GameCreateButtonStack>
              <GameCreateButtonStack sx={{
                maxWidth: '100%',
                overflow: 'scroll',
                minHeight: '40px',
                '&::-webkit-scrollbar': {
                // Chrome and Safari
                display: 'none',
                },
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none',
              }}>
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
