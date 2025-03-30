import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  CentralQuestionTemplateInput,
  IGameTemplate,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  CreateQuestionHighlightCard,
  ScreenSize,
  StorageKey,
  TemplateType,
} from '../lib/CentralModels';
import ModalBackground from '../components/modal/ModalBackground';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';

import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import useCreateGame from '../hooks/useCreateGame';
import useCreateQuestion from '../hooks/useCreateQuestion';
import LibraryTabsQuestions from '../components/librarytabs/LibraryTabsQuestions';
import useExploreQuestionsStateManager from '../hooks/useExploreQuestionsStateManager';
import ExploreQuestions from './ExploreQuestions';
import tabExploreQuestionsIcon from '../images/tabExploreQuestions.svg';
import tabMyQuestionsIcon from '../images/tabMyQuestions.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import tabDraftsIcon from '../images/tabDrafts.svg';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import {
  updateDQwithCorrectAnswer,
  updateDQwithCorrectAnswerSteps,
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { updateDQwithCCSS } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswers,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';

interface CreateGameProps {
  screenSize: ScreenSize;
}

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

export default function CreateGame({ screenSize }: CreateGameProps) {
  const navigate = useNavigate();
  const [favQuestions, setFavQuestions] = useState<IQuestionTemplate[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [isAIError, setIsAIError] = useState<boolean>(false);
  const {
    topRef,
    isGameCardSubmitted,
    openQuestionBank,
    openCreateQuestion,
    publicPrivateGame,
    isGameCardErrored,
    phaseTime,
    gameTitle,
    gameDescription,
    isGameImageUploadVisible,
    // gameTemplate,
    // iconButtons,
    // handleAddMoreQuestions,
    // setGameTemplate,
    handleCloseGameCardModal,
    handleGameTitle,
    handleGameDescription,
    handlePhaseTime,
    handleOpenCreateQuestion,
    handleOpenQuestionBank,
    handlePublicPrivateGameChange,
    handleSaveGame,
    handleDiscardGame,
    handleGameImageUploadClick,
    setIsGameCardErrored,
  } = useCreateGame();
  const {
    isClicked,
    isAIEnabled,
    // isAIError,
    handleImageChange,
    handleImageSave,
    handleQuestionImageUploadClick,
    // handlePublicPrivateQuestionChange,
    handleAIError,
    handleAIIsEnabled,
    handleSaveQuestion,
    handleClick,
    handleCloseQuestionModal,
    // handleNextCardButtonClick,
    // handleIncorrectCardStackUpdate,
    handleCCSSClick,
    setDraftQuestion,
    setHighlightCard,
    // handleDebouncedCorrectAnswerStepsChange,
    // publicPrivateQuestion,
    isQuestionCardSubmitted,
    isQuestionCardErrored,
    isCreatingTemplate,
    isImageUploadVisible,
    isImageURLVisible,
    draftQuestion,
    isCCSSVisible,
    highlightCard,
    // completeIncorrectAnswers,
    // incompleteIncorrectAnswers,
  } = useCreateQuestion();
  const {
    recommendedQuestions,
    mostPopularQuestions,
    searchedQuestions,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    selectQuestion,
    questionSet,
    handleView,
    getLabel,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions,
  } = useExploreQuestionsStateManager();

  const newEmptyTemplate: CentralQuestionTemplateInput = {
    questionCard: {
      title: '',
      ccss: 'CCSS',
      isFirstEdit: true,
      isCardComplete: false,
    },
    correctCard: {
      answer: '',
      answerSteps: ['', '', ''],
      isFirstEdit: true,
      isCardComplete: false,
    },
    incorrectCards: [
      {
        id: 'card-1',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
      {
        id: 'card-2',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
      {
        id: 'card-3',
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: false,
      },
    ],
  };
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    CentralQuestionTemplateInput[]
  >([newEmptyTemplate]);

  const [questionImageModalIsOpen, setQuestionImageModalIsOpen] = useState<
    boolean[]
  >(new Array(draftQuestionsList.length).fill(false));
  const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState<boolean[]>(
    new Array(draftQuestionsList.length).fill(false),
  );
  const [publicPrivateQuestion, setPublicPrivateQuestion] = useState<
    PublicPrivateType[]
  >(new Array(draftQuestionsList.length).fill(PublicPrivateType.PUBLIC));
  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    (title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      const updateDraftQuestions = [...draftQuestionsList];
      const questionToUpdate = updateDraftQuestions[selectedQuestionIndex];
      const { isFirstEdit } = questionToUpdate.questionCard;
      const newDraftQuestion = {
        ...questionToUpdate,
        questionCard: {
          ...questionToUpdate.questionCard,
          title,
        },
      };
      updateDraftQuestions[selectedQuestionIndex] = newDraftQuestion;
      setDraftQuestionsList(updateDraftQuestions);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    },
    [draftQuestionsList, selectedQuestionIndex, setHighlightCard],
  );

  const handleCCSSSubmit = (ccssString: string) => {
    setIsCCSSVisibleModal((prev) => {
      const curr = [...prev];
      curr[selectedQuestionIndex] = false;
      return curr;
    });
    const updatedDraftQuestionCCSS = [...draftQuestionsList];
    const updateCCSS = updatedDraftQuestionCCSS[selectedQuestionIndex];
    const { isFirstEdit } = updateCCSS.questionCard;

    const newDraftQuestion = updateDQwithCCSS(updateCCSS, ccssString);

    updatedDraftQuestionCCSS[selectedQuestionIndex] = newDraftQuestion;

    setDraftQuestionsList(updatedDraftQuestionCCSS);
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };

  const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
    setPublicPrivateQuestion((prev) => {
      const publicPrivate = [...prev];
      publicPrivate[selectedQuestionIndex] = value;
      return publicPrivate;
    });
  };

  // correct card stack
  const handleDebouncedCorrectAnswerChange = useCallback(// eslint-disable-line
    (
      correctAnswer: string,
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      const currentCorrectAnswer = [...draftQuestionsList];
      const updatedCorrectAnswer = currentCorrectAnswer[selectedQuestionIndex];
      const { isFirstEdit } = updatedCorrectAnswer.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswer(
        updatedCorrectAnswer,
        correctAnswer,
      );
      currentCorrectAnswer[selectedQuestionIndex] = newDraftQuestion;
      setDraftQuestionsList(currentCorrectAnswer);
      if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
        setHighlightCard(
          (prev) => CreateQuestionHighlightCard.INCORRECTANSWER1,
        );
    },
    [draftQuestionsList, selectedQuestionIndex, setHighlightCard],
  );

  const handleDebouncedCorrectAnswerStepsChange = useCallback(// eslint-disable-line

    (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      const draftCorrectAnswerSteps = [...draftQuestionsList];
      const updatedDraftCorrectAnswerSteps =
        draftCorrectAnswerSteps[selectedQuestionIndex];

      const { isFirstEdit } = updatedDraftCorrectAnswerSteps.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswerSteps(
        updatedDraftCorrectAnswerSteps,
        steps,
      );
      draftCorrectAnswerSteps[selectedQuestionIndex] = newDraftQuestion;
      setDraftQuestionsList(draftCorrectAnswerSteps);
      if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
        setHighlightCard(
          (prev) => CreateQuestionHighlightCard.INCORRECTANSWER1,
        );
    },
    [draftQuestionsList, selectedQuestionIndex, setHighlightCard],
  );

  const handleIncorrectCardStackUpdate = (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => {
    const nextCard = getNextHighlightCard(
      cardData.id as CreateQuestionHighlightCard,
    );
    const currentDraftQuestion = draftQuestionsList[selectedQuestionIndex];

    const isUpdateInIncompleteCards = incompleteAnswers.find(
      (answer) => answer.id === cardData.id,
    );

    const isCardComplete =
      cardData.answer.length > 0 && cardData.explanation.length > 0;

    if (isUpdateInIncompleteCards) {
      setIsAIError(false);

      const updatedIncorrectCards = incompleteAnswers.map((answer) => {
        if (answer.id === cardData.id) {
          return cardData;
        }
        return answer;
      });

      if (isCardComplete && !isAIEnabledCard) {
        // adjust incomplete and complete arrays, moving completed card over
        const { newIncompleteAnswers, newCompleteAnswers } =
          handleMoveAnswerToComplete(updatedIncorrectCards, completeAnswers);
        // // adjust local state for the cards so that they animate properly through the stack

        const newDraftQuestion = updateDQwithIncorrectAnswers(
          currentDraftQuestion,
          newIncompleteAnswers,
          newCompleteAnswers,
        );

        const updatedDraftQuestionsList = [...draftQuestionsList];
        updatedDraftQuestionsList[selectedQuestionIndex] = newDraftQuestion;

        setDraftQuestionsList(updatedDraftQuestionsList);

        if (cardData.isFirstEdit)
          setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
      } else {
        const newDraftQuestion = updateDQwithIncorrectAnswers(
          currentDraftQuestion,
          updatedIncorrectCards,
          completeAnswers,
        );

        const updatedDraftQuestionsList = [...draftQuestionsList];
        updatedDraftQuestionsList[selectedQuestionIndex] = newDraftQuestion;

        setDraftQuestionsList(updatedDraftQuestionsList);
      }
    } else {
      const updatedCompleteAnswers = completeAnswers.map((answer) =>
        answer.id === cardData.id ? cardData : answer,
      );
      const updatedDraftQuestion = updateDQwithIncorrectAnswers(
        currentDraftQuestion,
        incompleteAnswers,
        updatedCompleteAnswers,
      );
      const updatedDraftQuestionsList = [...draftQuestionsList];
      updatedDraftQuestionsList[selectedQuestionIndex] = updatedDraftQuestion;
      setDraftQuestionsList(updatedDraftQuestionsList);
    }
  };

  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    if (isAIError) setIsAIError(false);

    // Access the current draft question
    const currentDraftQuestion = draftQuestionsList[selectedQuestionIndex];

    // Separate incomplete and complete answers from the currentDraftQuestion
    const incompleteAnswers = currentDraftQuestion.incorrectCards.filter(
      (answer) => !answer.isCardComplete,
    );
    const completeAnswers = currentDraftQuestion.incorrectCards.filter(
      (answer) => answer.isCardComplete,
    );

    // Update the incomplete answers array with the new card data
    const updatedAnswers = incompleteAnswers.map((answer) => {
      if (answer.id === cardData.id) {
        return cardData; // Update the card with the new data
      }
      return answer;
    });

    // Move the updated card to the correct stack if it's complete
    const { newIncompleteAnswers, newCompleteAnswers } =
      handleMoveAnswerToComplete(updatedAnswers, completeAnswers);

    // Create a new draft question object with the updated cards
    const newDraftQuestion = updateDQwithIncorrectAnswers(
      currentDraftQuestion,
      newIncompleteAnswers,
      newCompleteAnswers,
    );

    // Update the draftQuestionsList with the new draft question
    const updatedDraftQuestionsList = [...draftQuestionsList];
    updatedDraftQuestionsList[selectedQuestionIndex] = newDraftQuestion;

    // Set the updated draft questions list state
    setDraftQuestionsList(updatedDraftQuestionsList);

    // Optionally handle the next card highlight if necessary
    const nextCard = getNextHighlightCard(
      cardData.id as CreateQuestionHighlightCard,
    );
    if (nextCard) {
      setHighlightCard(nextCard);
    }
  };

  // game template functions
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, newEmptyTemplate]);
    setDraftQuestion(newEmptyTemplate);
    setQuestionCount((prev) => prev + 1);
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleImageUploadClick = (index: number) => {
    const updatedModalState = [...questionImageModalIsOpen];
    updatedModalState[index] = true;
    setQuestionImageModalIsOpen(updatedModalState);
  };

  const handleCCSSClicks = (index: number) => {
    const updatedCCSSState = [...isCCSSVisibleModal];
    updatedCCSSState[index] = true;
    setIsCCSSVisibleModal(updatedCCSSState);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const completeIncorrectAnswers = draftQuestionsList[
    selectedQuestionIndex
  ].incorrectCards.filter((card) => card.isCardComplete);
  const incompleteIncorrectAnswers = draftQuestionsList[
    selectedQuestionIndex
  ].incorrectCards.filter((card) => !card.isCardComplete);

  return (
    <CreateGameMainContainer ref={topRef} sx={{ overflowY: 'auto' }}>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={
          isImageUploadVisible ||
          isImageURLVisible ||
          isCreatingTemplate ||
          isCCSSVisibleModal[selectedQuestionIndex]
        }
        handleCloseModal={() => {
          handleCloseQuestionModal();
          setIsCCSSVisibleModal((prev) => {
            const newState = [...prev];
            newState[selectedQuestionIndex] = false;
            return newState;
          });
        }}
      />
      {isCCSSVisibleModal[selectedQuestionIndex] && (
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisibleModal[selectedQuestionIndex]}
          handleCCSSSubmit={handleCCSSSubmit}
        />
      )}

      {/* open modals according to correct index */}
      {questionImageModalIsOpen[selectedQuestionIndex] && (
        <ImageUploadModal
          draftQuestion={draftQuestionsList[selectedQuestionIndex]}
          screenSize={screenSize}
          isModalOpen={questionImageModalIsOpen[selectedQuestionIndex]}
          handleImageChange={handleImageChange}
          handleImageSave={handleImageSave}
          handleCloseModal={() => {
            handleCloseQuestionModal();
            setQuestionImageModalIsOpen((prev) => {
              const newState = [...prev];
              newState[selectedQuestionIndex] = false;
              return newState;
            });
          }}
        />
      )}

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftQuestion={draftQuestion}
        screenSize={screenSize}
        isModalOpen={isGameImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      <CreatingTemplateModal
        isModalOpen={isCreatingTemplate}
        templateType={TemplateType.GAME}
      />
      {/* Create Game Card flow starts here */}
      <CreateGameBoxContainer>
        <CreateGameComponent
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
          onGameCardError={setIsGameCardErrored}
          isCardSubmitted={isGameCardSubmitted}
          isCardErrored={isGameCardErrored}
          phaseTime={phaseTime}
          gameTitle={gameTitle}
          gameDescription={gameDescription}
          openQuestionBank={openQuestionBank}
          openCreateQuestion={openCreateQuestion}
          questionCount={questionCount}
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
                in={openCreateQuestion}
                mountOnEnter
                unmountOnExit
                key={`Question--${index + 1}`}
              >
                <Box>
                  <QuestionElements
                    screenSize={screenSize}
                    draftQuestion={draftQuestionItem}
                    completeIncorrectAnswers={completeIncorrectAnswers}
                    incompleteIncorrectAnswers={incompleteIncorrectAnswers}
                    isCardSubmitted={isQuestionCardSubmitted}
                    isCardErrored={isQuestionCardErrored}
                    highlightCard={highlightCard}
                    isAIEnabled={isAIEnabled}
                    isAIError={isAIError}
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
                    handleCCSSClick={() => handleCCSSClicks(index)}
                    handleImageUploadClick={() => handleImageUploadClick(index)}
                  />{' '}
                </Box>
              </Fade>
            ),
        )}

        {/* Question Bank goes here */}
        <Fade in={openQuestionBank} mountOnEnter unmountOnExit timeout={500}>
          <Box>
            <LibraryTabsQuestions
              // gameQuestion={}
              // setIsUserLoggeIn={}
              // userProfile={}
              // getFav={}
              // isFavTabOpen={}
              // publicPrivate={}
              nextToken={nextToken}
              isTabsOpen={isTabsOpen}
              recommendedQuestions={recommendedQuestions}
              favQuestions={favQuestions}
              getLabel={getLabel}
              setIsTabsOpen={setIsTabsOpen}
              screenSize={screenSize}
              mostPopularQuestions={mostPopularQuestions}
              searchedQuestions={searchedQuestions}
              tabMap={tabMap}
              tabIconMap={tabIconMap}
              isLoading={isLoading}
              searchTerms={searchTerms}
              selectedGrades={selectedGrades}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              handlePublicPrivateChange={handlePublicPrivateQuestionChange}
              loadMore={loadMoreQuestions}
              handleView={handleView}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
