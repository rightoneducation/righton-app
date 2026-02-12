import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { IGameTemplate, IQuestionTemplate, PublicPrivateType, TemplateType } from '@righton/networking';
import { Box, CircularProgress, useTheme, Fade } from '@mui/material';
import DetailedGameCardBase from '../components/cards/detailedgame/DetailedGameCardBase';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  QuestionHeaderText,
  CreateGameContentContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import ViewGameHeader from '../components/game/ViewGameHeader';
import {
  GameQuestionType,
  ScreenSize,
  UserStatusType,
  TemplateType as GameTemplateType,
} from '../lib/CentralModels';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import EditGameModal from '../components/modal/EditGameModal';
import DeleteModal from '../components/modal/DeleteModal';
import ModalBackground from '../components/modal/ModalBackground';
import OwnerTag from '../components/profile/OwnerTag';
import ViewQuestionCardUnified from '../components/question/ViewQuestionCardUnified';

interface ViewGameProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: () => void;
}

export default function ViewGame({
  screenSize,
  fetchElement,
  fetchElements,
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
  const isEditEnabled =
    centralData.userStatus === UserStatusType.LOGGEDIN &&
    centralData.userProfile?.id === centralData.selectedGame?.game?.userId;
  const isGameLaunchable =
    (centralData.selectedGame &&
      centralData.selectedGame.game &&
      centralData.selectedGame.game.questionTemplates &&
      centralData.selectedGame.game.questionTemplates?.length > 0 &&
      centralData.selectedGame.game.title.length > 0 && 
      centralData.selectedGame.game.description.length > 0 &&
      centralData.selectedGame.game.imageUrl &&
      centralData.selectedGame.game.phaseOneTime > 0 &&
      centralData.selectedGame.game.phaseTwoTime > 0 )
      ??
    false;
  const isOwner = centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile?.id === centralData.selectedGame?.game?.userId;
  const isIncompleteDraft = centralData.selectedGame?.game?.publicPrivateType === PublicPrivateType.DRAFT && !isGameLaunchable;
  const allQuestions = [...(centralData.selectedGame?.game?.questionTemplates ?? [])];

  useEffect(() => {
    setIsLoading(false);
    if (centralData?.selectedGame?.game) {
      setDraftGame(centralData.selectedGame.game);
    }
    let id = '';
    if (route) id = route?.params.gameId ?? '';
    else if (libRoute) id = libRoute?.params.gameId ?? '';
    if (!centralData.selectedGame || (!centralData.selectedGame.game && id)  || (centralData.selectedGame?.game?.id !== id)) {
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, id);
    }
  }, [centralData.selectedGame, route]); // eslint-disable-line

  const handleLaunchGame = () => {
    const LAUNCH_GAME_URL = `http://dev-host.rightoneducation.com/new/${centralData.selectedGame?.game?.publicPrivateType}/${centralData.selectedGame?.game?.id}`;
    window.location.href = LAUNCH_GAME_URL;
  };

  const handleCloneGame = () => {
    navigate(
      `/clone/game/${centralData.selectedGame?.game?.publicPrivateType}/${centralData.selectedGame?.game?.id}`,
    );
  };

  const handleProceedToEdit = () => {
    console.log("HERE")
    navigate(
      `/edit/game/${centralData.selectedGame?.game?.publicPrivateType}/${centralData.selectedGame?.game?.id}`,
    );
  };

  const handleEditGame = () => {
      handleProceedToEdit();
  };

  const handleProceedToDelete = async () => {
    try {
      if (
        centralData &&
        centralData.selectedGame &&
        centralData.selectedGame.game
      ) {
        const gameQuestions =
          centralData?.selectedGame?.game?.questionTemplates?.map(
            (item) => item.gameQuestionId,
          ) ?? [];
        const { game } = centralData.selectedGame;
        if (gameQuestions.length > 0 && game && game.publicPrivateType) {
          const gameQuestionPromises = gameQuestions.map(async (questionId) => {
            apiClients.gameQuestions.deleteGameQuestions(
              game.publicPrivateType,
              questionId,
            );
          });
          await Promise.all(gameQuestionPromises);
        }
        await apiClients.gameTemplate.deleteGameTemplate(
          game.publicPrivateType as TemplateType,
          centralData.selectedGame.game.id,
        );
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
    setIsDeleteModalOpen(false);
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: null });
    fetchElements();
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: null });
    navigate('/');
  };

  const handleDeleteGame = () => {
    if (
      centralData.selectedGame?.game?.publicPrivateType ===
      PublicPrivateType.PUBLIC
    ) {
      setIsDeleteModalOpen(true);
    } else {
      handleProceedToDelete();
    }
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
  };

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleFavoriteClick = async () => {
    const response = await apiClients.centralDataManager?.favoriteGameTemplate(
      centralData.selectedGame?.game?.id ?? '',
      centralData.userProfile,
    );
    if (response) {
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: response });
    }
  };

  const handleBackClick = () => {
    if (libRoute) {
      navigate(`/library/games/${centralData.selectedGame?.game?.publicPrivateType}`);
    } else {
      navigate('/');
    }
  };
  const handleDuplicate = () => {
    if (libRoute) {
      navigate('/library');
    } else {
      navigate('/');
    }
  };

  return (
    <CreateGameMainContainer screenSize={screenSize}>
      <CreateGameBackground />
      <ModalBackground
        isModalOpen={isModalOpen || isDeleteModalOpen}
        handleCloseModal={handleCloseEditModal}
      />
      <EditGameModal
        isModalOpen={isModalOpen}
        templateType={GameTemplateType.GAME}
        handleSaveEditedGame={handleProceedToEdit}
        handleCloseSaveGameModal={handleCloseEditModal}
        isCardErrored={false}
      />
      {isLoading ? (
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress
            style={{ color: `${theme.palette.primary.circularProgress}` }}
          />
        </Box>
      ) : (
        centralData.selectedGame && (
          <CreateGameContentContainer>
            <ViewGameHeader isOwner={isOwner} isIncompleteDraft={isIncompleteDraft} handleCloneGame={handleCloneGame} handleDuplicate={handleDuplicate}handleBackClick={handleBackClick} handleEditGame={handleEditGame} handleLaunchGame={handleLaunchGame} handleFavoriteClick={handleFavoriteClick} label="View" screenSize={screenSize} />
            <CreateGameBoxContainer screenSize={screenSize}>
            <Box style={{ width: '100%', maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '410px', display: 'flex', flexDirection: 'column',  gap: `${theme.sizing.smPadding}px` }}>
              <DetailedGameCardBase
                screenSize={screenSize}
                game={centralData.selectedGame.game}
                dropShadow
              />
              <OwnerTag
                screenSize={screenSize}
                isViewGame
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: `${theme.sizing.lgPadding}px`,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <QuestionHeaderText>
                  Questions
                </QuestionHeaderText>
              </Box>
              <Box 
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: `${theme.sizing.lgPadding}px`,
                }}
              >
                {/* Create Question Form(s)  */}
                {allQuestions?.filter((questionItem) => questionItem.questionTemplate).map((questionItem, index) => {
                  return (
                    <Fade
                      timeout={500}
                      in
                      mountOnEnter
                      unmountOnExit
                      key={`Question--${index + 1}`}
                      style={{
                        width: '100%',
                        marginRight: '10px',
                      }}
                    >
                      <Box>
                        <ViewQuestionCardUnified
                          screenSize={screenSize}
                          questionTemplate={questionItem.questionTemplate as IQuestionTemplate}
                          handleRemoveQuestion={() => {}}
                          isViewGame
                          isCreateGame={false}
                        />
                      </Box>
                    </Fade>
                  );
                })}
              </Box>
            </Box>
          </CreateGameBoxContainer>
        </CreateGameContentContainer>
      )
    )}
    </CreateGameMainContainer>
  );
}
