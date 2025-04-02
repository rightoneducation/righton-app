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
import { type TDraftQuestionsList } from '../hooks/useCreateQuestion';

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
  const draftTemplate: TDraftQuestionsList = {
    publicPrivate: PublicPrivateType.PUBLIC,
    isAIEnabled: false,
    isAIError: false,
    question: newEmptyTemplate,
    questionImageModalIsOpen: false,
    isCCSSVisibleModal: false,
    publicPrivateQuestion: PublicPrivateType.PUBLIC,
    isImageUploadVisible: false,
    isImageURLVisible: false,
    isCreatingTemplate: false,
    highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
  };

  const newGameTemplate = {
    id: '',
    title: '',
    lowerCaseTitle: '',
    owner: '',
    version: 0,
    description: '',
    lowerCaseDescription: '',
    phaseOneTime: 0,
    phaseTwoTime: 0,
    questionTemplatesCount: 0,
    questionTemplatesOrder: [],
  };
  const [gameTemplate, setGameTemplate] =
    useState<IGameTemplate>(newGameTemplate);

  // game template functions
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, draftTemplate]);
    setQuestionCount((prev) => prev + 1);
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  return (
    <CreateGameMainContainer ref={topRef} sx={{ overflowY: 'auto' }}>
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
      {/* <CreateGameImageUploadModal
        draftQuestion={draftQuestion}
        screenSize={screenSize}
        isModalOpen={isGameImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseGameCardModal}
      /> */}

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
