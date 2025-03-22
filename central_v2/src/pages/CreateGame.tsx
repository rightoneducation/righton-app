import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, styled, keyframes } from '@mui/material';
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

const fadeIn = keyframes`
from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface FadeInProps {
  visible: boolean;
  delay?: number;
  yAxis?: number;
}

export const StyledFadeIn = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "visible" && prop !== "delay" && prop !== "yAxis",
})<FadeInProps>(({ visible, delay, yAxis }) => ({
  opacity: 0,
  transform: `translateY(${yAxis ? `${yAxis}px` : "20px"})`,
  transition: `opacity 0.5s ease-in-out ${delay}s, transform 0.5s ease-in-out ${delay}s`,
  ...(visible && {
    animation: `${fadeIn} 0.5s ${delay}s forwards`,
  }),
}));


interface CreateGameProps {
  screenSize: ScreenSize;
}

export default function CreateGame({ screenSize }: CreateGameProps) {
  const navigate = useNavigate();


  const {
    questionComponentRef,
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

  console.log("Create Question clicked:", openCreateQuestion)

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
            <StyledFadeIn ref={questionComponentRef} visible={openCreateQuestion} delay={0.2}>
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
            </StyledFadeIn>
        

        {/* Question Bank goes here */}
        {/* {openQuestionBank && (
          <LibraryTabsQuestions 
          />
)} */}
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
