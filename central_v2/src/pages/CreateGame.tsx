import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnswerType,
  CentralQuestionTemplateInput,
  IGameTemplate,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
} from '@righton/networking';
import { Box, Fade, Typography, styled } from '@mui/material';
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
import tabExploreQuestionsIcon from '../images/tabExploreQuestions.svg';
import tabMyQuestionsIcon from '../images/tabMyQuestions.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import { type TDraftQuestionsList } from '../hooks/useCreateQuestion';
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

const emptyQuestionTemplate: IQuestionTemplate = {
  id: "",
  title: "",
  lowerCaseTitle: "",
  version: 0,
  ccss: "",
  domain: "",
  cluster: "",
  grade: "",
  gradeFilter: "",
  standard: "",
  gameTemplatesCount: 0,
}

const draftTemplate: TDraftQuestionsList = {
  publicPrivate: PublicPrivateType.PUBLIC,
  isAIEnabled: false,
  isAIError: false,
  question: newEmptyTemplate,
  questionImageModalIsOpen: false,
  isCCSSVisibleModal: false,
  isImageUploadVisible: false,
  isImageURLVisible: false,
  isCreatingTemplate: false,
  highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
  answerType: AnswerType.MULTICHOICE,
  questionTemplate: emptyQuestionTemplate,
};

export default function CreateGame({ screenSize }: CreateGameProps) {
  const navigate = useNavigate();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const {
    draftGame,
    setDraftGame,
    phaseTime,
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
    handleGameImageSave,
    handleGameImageChange,
  } = useCreateGame();
  const {
    handleImageChange,
    handleImageSave,
    handleQuestionImageUploadClick,
    handlePublicPrivateQuestionChange,
    handleAIError,
    handleAIIsEnabled,
    handleCCSSSubmit,
    handleClick,
    handleNextCardButtonClick,
    handleIncorrectCardStackUpdate,
    handleCCSSClicks,
    handleCloseQuestionModal,
    setDraftQuestionsList,
    handleDebouncedCorrectAnswerChange,
    handleDebouncedCorrectAnswerStepsChange,
    handleDebouncedTitleChange,
    handleAnswerType,
    handleSaveQuestion, // might not need this
    draftQuestionsList,
    completeIncorrectAnswers,
    incompleteIncorrectAnswers,
    openModal,
    isQuestionCardSubmitted,
    isQuestionCardErrored,
    isCreatingTemplate,
  } = useCreateQuestion(selectedQuestionIndex);
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

  // game template functions
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, draftTemplate]);
    setDraftGame((prev) => ({ 
      ...prev, 
      questionCount: prev.questionCount + 1,
      gameTemplate: {
        ...prev.gameTemplate,
      }
     }))
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };
  /**
   *   gameDetails.grade = CCSS.split('.')[0];
      gameDetails.domain = CCSS.split('.')[1];
      gameDetails.cluster = CCSS.split('.')[2];
      gameDetails.standard = CCSS.split('.')[3];
   */

  const handleCreateNewGame = async () => {
    const draftTemplateQuestions: IQuestionTemplate[] = [];

    draftQuestionsList.forEach((draftQuestion,i) => {
      draftTemplateQuestions.push({
        id: "",
        title: draftQuestion.question.questionCard.title,
        lowerCaseTitle: draftQuestion.question.questionCard.title.toLowerCase(),
        version: 0,
        ccss: draftQuestion.question.questionCard.ccss,
        grade: draftQuestion.question.questionCard.ccss.split(".")[0],
        domain:draftQuestion.question.questionCard.ccss.split(".")[1],
        cluster: draftQuestion.question.questionCard.ccss.split(".")[2],
        standard: draftQuestion.question.questionCard.ccss.split(".")[3],
        gradeFilter: draftQuestion.question.questionCard.ccss.split(".")[0],
        gameTemplatesCount: 1,
      })
    });

  }

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal}
        handleCloseModal={handleCloseQuestionModal}
      />

      {draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal && (
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={
            draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal
          }
          handleCCSSSubmit={handleCCSSSubmit}
        />
      )}

      {/* open modals according to correct index */}
      {draftQuestionsList[selectedQuestionIndex].questionImageModalIsOpen && (
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
      )}

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftGame={draftGame}
        screenSize={screenSize}
        isModalOpen={draftGame.isGameImageUploadVisible}
        handleImageChange={handleGameImageChange}
        handleImageSave={handleGameImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      <CreatingTemplateModal
        isModalOpen={isCreatingTemplate}
        templateType={TemplateType.GAME}
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
                    completeIncorrectAnswers={completeIncorrectAnswers}
                    incompleteIncorrectAnswers={incompleteIncorrectAnswers}
                    isCardSubmitted={isQuestionCardSubmitted}
                    isCardErrored={isQuestionCardErrored}
                    highlightCard={draftQuestionItem.highlightCard}
                    isAIEnabled={draftQuestionItem.isAIEnabled}
                    isAIError={draftQuestionItem.isAIError}
                    handleDebouncedCorrectAnswerChange={handleDebouncedCorrectAnswerChange}
                    handleDebouncedCorrectAnswerStepsChange={handleDebouncedCorrectAnswerStepsChange}
                    handleDebouncedTitleChange={handleDebouncedTitleChange}
                    handlePublicPrivateChange={handlePublicPrivateQuestionChange}
                    handleDiscardQuestion={handleDiscard}
                    handleSaveQuestion={handleSaveQuestion}
                    handleAIError={handleAIError}
                    handleAIIsEnabled={handleAIIsEnabled}
                    handleNextCardButtonClick={handleNextCardButtonClick}
                    handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
                    handleClick={handleClick}
                    handleCCSSClick={handleCCSSClicks}
                    handleImageUploadClick={handleQuestionImageUploadClick}
                  />
                </Box>
              </Fade>
            ),
        )}

        {/* Question Bank goes here */}
        <Fade in={draftGame.openQuestionBank} mountOnEnter unmountOnExit timeout={500}>
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
              fetchElements={loadMoreQuestions}
              handleView={handleView}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
