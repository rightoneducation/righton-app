import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  CentralQuestionTemplateInput,
  IGameTemplate,
  IQuestionTemplate,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import { CreateQuestionHighlightCard, ScreenSize, StorageKey, TemplateType } from '../lib/CentralModels';
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
    isAIError,
    handleImageChange,
    handleImageSave,
    handleQuestionImageUploadClick,
    handlePublicPrivateQuestionChange,
    handleAIError,
    handleAIIsEnabled,
    handleSaveQuestion,
    handleClick,
    handleCloseQuestionModal,
    handleNextCardButtonClick,
    handleIncorrectCardStackUpdate,
    handleCCSSClick,
    setDraftQuestion,
    setHighlightCard,
    handleDebouncedCorrectAnswerChange,
    handleDebouncedCorrectAnswerStepsChange,
    publicPrivateQuestion,
    isQuestionCardSubmitted,
    isQuestionCardErrored,
    isCreatingTemplate,
    isImageUploadVisible,
    isImageURLVisible,
    draftQuestion,
    isCCSSVisible,
    highlightCard,
    completeIncorrectAnswers,
    incompleteIncorrectAnswers,
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
      ...incompleteIncorrectAnswers,
      ...completeIncorrectAnswers,
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
  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
      (title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
        const updateDraftQuestions = [...draftQuestionsList];
        const questionToUpdate =  updateDraftQuestions[selectedQuestionIndex];
        const { isFirstEdit } = questionToUpdate.questionCard;
        const newDraftQuestion = {
          ...questionToUpdate,
          questionCard: {
            ...questionToUpdate.questionCard,
            title,
          }
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
      })
      const updatedDraftQuestionCCSS = [...draftQuestionsList];
      const updateCCSS = updatedDraftQuestionCCSS[selectedQuestionIndex];
      const { isFirstEdit } = updateCCSS.questionCard;
      const newDraftQuestion = {
        ...updateCCSS,
        questionCard: {
          ...updateCCSS.questionCard,
          ccss: ccssString,
        }
      };

      updatedDraftQuestionCCSS[selectedQuestionIndex] = newDraftQuestion;
    
      setDraftQuestionsList(updatedDraftQuestionCCSS);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
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
    updatedModalState[index] = true; // Open the modal for the specific question
    setQuestionImageModalIsOpen(updatedModalState);
  };

  const handleCCSSClicks = (index: number) => {
    const updatedCCSSState = [...isCCSSVisibleModal];
    updatedCCSSState[index] = true; // Open the modal for the specific question
    setIsCCSSVisibleModal(updatedCCSSState);
  };

  
  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };
  console.log('Draft Questions List: ', draftQuestionsList);

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
