import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  CentralQuestionTemplateInput,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection,
  AnswerType,
  AnswerPrecision,
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
  gameTemplate,
  emptyQuestionTemplate } from '../lib/CreateGameModels';
import DiscardModal from '../components/modal/DiscardModal';  
import ModalBackground from '../components/modal/ModalBackground';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import LibraryTabsQuestions from '../components/librarytabs/LibraryTabsQuestions';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { 
  updateGameTitle, 
  updateGameDescription, 
  updateGameTemplatePhaseTime, 
  updatePhaseTime,
  toggleCreateQuestion,
  toggleQuestionBank,
  updateGameImageChange,
  updateGameImageSave,
  buildGameTemplate,
  checkGameFormIsValid,
  buildGameQuestionPromises,
  createGameImagePath
  } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
  import { 
    checkDQsAreValid, 
    buildQuestionTemplatePromises,
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
    handleQuestionListErrors 
  } from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';
  import {
    updateDQwithAnswerSettings,
  } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';


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

export default function CreateGame({ 
  screenSize,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSearchChange,
  handleSortChange,
  loadMore,
 }: CreateGameProps) {
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const route = useMatch('/clone/game/:gameId');
  const isClone = route?.params.gameId !== null && route?.params.gameId !== undefined && route?.params.gameId.length > 0;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [originalGameImageUrl, setOriginalGameImageUrl] = useState<string>('');
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    TDraftQuestionsList[]
  >([draftTemplate]);
  const [originalQuestionImageUrls, setOriginalQuestionImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });

  const openModal = openModalAtIndex(draftGame, draftQuestionsList, selectedQuestionIndex);
  const gameFormIsValid = checkGameFormIsValid(draftGame);
  const allDQAreValid = checkDQsAreValid(draftQuestionsList);
  const hasGameError = (draftGame.isGameCardErrored && !gameFormIsValid) 
  || (draftGame.isGameCardSubmitted && (!gameFormIsValid || !allDQAreValid));

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
    const isPublicPrivateMatch = draftQuestionsList.every((question) => question.publicPrivate === value);
    if(!isPublicPrivateMatch) {
      const newDraft = [ { ...draftTemplate, publicPrivate: value } ];
      setDraftQuestionsList(newDraft);
      setIconButtons([1]);
      setSelectedQuestionIndex(0);
      setDraftGame((prev) => ({ 
        ...prev, 
        publicPrivateGame: value, 
        questionCount: newDraft.length,
        isGameCardErrored: false, 
      }));
      return;
    }
    setDraftGame((prev) => ({ ...prev, publicPrivateGame: value, }));
   setDraftQuestionsList((prev) => updatePublicPrivateAtIndex(prev, value));
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/');
  };

  const handleDiscardClick = (value: boolean) => {
    if (value){
      setIsDiscardModalOpen(false);
      window.localStorage.setItem(StorageKey, '');
      navigate('/');
      return;
    }
    setIsDiscardModalOpen(false);
  }

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
      // confirm game & question form validity
      if (gameFormIsValid && allDQAreValid) {

        // check for images on draft game 
        let gameImgUrl: string | null = null;
        if(draftGame.image || draftGame.imageUrl) {
         gameImgUrl = await createGameImagePath(draftGame, apiClients);
        }

          // create & store game template in variable to retrieve id after response
          const createGame = buildGameTemplate(draftGame, draftQuestionsList, gameImgUrl);
          const gameTemplateResponse = await apiClients.gameTemplate.createGameTemplate(
              draftGame.publicPrivateGame,
              createGame,
            );

          // convert questions to array of promises & write to db
          const newQuestionTemplates = buildQuestionTemplatePromises(draftQuestionsList, apiClients);
          const questionTemplateResponse = await Promise.all(newQuestionTemplates);

          // create an array of all the ids from the response 
          const questionTemplateIds = questionTemplateResponse.map(
            (question) => String(question?.id),
          );

          // make sure we have a gameTemplate id as well as question template ids before creating a game question
          if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
            try {
              const createGameQuestions = buildGameQuestionPromises(
                draftGame, 
                gameTemplateResponse.id, 
                questionTemplateIds, 
                apiClients
              );
              // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
                await Promise.all(createGameQuestions);
            } catch (err) {
              setDraftGame(prev => ({ ...prev, isCreatingTemplate: false }));
              console.error(`Failed to create one or more game questions:`, err);
            }
          }

           // update user stats
           const existingNumGames = centralData.userProfile?.gamesMade || 0;
           const existingNumQuestions = centralData.userProfile?.questionsMade || 0;
           const newNumGames = existingNumGames + 1;
            // add new questions to user number of questions
           const newNumQuestions = existingNumQuestions + draftQuestionsList.filter((dq) => !dq.questionTemplate.id).length;
           await apiClients.user.updateUser({
               id: centralData.userProfile?.id || '',
               gamesMade: newNumGames,
               questionsMade: newNumQuestions,
             }
           );

          setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false, isGameCardSubmitted: false }));
          navigate('/');
      } else {
        setDraftGame((prev) => ({ ...prev, isGameCardErrored: true, isCreatingTemplate: false }));
        if(!allDQAreValid) {
          setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
        }
      }
    } catch (err) {
      console.log(`HandleSaveGame - error: `, err);
    }
  };
  /** END OF CREATE GAME HANDLERS  */

  /** CREATE QUESTION HANDLERS START */
  const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
    setDraftQuestionsList((prev) => updatePublicPrivateAtIndex(prev, value));
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
    (title: string) => {
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

  const handleAnswerSettingsChange = (draftQuestionInput: CentralQuestionTemplateInput, answerType: AnswerType, answerPrecision?: AnswerPrecision ) => {
    setDraftQuestionsList((prev) => {
      return prev.map((draftItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = draftItem.question;
          const newQuestion = updateDQwithAnswerSettings(
            currentDraftQuestion,
            answerType,
            answerPrecision,
          );
          return {
            ...draftItem,
            question: newQuestion,
          };
        }
        return draftItem;
      });
    });
  };


  const handleAnswerType = () => {
    setDraftQuestionsList((prev) => updateQuestionAnswerTypeAtIndex(prev, selectedQuestionIndex));
  };

  const handleCloseQuestionModal = () => {
    setIsDiscardModalOpen(false);
    if (draftGame.isGameImageUploadVisible) {
      setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
    }
    setDraftQuestionsList((prev) => updateCloseQuestionModelAtIndex(prev, selectedQuestionIndex));
  };

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    setDraftQuestionsList((prev) => handleCardClickAtIndex(prev, selectedQuestionIndex, cardType));
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestionsList((prev) => updateCCSSAtIndex(prev, selectedQuestionIndex, ccssString));
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
      const questionTemplate = buildQuestionTemplatePromises(draftQuestionsList, apiClients);
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
   setDraftQuestionsList((prev) => {
    const libraryQuestion = buildLibraryQuestionAtIndex(question, draftGame.publicPrivateGame);
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
    setSelectedQuestionIndex((prevIndex) => addNew ? prevIndex + 1 : prevIndex)
    setIconButtons((prevButtons) => addNew ? [...prevButtons, prevButtons.length + 1] : prevButtons);
    return updatedList;
   })
  };

  /** LIBRARY HANDLER HELPERS */

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
    if(draftGame.openQuestionBank) {
      setDraftGame((prev) => toggleCreateQuestion(draftGame, gameFormIsValid))
    }
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, { ...draftTemplate, publicPrivate: draftGame.publicPrivateGame }]);
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount + 1,
      isGameCardErrored: false,
      isGameCardSubmitted: false,
    }));
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal || isDiscardModalOpen}
        handleCloseModal={handleCloseQuestionModal}
      />
      <DiscardModal 
          isModalOpen={isDiscardModalOpen}
          screenSize={screenSize}
          handleDiscardClick={handleDiscardClick}
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
        isClone={isClone}
        isCloneImageChanged={
          draftQuestionsList[selectedQuestionIndex].isCloneQuestionImageChanged
        }
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
        isClone={isClone}
        isCloneImageChanged={draftGame.isCloneGameImageChanged}
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
          isClone={isClone}
          isCloneImageChanged={draftGame.isCloneGameImageChanged}
          screenSize={screenSize}
          isGameCardErrored={hasGameError}
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
                <Box sx={{ width: draftQuestionItem.isLibraryViewOnly ? '100%' : 'auto' }}>
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
                    isClone={isClone}
                    isCloneImageChanged={
                      draftQuestionItem.isCloneQuestionImageChanged
                    }
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
                    isPublic={draftQuestionItem.publicPrivate === PublicPrivateType.PUBLIC}
                    isMultipleChoice={draftQuestionItem.isMultipleChoice}
                    handleAnswerType={handleAnswerType}
                    handleDebouncedCorrectAnswerChange={
                      handleDebouncedCorrectAnswerChange
                    }
                    handleDebouncedCorrectAnswerStepsChange={
                      handleDebouncedCorrectAnswerStepsChange
                    }
                    handleAnswerSettingsChange={handleAnswerSettingsChange}
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
          <Box sx={{ width: '100%' }}>
            <LibraryTabsQuestions
              isPublic={draftGame.publicPrivateGame === PublicPrivateType.PUBLIC}
              screenSize={screenSize}
              setIsTabsOpen={setIsTabsOpen}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              fetchElements={fetchElements}
              handleView={handleView}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
