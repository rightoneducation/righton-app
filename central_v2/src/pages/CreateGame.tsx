import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CentralQuestionTemplateInput,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection
} from '@righton/networking';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import ViewQuestionCards from '../components/question/ViewQuestionCards';
import {
  CreateQuestionHighlightCard,
  LibraryTabEnum,
  ScreenSize,
  StorageKey,
  TemplateType,
} from '../lib/CentralModels';
import { 
  TGameTemplateProps, 
  TDraftQuestionsList, 
  draftTemplate, 
  TPhaseTime, 
  newGameTemplate, 
  gameTemplate,
  emptyQuestionTemplate } from '../lib/CreateGameModels';
import ModalBackground from '../components/modal/ModalBackground';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import LibraryTabsQuestions from '../components/librarytabs/LibraryTabsQuestions';
import tabExploreQuestionsIcon from '../images/tabPublic.svg';
import tabMyQuestionsIcon from '../images/tabMyQuestions.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';
import { 
  updateGameTitle, 
  updateGameDescription, 
  updateGameTemplatePhaseTime, 
  updatePhaseTime,
  toggleCreateQuestion,
  toggleQuestionBank,
  updateGameImageChange,
  updateGameImageSave,
  createGameTemplate,
  checkGameFormIsValid,
  createGameQuestion
  } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
  import { 
    checkDQsAreValid, 
    createNewQuestionTemplates,
    updatePublicPrivateAtIndex,
    updateAIIsEnabledAtIndex,
    updateQuestionImageChangeAtIndex,
    updateQuestionImageSaveAtIndex,
    updateQuestionTitleChangeAtIndex,
    updateCorrectAnswerAtIndex,
    updateCorrectAnswerStepsAtIndex,
    updateQuestionAnswerTypeAtIndex,
    updateCloseQuestionModelAtIndex, 
    handleCardClickAtIndex,
    updateCCSSAtIndex,
    updateNextButtonClickAtIndex,
    updateIncorrectCardStackAtIndex,
    updateCCSSClickAtIndex,
    updateAIErrorAtIndex,
    updateImageUploadClickAtIndex,
    openModalAtIndex,
    buildLibraryQuestionAtIndex,
    updateDraftListWithLibraryQuestion, 
  } from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';


interface CreateGameProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: (libraryTab?: LibraryTabEnum) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  loadMore: () => void;
}

// Library Questions
const tabMap: { [key: number]: string } = {
  [LibraryTabEnum.PUBLIC]: 'Explore Questions',
  [LibraryTabEnum.PRIVATE]: 'My Questions',
  [LibraryTabEnum.FAVORITES]: 'Favorites',
};

const tabIconMap: { [key: number]: string } = {
  [LibraryTabEnum.PUBLIC]: tabExploreQuestionsIcon,
  [LibraryTabEnum.PRIVATE]: tabMyQuestionsIcon,
  [LibraryTabEnum.FAVORITES]: tabFavoritesIcon,
};

