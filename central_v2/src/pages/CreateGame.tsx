import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CentralQuestionTemplateInput, IGameTemplate, IQuestionTemplate } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import { ScreenSize, StorageKey, TemplateType } from '../lib/CentralModels';
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
    setIsGameCardErrored
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
    handleCCSSSubmit,
    setDraftQuestion,
    setHighlightCard,
    handleDebouncedCorrectAnswerChange,
    handleDebouncedCorrectAnswerStepsChange,
    handleDebouncedTitleChange,
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
  
  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  // game template functions
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index)
  }

  const handleAddMoreQuestions = () => {
    setQuestionCount((prev) => prev + 1);
    setIconButtons((prev) => [...prev, prev.length + 1])
  }

  return (
    <CreateGameMainContainer ref={topRef} sx={{ overflowY: 'auto' }}>
      <CreateGameBackground />

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftQuestion={draftQuestion}
        screenSize={screenSize}
        isModalOpen={isGameImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseGameCardModal}
      
      />
       {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={
          isImageUploadVisible ||
          isImageURLVisible ||
          isCreatingTemplate ||
          isCCSSVisible
        }
        handleCloseModal={handleCloseQuestionModal}
      />
      <CCSSTabs
        screenSize={screenSize}
        isTabsOpen={isCCSSVisible}
        handleCCSSSubmit={handleCCSSSubmit}
      />
      <ImageUploadModal
        draftQuestion={draftQuestion}
        screenSize={screenSize}
        isModalOpen={isImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseQuestionModal}
      />
      <CreatingTemplateModal
        isModalOpen={isCreatingTemplate}
        templateType={TemplateType.GAME}
      />
      {/* Modals for Question (Above) */}
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

        {/* Create Question Form  */}
        <Fade
          timeout={500}
          in={openCreateQuestion}
          mountOnEnter
          unmountOnExit
        >
          <Box>
           <QuestionElements
            screenSize={screenSize}
            draftQuestion={draftQuestion}
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
            handlePublicPrivateChange={handlePublicPrivateQuestionChange}
            handleDiscardQuestion={handleDiscard}
            handleSaveQuestion={handleSaveQuestion}
            handleAIError={handleAIError}
            handleAIIsEnabled={handleAIIsEnabled}
            handleNextCardButtonClick={handleNextCardButtonClick}
            handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
            handleClick={handleClick}
            handleCCSSClick={handleCCSSClick}
            handleImageUploadClick={handleQuestionImageUploadClick}
          /> </Box>
        </Fade>

        {/* Question Bank goes here */}
        <Fade
          in={openQuestionBank}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
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
