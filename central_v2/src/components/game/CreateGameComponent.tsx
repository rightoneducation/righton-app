import React, { useState, useCallback } from 'react';
import { createQuestion, PublicPrivateType } from '@righton/networking';
import { debounce } from 'lodash';
import { Box, Grid } from '@mui/material';
import {
  ScreenSize,
  CreateQuestionHighlightCard,
  StorageKey,
} from '../../lib/CentralModels';
import {
  TitleText,
  CreateGameSaveDiscardBoxContainer,
  CreateGameGridContainer,
  CreateGameSaveDiscardGridItem,
  CreateGameCardGridItem,
  GameCreateButtonStack,
  QuestionCountButton,
  AddMoreIconButton,
} from '../../lib/styledcomponents/CreateGameStyledComponent';
import CentralButton from '../button/Button';
import { ButtonType, buttonContentMap } from '../button/ButtonModels';
import CreateGameCardBase from '../cards/creategamecard/CreateGameCardBase';
import VerticalMoreImg from '../../images/buttonIconVerticalMore.svg';
import { TGameInfo, TPhaseTime } from '../../hooks/useCreateGame';
import ManageQuestionsButtons from '../button/managequestionsbutton/ManageQuestionButtons';

interface ICreateGameComponent {
  screenSize: ScreenSize;
  handleSaveGame: () => Promise<void>;
  handleDiscard: () => void;
  isCardSubmitted: boolean;
  questionCount: number;
  isCardErrored: boolean;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  handleImageUploadClick: () => void;
  onCreateQuestion: () => void;
  onOpenQuestionBank: () => void;
  phaseTime: TPhaseTime;
  handlePhaseTime: (time: TPhaseTime) => void;
  gameTitle: string;
  gameDescription: string;
  onGameTitle: (val: string) => void;
  onGameDescription: (val: string) => void;
  onGameCardError: React.Dispatch<React.SetStateAction<boolean>>;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
}

// vertical ellipsis image for button
const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function CreateGameComponent({
  screenSize,
  handleSaveGame,
  handleDiscard,
  handlePublicPrivateChange,
  handleImageUploadClick,
  onCreateQuestion,
  onOpenQuestionBank,
  isCardSubmitted,
  questionCount,
  isCardErrored,
  phaseTime,
  gameTitle,
  gameDescription,
  onGameTitle,
  onGameDescription,
  handlePhaseTime,
  onGameCardError,
  openQuestionBank,
  openCreateQuestion,
}: ICreateGameComponent) {
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [enableButton, setEnableButton] = useState<{[key: string]: boolean}>({
    createQuestion: true,
    questionBank: true,
  });

  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    debounce((title: string) => {
      window.localStorage.setItem(StorageKey, JSON.stringify(title));
    }, 1000),
    [],
  );

  const createGameFormIsValid = 
    phaseTime.phaseOne !== "" && 
    phaseTime.phaseTwo !=="" &&
    gameTitle !== "" &&
    gameDescription !== "";

  const handleCreateQuestion = () => {
    onCreateQuestion();
    if(createGameFormIsValid) {
      // setEnableButton((prev) => ({ 
      //   ...prev,
      //   createQuestion: prev.createQuestion,
      //   questionBank: !prev.questionBank,
      // }))
      if(isCardErrored) {
        onGameCardError(false)
      }
    } else {
      onGameCardError(true);
    }
  };
  
  const handleOpenQuestionBank = () => {
    onOpenQuestionBank();
    if(createGameFormIsValid){
      // setEnableButton((prev) => ({ 
      //   ...prev,
      //   questionBank: prev.questionBank, 
      //   createQuestion: !prev.createQuestion,
      // }))
      if(isCardErrored) {
        onGameCardError(false)
      }
    } else {
      onGameCardError(true);
    }
  };

  return (
    <>
      <TitleText screenSize={screenSize}>Create Game</TitleText>
      {/* Save & Discard Button for Small & Medium Screen Size */}
      {(screenSize === ScreenSize.SMALL ||
        screenSize === ScreenSize.MEDIUM) && (
        <CreateGameSaveDiscardBoxContainer screenSize={screenSize}>
          <CentralButton
            buttonType={ButtonType.SAVE}
            isEnabled
            smallScreenOverride
            onClick={handleSaveGame}
          />
          <CentralButton
            buttonType={ButtonType.DISCARDBLUE}
            isEnabled
            smallScreenOverride
            onClick={handleDiscard}
          />
        </CreateGameSaveDiscardBoxContainer>
      )}

      <CreateGameGridContainer container wrap="nowrap">
        {/* Grid item for Save & Discard Buttons for Large Screen Size */}
        <CreateGameSaveDiscardGridItem item sm md={1} lg={4}>
          {screenSize !== ScreenSize.SMALL &&
            screenSize !== ScreenSize.MEDIUM && (
              <CreateGameSaveDiscardBoxContainer screenSize={screenSize}>
                <CentralButton
                  buttonType={ButtonType.SAVE}
                  isEnabled
                  onClick={handleSaveGame}
                />
                <CentralButton
                  buttonType={ButtonType.DISCARDBLUE}
                  isEnabled
                  onClick={handleDiscard}
                />
              </CreateGameSaveDiscardBoxContainer>
            )}
        </CreateGameSaveDiscardGridItem>
        {/* Grid Item for Create Game Card */}
        <CreateGameCardGridItem
          item
          sm={12}
          md={10}
          lg={4}
          screenSize={screenSize}
        >
          <Box style={{ width: '100%' }}>
            <CreateGameCardBase
              screenSize={screenSize}
              handleImageUploadClick={handleImageUploadClick}
              handlePublicPrivateChange={handlePublicPrivateChange}
              handlePhaseTime={handlePhaseTime}
              onGameDescription={onGameDescription}
              onGameTitle={onGameTitle}
              isCardSubmitted={isCardSubmitted}
              isCardErrored={isCardErrored}
              phaseTime={phaseTime}
              gameTitle={gameTitle}
              gameDescription={gameDescription}
              disableForm={disableForm}
              openCreateQuestion={openCreateQuestion}
              openQuestionBank={openQuestionBank}

            />
          </Box>
        </CreateGameCardGridItem>
        <Grid sm md={1} lg={4} item />
      </CreateGameGridContainer>
      {/* Question Count & Add Button */}
      <GameCreateButtonStack>
        <ManageQuestionsButtons />
      </GameCreateButtonStack>
      {/* Create Question & Question Bank */}
      <GameCreateButtonStack sx={{ 
        ...(screenSize === ScreenSize.SMALL && { flexDirection: 'column'})
      }}>
        <CentralButton
        smallScreenOverride
        buttonWidthOverride='100%'
          buttonType={ButtonType.CREATEQUESTION}
          isEnabled={enableButton.createQuestion}
          onClick={handleCreateQuestion}
        />
        <CentralButton
        smallScreenOverride
        buttonWidthOverride='100%'
          buttonType={ButtonType.QUESTIONBANK}
          isEnabled={enableButton.questionBank}
          onClick={handleOpenQuestionBank}
        />
      </GameCreateButtonStack>
    </>
  );
}