export default function CreateGame({ 
  screenSize,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSearchChange,
  handleSortChange,
  loadMore,
 }: CreateGameProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const navigate = useNavigate();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    TDraftQuestionsList[]
  >([draftTemplate]);
  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });

  const openModal = openModalAtIndex(draftGame, draftQuestionsList, selectedQuestionIndex);
  const gameFormIsValid = checkGameFormIsValid(draftGame);
  const allDQAreValid = checkDQsAreValid(draftQuestionsList);

  /** CREATE GAME HANDLERS START HERE */
  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => updateGameTitle(prev, val));
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => updateGameDescription(prev, val));
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    setDraftGame((prev) => updateGameTemplatePhaseTime(prev, time));
    setPhaseTime((prev) => updatePhaseTime(time));
  };

  const handleOpenCreateQuestion = () => {
    setDraftGame((prev) => toggleCreateQuestion(prev, gameFormIsValid));
  };

  const handleOpenQuestionBank = () => {
    setDraftGame((prev) => toggleQuestionBank(prev, gameFormIsValid));
  };

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setDraftGame((prev) => ({ ...prev, publicPrivateGame: value, }));
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {
    setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: !prev.isGameImageUploadVisible, }));
  };

  const handleCloseGameCardModal = () => {
    setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false, }));
  };

  const handleGameImageSave = async (inputImage?: File, inputUrl?: string) => {
    setDraftGame((prev) => updateGameImageSave(prev, inputImage, inputUrl));
  };

  const handleGameImageChange = async (inputImage?: File, inputUrl?: string,) => {
   setDraftGame((prev) => updateGameImageChange(prev, inputImage, inputUrl))
  };

  const handleSaveGame = async () => {
    try {
     
      setDraftGame((prev) => ({ ...prev, isGameCardSubmitted: true, isCreatingTemplate: true }));
      // check that the game form and question form is valid
      if (gameFormIsValid && allDQAreValid) {
        // check if user added image or image url
        let gameImgUrl: string | null = null;
        if (draftGame.image || draftGame.imageUrl) {
          let gameImgResult = null;
          // handle case for image type: File
          if (draftGame.image) {
            const gameImg = await apiClients.gameTemplate.storeImageInS3(
              draftGame.image,
            );
            gameImgResult = await gameImg.result;
            if (gameImgResult && gameImgResult.path && gameImgResult.path.length > 0) {
              gameImgUrl = gameImgResult.path;
            }
            // handle case for imageUrl type: string
          } else if (draftGame.imageUrl) {
            gameImgUrl = await apiClients.gameTemplate.storeImageUrlInS3(
              draftGame.imageUrl,
            );
          }
        }
          // create game template and store in variable to retrieve id after response
          const createGame = createGameTemplate(draftGame, draftQuestionsList, gameImgUrl);

          const gameTemplateResponse =
            await apiClients.gameTemplate.createGameTemplate(
              draftGame.publicPrivateGame,
              createGame,
            );

          // convert questions to array of promises
          const newQuestionTemplates = createNewQuestionTemplates(draftQuestionsList, apiClients);

          // write new questions to db
          const questionTemplateResponse =
            await Promise.all(newQuestionTemplates);

          // create an array of all the ids from the response and store in variable
          const questionTemplateIds = questionTemplateResponse.map(
            (question) => question?.id,
          );

          // make sure we have a gameTemplate id as well as question template ids before creating a game question
          if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
            const createGameQuestions = questionTemplateIds.map(
              async (questionId, i) => {
                const gameQuestion = createGameQuestion(draftGame, String(gameTemplateResponse.id), String(questionId));
               console.log("Game Question: ", gameQuestion)
              try {
                const response = await apiClients.gameQuestions.createGameQuestions(
                  draftGame.publicPrivateGame,
                  gameQuestion,
                );
                console.log(`${draftGame.publicPrivateGame}GameQuestion response`, response);
              } catch(err) {
                setDraftGame((prev) => ({...prev, isCreatingTemplate: false}))
                console.error(`Failed to create game question at index ${i}:`, err);
              }
              },
            );
            // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
              await Promise.all(createGameQuestions);
          }
          setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false, isGameCardSubmitted: false }));
          navigate('/');
      } else {
        // set draft game error
        setDraftGame((prev) => ({ ...prev, isGameCardErrored: true, isCreatingTemplate: false }));
      }
    } catch (err) {
      console.log(`HandleSaveGame - error: `, err);
    }
  };
  /** END OF CREATE GAME HANDLERS  */

  /** CREATE QUESTION HANDLERS START */
  const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
    setDraftQuestionsList((prev) => updatePublicPrivateAtIndex(prev, value, selectedQuestionIndex));
  };

  const handleAIIsEnabled = () => {
    setDraftQuestionsList((prev) => updateAIIsEnabledAtIndex(prev, selectedQuestionIndex));
  };

  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((prev) => updateQuestionImageChangeAtIndex(
      prev,
      selectedQuestionIndex,
      inputImage,
      inputUrl
    ));
  };

  const handleImageSave = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((prev) => updateQuestionImageSaveAtIndex(
      prev,
      selectedQuestionIndex,
      inputImage,
      inputUrl
    ));
  };

  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    (title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      setDraftQuestionsList((prev) => updateQuestionTitleChangeAtIndex(
        prev,
        selectedQuestionIndex,
        title
      ));
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerChange = useCallback(// eslint-disable-line
    (
      correctAnswer: string,
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      setDraftQuestionsList((prev) => updateCorrectAnswerAtIndex(
        prev,
        selectedQuestionIndex,
        correctAnswer
      ));
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerStepsChange = useCallback(// eslint-disable-line
    (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      setDraftQuestionsList((prev) => updateCorrectAnswerStepsAtIndex(
        prev,
        selectedQuestionIndex,
        steps,
      ));
    },
    [selectedQuestionIndex],
  );

  const handleAnswerType = () => {
    setDraftQuestionsList((prev) => updateQuestionAnswerTypeAtIndex(prev, selectedQuestionIndex));
  };

  const handleCloseQuestionModal = () => {
    if (draftGame.isGameImageUploadVisible) {
      setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
    }
    setDraftQuestionsList((prev) => updateCloseQuestionModelAtIndex(prev, selectedQuestionIndex));
  };

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    setDraftQuestionsList((prev) => handleCardClickAtIndex(prev, selectedQuestionIndex, cardType));
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestionsList((prev) => updateCCSSAtIndex(prev, selectedQuestionIndex, ccssString))
  };

  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    setDraftQuestionsList((prev) => updateNextButtonClickAtIndex(
      prev, 
      selectedQuestionIndex,
      cardData,
    ))
  };

  const handleIncorrectCardStackUpdate = (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => {
    setDraftQuestionsList((prev) => updateIncorrectCardStackAtIndex(
      prev,
      selectedQuestionIndex,
      cardData,
      completeAnswers,
      incompleteAnswers,
      isAIEnabledCard
    ))
  };

  const handleCCSSClicks = () => {
    setDraftQuestionsList((prev) => updateCCSSClickAtIndex(prev, selectedQuestionIndex));
  };

  const handleAIError = () => {
    setDraftQuestionsList((prev) => updateAIErrorAtIndex(prev, selectedQuestionIndex));
  };

  const handleQuestionImageUploadClick = () => {
    setDraftQuestionsList((prev) => updateImageUploadClickAtIndex(prev, selectedQuestionIndex));
  };

  const handleSaveQuestion = async () => {
    try {
      // Make sure all cards are completed for question.
      if (!allDQAreValid) {
        return;
      }
      // process valid questions in order
      const questionTemplate = createNewQuestionTemplates(draftQuestionsList, apiClients)
      await Promise.all(questionTemplate);

      // Reset data and re-direct user
      setDraftQuestionsList([]);

      navigate('/');
    } catch (err) {
 
      console.error('Error during save process:', err);
    }
  };

  /** END OF CREATE QUESTION HANDLERS  */

  /** LIBRARY HANDLER HELPERS */
  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE) return value;
    if (screen === ScreenSize.MEDIUM && isSelected) return value;
    return '';
  };

  const handleView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setIsTabsOpen(true);

    console.log("Library Question: ", question);
   setDraftQuestionsList((prev) => {
    const libraryQuestion = buildLibraryQuestionAtIndex(question);
    const { updatedList, addNew } = updateDraftListWithLibraryQuestion(
      prev,
      selectedQuestionIndex,
      libraryQuestion,
    );
    setDraftGame((prevGame) => ({
      ...prevGame,
      openQuestionBank: false,
      openCreateQuestion: true,
      ...(addNew && { questionCount: prevGame.questionCount + 1 })
    }));
    setIconButtons((prevButtons) => addNew ? [...prevButtons, prevButtons.length + 1] : prevButtons);
    return updatedList;
   })
  };

  /** LIBRARY HANDLER HELPERS */

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, draftTemplate]);
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount + 1,
    }));
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

    useEffect(() => {
      console.log("Draft Game:", draftGame)
      console.log("Questions List:", draftQuestionsList);
      console.log("Selected Index:", selectedQuestionIndex);
      console.log("Selected Question:", draftQuestionsList[selectedQuestionIndex]);
    }, [draftQuestionsList, selectedQuestionIndex, draftGame]);

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal}
        handleCloseModal={handleCloseQuestionModal}
      />

      <CreatingTemplateModal
        isModalOpen={draftGame.isCreatingTemplate}
        templateType={TemplateType.GAME}
      />

      {/* tracks ccss state according to index */}
      {draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal && (
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={
            draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal
          }
          handleCCSSSubmit={handleCCSSSubmit}
          ccss={
            draftQuestionsList[selectedQuestionIndex].question.questionCard
              .ccss ?? ''
          }
        />
      )}

      {/* open modals according to correct index */}
      <ImageUploadModal
        draftQuestion={draftQuestionsList[selectedQuestionIndex].question}
        screenSize={screenSize}
        isModalOpen={
          draftQuestionsList[selectedQuestionIndex].questionImageModalIsOpen
        }
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseQuestionModal}
      />

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftGame={draftGame}
        screenSize={screenSize}
        isModalOpen={draftGame.isGameImageUploadVisible}
        handleImageChange={handleGameImageChange}
        handleImageSave={handleGameImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      {/* Create Game Card flow starts here */}
      <CreateGameBoxContainer>
        <CreateGameComponent
          draftGame={draftGame}
          screenSize={screenSize}
          handleSaveGame={handleSaveGame}
          handleDiscard={handleDiscardGame}
          handlePublicPrivateChange={handlePublicPrivateGameChange}
          handleImageUploadClick={handleGameImageUploadClick}
          onCreateQuestion={handleOpenCreateQuestion}
          onOpenQuestionBank={handleOpenQuestionBank}
          handlePhaseTime={handlePhaseTime}
          onGameDescription={handleGameDescription}
          onGameTitle={handleGameTitle}
          phaseTime={phaseTime}
          selectedIndex={selectedQuestionIndex}
          iconButtons={iconButtons}
          setSelectedIndex={handleQuestionIndexChange}
          addMoreQuestions={handleAddMoreQuestions}
        />

        {/* Create Question Form(s)  */}
        {draftQuestionsList.map(
          (draftQuestionItem, index) =>
            index === selectedQuestionIndex && (
              <Fade
                timeout={500}
                in={draftGame.openCreateQuestion}
                mountOnEnter
                unmountOnExit
                key={`Question--${index + 1}`}
              >
                <Box>
                  {draftQuestionItem.isLibraryViewOnly ? (
                    <ViewQuestionCards 
                    screenSize={screenSize}
                    question={draftQuestionItem.questionTemplate}
                    isViewGame
                    isCreateGame
                     />

                  ): (
                  <QuestionElements
                    screenSize={screenSize}
                    draftQuestion={draftQuestionItem.question}
                    completeIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                      (card) => card.isCardComplete,
                    )}
                    incompleteIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                      (card) => !card.isCardComplete,
                    )}
                    isCardSubmitted={draftQuestionItem.isQuestionCardSubmitted}
                    isCardErrored={draftQuestionItem.isQuestionCardErrored}
                    highlightCard={draftQuestionItem.highlightCard}
                    isAIEnabled={draftQuestionItem.isAIEnabled}
                    isAIError={draftQuestionItem.isAIError}
                    isPublic={
                      draftQuestionItem.publicPrivate ===
                      PublicPrivateType.PUBLIC
                    }
                    isMultipleChoice={draftQuestionItem.isMultipleChoice}
                    handleAnswerType={handleAnswerType}
                    handleDebouncedCorrectAnswerChange={
                      handleDebouncedCorrectAnswerChange
                    }
                    handleDebouncedCorrectAnswerStepsChange={
                      handleDebouncedCorrectAnswerStepsChange
                    }
                    handleDebouncedTitleChange={handleDebouncedTitleChange}
                    handlePublicPrivateChange={
                      handlePublicPrivateQuestionChange
                    }
                    handleDiscardQuestion={handleDiscard}
                    handleSaveQuestion={handleSaveQuestion}
                    handleAIError={handleAIError}
                    handleAIIsEnabled={handleAIIsEnabled}
                    handleNextCardButtonClick={handleNextCardButtonClick}
                    handleIncorrectCardStackUpdate={
                      handleIncorrectCardStackUpdate
                    }
                    handleClick={handleClick}
                    handleCCSSClick={handleCCSSClicks}
                    handleImageUploadClick={handleQuestionImageUploadClick}
                  />
                  )}
                </Box>
              </Fade>
            ),
        )}

        {/* Question Bank */}
        <Fade
          in={draftGame.openQuestionBank}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box>
            <LibraryTabsQuestions
              screenSize={screenSize}
              tabMap={tabMap}
              tabIconMap={tabIconMap}
              setIsTabsOpen={setIsTabsOpen}
              getLabel={getLabel}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              handlePublicPrivateChange={handlePublicPrivateQuestionChange}
              fetchElements={fetchElements}
              handleView={handleView}
              loadMore={loadMore}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
