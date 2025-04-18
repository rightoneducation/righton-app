import React, { useState } from 'react';
import {  IQuestionTemplate, PublicPrivateType } from '@righton/networking';

import { Box, Grid } from '@mui/material';
import {
  ScreenSize,
} from '../../lib/CentralModels';
import {
  TitleText,
  CreateGameSaveDiscardBoxContainer,
  CreateGameGridContainer,
  CreateGameSaveDiscardGridItem,
  CreateGameCardGridItem,
  GameCreateButtonStack,
} from '../../lib/styledcomponents/CreateGameStyledComponent';
import CentralButton from '../button/Button';
import { ButtonType, buttonContentMap } from '../button/ButtonModels';
import CreateGameCardBase from '../cards/creategamecard/CreateGameCardBase';
import { TGameTemplateProps, TPhaseTime } from '../../hooks/useCreateGame';
import ManageQuestionsButtons from '../button/managequestionsbutton/ManageQuestionButtons';

interface ICreateGameComponent {
  screenSize: ScreenSize;
  handleSaveGame: () => Promise<void>;
  draftGame: TGameTemplateProps;
  handleDiscard: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  handleImageUploadClick: () => void;
  onCreateQuestion: () => void;
  onOpenQuestionBank: () => void;
  phaseTime: TPhaseTime;
  handlePhaseTime: (time: TPhaseTime) => void;
  onGameTitle: (val: string) => void;
  onGameDescription: (val: string) => void;
  iconButtons: number[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  addMoreQuestions: () => void;
}

const qt: IQuestionTemplate = {
  id: '',
  title: '',
  lowerCaseTitle: '',
  version: 0,
  ccss: '',
  domain: '',
  cluster: '',
  grade: '',
  gradeFilter: '',
  standard: '',
  gameTemplatesCount: 0,
};

export default function CreateGameComponent({
  draftGame,
  screenSize,
  handleSaveGame,
  handleDiscard,
  handlePublicPrivateChange,
  handleImageUploadClick,
  onCreateQuestion,
  onOpenQuestionBank,
  phaseTime,
  onGameTitle,
  onGameDescription,
  handlePhaseTime,
  iconButtons,
  selectedIndex,
  setSelectedIndex,
  addMoreQuestions
}: ICreateGameComponent) {
  const [enabled, setEnabled] = useState<boolean>(true)

  const handleCreateQuestion = () => {
    onCreateQuestion();
  };
  
  const handleOpenQuestionBank = () => {
    onOpenQuestionBank();
  };

  const createDraftQuestion = (): { gameQuestionId: string, questionTemplate: IQuestionTemplate} => ({
gameQuestionId: "",
questionTemplate: qt,
  })
  const questions = Array.from({ length: draftGame.questionCount }).map(() => createDraftQuestion());

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
            draftGame={draftGame}
              screenSize={screenSize}
              handleImageUploadClick={handleImageUploadClick}
              handlePublicPrivateChange={handlePublicPrivateChange}
              handlePhaseTime={handlePhaseTime}
              onGameDescription={onGameDescription}
              onGameTitle={onGameTitle}
              isCardSubmitted={draftGame.isGameCardSubmitted}
              isCardErrored={draftGame.isGameCardErrored}
              phaseTime={phaseTime}
              gameTitle={draftGame.gameTemplate.title}
              gameDescription={draftGame.gameTemplate.description}
              openCreateQuestion={draftGame.openCreateQuestion}
              openQuestionBank={draftGame.openQuestionBank}

            />
          </Box>
        </CreateGameCardGridItem>
        <Grid sm md={1} lg={4} item />
      </CreateGameGridContainer>
      {/* Question Count & Add Button */}
      <GameCreateButtonStack>
        <ManageQuestionsButtons 
          questions={questions}
          iconButtons={iconButtons}
          selectedIndex={selectedIndex}
          isCreate
          setSelectedIndex={setSelectedIndex}
          addMoreQuestions={addMoreQuestions}
        />
      </GameCreateButtonStack>
      {/* Create Question & Question Bank */}
      <GameCreateButtonStack sx={{ 
        ...(screenSize === ScreenSize.SMALL && { flexDirection: 'column'})
      }}>
        <CentralButton
        smallScreenOverride
        buttonWidthOverride='100%'
          buttonType={ButtonType.CREATEQUESTION}
         isEnabled={enabled}
          onClick={handleCreateQuestion}
        />
        <CentralButton
        smallScreenOverride
        buttonWidthOverride='100%'
          buttonType={ButtonType.QUESTIONBANK}
          isEnabled={enabled}
          onClick={handleOpenQuestionBank}
        />
      </GameCreateButtonStack>
    </>
  );
}
