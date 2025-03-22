import React, { useState, useCallback } from 'react';
import { PublicPrivateType } from '@righton/networking';
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

interface ICreateGameComponent {
  screenSize: ScreenSize;
  handleSaveGame: () => Promise<void>;
  handleDiscard: () => void;
  isCardSubmitted: boolean;
  questionCount: number;
  isCardErrored: boolean;
  highlightCard: CreateQuestionHighlightCard;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  handleImageUploadClick: () => void;
  onCreateQuestion: () => void;
  onOpenQuestionBank: () => void;
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
  highlightCard,
}: ICreateGameComponent) {
  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    debounce((title: string) => {
      window.localStorage.setItem(StorageKey, JSON.stringify(title));
    }, 1000),
    [],
  );

  const handleCreateQuestion = () => {
    // if gamecard is complete...TODO
    onCreateQuestion();
  };

  const handleOpenQuestionBank = () => {
    onOpenQuestionBank();
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
              handleTitleChange={handleDebouncedTitleChange}
              isHighlight={
                highlightCard === CreateQuestionHighlightCard.QUESTIONCARD
              }
              handleImageUploadClick={handleImageUploadClick}
              handlePublicPrivateChange={handlePublicPrivateChange}
              isCardSubmitted={isCardSubmitted}
              isCardErrored={isCardErrored}
            />
          </Box>
        </CreateGameCardGridItem>
        <Grid sm md={1} lg={4} item />
      </CreateGameGridContainer>
      {/* Question Count & Add Button */}
      <GameCreateButtonStack>
        <QuestionCountButton endIcon={verticalEllipsis} isDisabled={false}>
          Question {questionCount}
        </QuestionCountButton>
        <AddMoreIconButton>
          <img
            alt="add-question"
            src={buttonContentMap[ButtonType.ADDSTEP].icon}
          />
        </AddMoreIconButton>
      </GameCreateButtonStack>
      {/* Create Question & Question Bank */}
      <GameCreateButtonStack>
        <CentralButton
          buttonType={ButtonType.CREATEQUESTION}
          isEnabled
          onClick={handleCreateQuestion}
        />
        <CentralButton
          buttonType={ButtonType.QUESTIONBANK}
          isEnabled
          onClick={handleOpenQuestionBank}
        />
      </GameCreateButtonStack>
    </>
  );
}
