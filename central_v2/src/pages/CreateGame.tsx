import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Collapse, Fade, styled } from '@mui/material';
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

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'openCreateQuestion'
})<{openCreateQuestion: boolean}>(({theme, openCreateQuestion}) => ({
  transition: openCreateQuestion
  ? 'opacity 300ms ease, transform 300ms ease-in-out'
  : 'opacity 300ms ease, transform 150ms ease-in-out',
opacity: openCreateQuestion ? 1 : 0,
transform: openCreateQuestion ? 'translateY(0px)' : 'translateY(-20px)',
}))
interface CreateGameProps {
  screenSize: ScreenSize;
}

export default function CreateGame({ screenSize }: CreateGameProps) {
  const navigate = useNavigate();

  const {
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

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  return (
    <CreateGameMainContainer sx={{ overflowY: 'auto' }}>
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
        {openCreateQuestion && (
          <Collapse in={openCreateQuestion} timeout={1000}>
            <StyledBox openCreateQuestion={openCreateQuestion}>

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
              handleCCSSClick={handleCCSSClick}
            />
            </StyledBox>
          </Collapse>
        )}

        {/* Question Bank goes here */}
        {/* {openQuestionBank && (
          <LibraryTabsQuestions 
          />
)} */}
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
