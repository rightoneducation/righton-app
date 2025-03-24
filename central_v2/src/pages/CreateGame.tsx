import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAPIClients, IQuestionTemplate } from '@righton/networking';
import { Box, Collapse, Fade, Slide } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  StyledFadeIn,
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
import tabDraftsIcon from '../images/tabDrafts.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';

interface CreateGameProps {
  screenSize: ScreenSize;
}

export default function CreateGame({ screenSize }: CreateGameProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [favQuestions, setFavQuestions] = useState<IQuestionTemplate[]>([]);
  const [selectQuestions, setSelectedQuestion] = useState<IQuestionTemplate>();
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const {
    questionComponentRef,
    topRef,
    isGameCardSubmitted,
    questionCount,
    openQuestionBank,
    openCreateQuestion,
    publicPrivateGame,
    isGameCardErrored,
    handleOpenCreateQuestion,
    handleOpenQuestionBank,
    handlePublicPrivateGameChange,
    handleSaveGame,
    handleDiscardGame,
    handleGameImageUploadClick,
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
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions,
  } = useExploreQuestionsStateManager();


  useEffect(() => {
    const timeout = setTimeout(() => {
      if((openCreateQuestion || openQuestionBank) && ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },300);

    return () => clearTimeout(timeout);
  },[ref, openCreateQuestion, openQuestionBank]);
  

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

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

  const handleView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen(true);
  };

  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE) return value;
    if (screen === ScreenSize.MEDIUM && isSelected) return value;
    return '';
  };

  return (
    <CreateGameMainContainer ref={topRef} sx={{ overflowY: 'auto' }}>
      <CreateGameBackground />
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

      <CreateGameBoxContainer>
        <CreateGameComponent
          screenSize={screenSize}
          handleSaveGame={handleSaveGame}
          handleDiscard={handleDiscardGame}
          handlePublicPrivateChange={handlePublicPrivateGameChange}
          handleImageUploadClick={handleGameImageUploadClick}
          onCreateQuestion={handleOpenCreateQuestion}
          onOpenQuestionBank={handleOpenQuestionBank}
          isCardSubmitted={isGameCardSubmitted}
          questionCount={questionCount}
          isCardErrored={isGameCardErrored}
          highlightCard={highlightCard}
        />

        {/* Create Question Form  */}
        <Fade
          
          timeout={500}
          in={openCreateQuestion}
          unmountOnExit
        >
          <Box ref={ref}>
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
          />
          </Box>
        </Fade>

        {/* Question Bank goes here */}
        <Fade
          in={openQuestionBank}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box ref={ref}>
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
