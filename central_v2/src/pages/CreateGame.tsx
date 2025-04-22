import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnswerType,
  CentralQuestionTemplateInput,
  IGameTemplate,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
  CreatePublicGameTemplateInput,
  CreatePrivateGameQuestionsInput,
  CreatePublicGameQuestionsInput,
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
import {
  CreateQuestionHighlightCard,
  GameQuestionType,
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
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import {
  updateDQwithCCSS,
  updateDQwithImage,
  updateDQwithImageURL,
  updateDQwithQuestionClick,
  updateDQwithTitle,
} from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import {
  updateDQwithCorrectAnswer,
  updateDQwithCorrectAnswerClick,
  updateDQwithCorrectAnswerSteps,
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
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
    openModalAtIndex 
  } from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';


interface CreateGameProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: () => void;
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
  0: 'Explore Questions',
  1: 'My Questions',
  2: 'Favorites',
};

const tabIconMap: { [key: number]: string } = {
  0: tabExploreQuestionsIcon,
  1: tabMyQuestionsIcon,
  2: tabFavoritesIcon,
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
  const [selectQuestion, setSelectedQuestion] = useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const [saveQuestionError, setSaveQuestionError] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    TDraftQuestionsList[]
  >([draftTemplate]);
  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });
  const [hasInitialized, setHasInitialized] = useState(false);    
  if (!hasInitialized) {
    const needsFetch = centralData.mostPopularQuestions.length === 0; 
    if (needsFetch) {
      fetchElements(); 
    }
    setHasInitialized(true);
  }

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
        // flag error and return to stop operation.
          setSaveQuestionError(true);
      }
    } catch (err) {
      console.log(`HandleSaveGame - error: ${err}`);
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
        setSaveQuestionError(true);
        return;
      }

      setIsCreatingTemplate(true);
      // process valid questions in order
      await Promise.all(
        draftQuestionsList.map(async (dq) => {
          let result = null;
          let url = null;

          /** handle image cases  */
          // image file case
          if (dq.question.questionCard.image) {
            try {
              const img = await apiClients.questionTemplate.storeImageInS3(
                dq.question.questionCard.image,
              );
              result = await img.result;
              if (result && result.path && result.path.length > 0) {
                url = result.path;
              }
            } catch (err) {
              console.error('Error storing image:', err);
              throw new Error('Failed to store image.');
            }
          }
          // image url case
          else if (dq.question.questionCard.imageUrl) {
            try {
              url = await apiClients.questionTemplate.storeImageUrlInS3(
                dq.question.questionCard.imageUrl,
              );
            } catch (err) {
              console.error('Error storing image URL:', err);
              throw new Error('Failed to store image URL.');
            }
          }

          // if a url is available, we can create a question template
          if (url) {
            try {
              await apiClients.questionTemplate.createQuestionTemplate(
                dq.publicPrivate,
                url,
                dq.question,
              );
            } catch (err) {
              console.error('Error creating question template:', err);
              throw new Error('Failed to create question template.');
            }
          }

          // return updated question with isCreatingTemplate: false after processing
          return {
            ...dq,
            isCreatingTemplate: false,
          };
        }),
      );

      // Reset data and re-direct user
      setDraftQuestionsList([]);
      setIsCreatingTemplate(false);
      setSaveQuestionError(false);
      navigate('/');
    } catch (err) {
      setSaveQuestionError(true);
      setIsCreatingTemplate(false);
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

    const handleView = (
      question: IQuestionTemplate,
      questions: IQuestionTemplate[],
    ) => {
      setSelectedQuestion(question);
      setQuestionSet(questions);
      setIsTabsOpen(true);

      console.log("Library Question: ", question);

      const correctAnswer = question.choices?.find((q) => q.isAnswer === true);
      const incorrectAnswers = question.choices?.filter((q) => !q.isAnswer);

      const incorrectCards = incorrectAnswers?.map((incorrectAnswer, i) => ({
        id: `card-${i + 1}`,
        answer: incorrectAnswer.text || '',
        explanation: incorrectAnswer.reason || '',
        isFirstEdit: true,
        isCardComplete: true,
      })) as IncorrectCard[]
  
     setDraftQuestionsList((prev) => {
      const libraryQuestion = { 
        ...draftTemplate, 
        questionTemplate: { ...emptyQuestionTemplate, id: question.id }, 
        question: {
        questionCard: {
          imageUrl: question?.imageUrl ? question.imageUrl: "",
          title: question?.title,
          ccss: question?.ccss,
          isFirstEdit: true,
          isCardComplete: true,
        },
        correctCard: {
          answer: correctAnswer ? correctAnswer?.text : "",
          answerSteps: question?.instructions ? question?.instructions: ["", "", ""],
          isFirstEdit: true,
          isCardComplete: true,
        },
        incorrectCards
      } }

      const isFirstEmpty = prev.length === 1 && !prev[0].question.questionCard.isCardComplete;

      if(isFirstEmpty) {
        return [libraryQuestion]
      }

      if (
        typeof selectedQuestionIndex === 'number' &&
        prev[selectedQuestionIndex] &&
        !prev[selectedQuestionIndex].question.questionCard.isCardComplete
      ) {
        const updated = [...prev];
        updated[selectedQuestionIndex] = libraryQuestion;
        return updated;
      }

      const currentIndex = prev.findIndex((q) => !q.question.questionCard.isCardComplete);

      if(currentIndex !== -1) {
        const updated = [...prev];
        updated[currentIndex] = libraryQuestion;
        return updated;
      }

      const updatedQuestions = [...prev, draftTemplate];
      updatedQuestions[updatedQuestions.length - 1] = libraryQuestion;

      setDraftGame((prevGame) => ({
        ...prevGame,
        questionCount: prevGame.questionCount + 1,
      }));
      setIconButtons((prevButtons) => [...prevButtons, prevButtons.length + 1]);

      return updatedQuestions;
     })
    setDraftGame((prev) => ({
      ...prev, 
      openQuestionBank: false,
      openCreateQuestion: true
    }))
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
                </Box>
              </Fade>
            ),
        )}

        {/* Question Bank goes here */}
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
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
