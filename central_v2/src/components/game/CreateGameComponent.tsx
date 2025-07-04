import React, { useState } from 'react';
import { IQuestionTemplate, PublicPrivateType } from '@righton/networking';
import { Box, CircularProgress, Grid, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/CentralModels';
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
import {
  TGameTemplateProps,
  TPhaseTime,
  TDraftQuestionsList,
} from '../../lib/CreateGameModels';
import ManageQuestionsButtons from '../button/managequestionsbutton/ManageQuestionButtons';

interface ICreateGameComponent {
  screenSize: ScreenSize;
  isClone: boolean;
  isEdit: boolean;
  isLoading: boolean;
  isCloneImageChanged: boolean;
  label: string;
  handleSaveGame: () => Promise<void>;
  handleSaveDraftGame: () => Promise<void>;
  draftGame: TGameTemplateProps;
  draftQuestionsList?: TDraftQuestionsList[];
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
  handleDeleteQuestion: (index: number) => void;
}

const qt: IQuestionTemplate = {
  id: '',
  userId: '',
  publicPrivateType: PublicPrivateType.PUBLIC,
  title: '',
  lowerCaseTitle: '',
  version: 0,
  ccss: '',
  ccssDescription: '',
  domain: '',
  cluster: '',
  grade: '',
  gradeFilter: '',
  standard: '',
  gameTemplatesCount: 0,
};

export default function CreateGameComponent({
  draftGame,
  draftQuestionsList,
  isClone,
  isEdit,
  isLoading,
  isCloneImageChanged,
  label,
  screenSize,
  handleSaveGame,
  handleSaveDraftGame,
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
  addMoreQuestions,
  handleDeleteQuestion,
}: ICreateGameComponent) {
  const theme = useTheme();
  const [enabled, setEnabled] = useState<boolean>(true);
  const handleCreateQuestion = () => {
    onCreateQuestion();
  };

  const handleOpenQuestionBank = () => {
    onOpenQuestionBank();
  };

  const createDraftQuestion = (): {
    gameQuestionId: string;
    questionTemplate: IQuestionTemplate;
  } => ({
    gameQuestionId: '',
    questionTemplate: qt,
  });
  const questions = Array.from({ length: draftGame.questionCount }).map(() =>
    createDraftQuestion(),
  );

  return (
    <>
      <TitleText screenSize={screenSize}>{label} Game</TitleText>
      <>
        {/* Save & Discard Button for Small & Medium Screen Size */}
        {screenSize === ScreenSize.MEDIUM && (
          <Box
            style={{
              width: 'fit-content',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: `${theme.sizing.xSmPadding}px`,
              paddingBottom: '16px',
            }}
          >
            <CentralButton
              buttonType={ButtonType.SAVE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride="105px"
              onClick={handleSaveGame}
            />
            {!isEdit && (
              <CentralButton
                buttonType={ButtonType.SAVEDRAFT}
                isEnabled
                smallScreenOverride
                onClick={handleSaveDraftGame}
              />
            )}
            <CentralButton
              buttonType={ButtonType.DISCARDBLUE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride="134px"
              onClick={handleDiscard}
            />
          </Box>
        )}

        {screenSize === ScreenSize.SMALL && (
          <Box
            style={{
              width: '100%',
              maxWidth: '672px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: `${theme.sizing.xSmPadding}px`,
              paddingBottom: '16px',
            }}
          >
            <CentralButton
              buttonType={ButtonType.SAVE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride="275px"
              onClick={handleSaveGame}
            />
            {!isEdit && (
              <CentralButton
                buttonType={ButtonType.SAVEDRAFT}
                isEnabled
                smallScreenOverride
                buttonWidthOverride="275px"
                onClick={handleSaveDraftGame}
              />
            )}
            <CentralButton
              buttonType={ButtonType.DISCARDBLUE}
              isEnabled
              smallScreenOverride
              buttonWidthOverride="275px"
              onClick={handleDiscard}
            />
          </Box>
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
                    buttonWidthOverride="160px"
                    onClick={handleSaveGame}
                  />
                  {!isEdit && (
                    <CentralButton
                      buttonType={ButtonType.SAVEDRAFT}
                      isEnabled
                      smallScreenOverride
                      buttonWidthOverride="160px"
                      onClick={handleSaveDraftGame}
                    />
                  )}
                  <CentralButton
                    buttonType={ButtonType.DISCARDBLUE}
                    isEnabled
                    buttonWidthOverride="160px"
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
            <CreateGameCardBase
              draftGame={draftGame}
              isClone={isClone}
              isEdit={isEdit}
              isCloneImageChanged={isCloneImageChanged}
              label={label}
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
          </CreateGameCardGridItem>

          <Grid sm md={1} lg={4} item />
        </CreateGameGridContainer>

        {/* Question Count & Add Button */}
        {/* Adds scroll functionality */}
        <GameCreateButtonStack
          sx={{
            maxWidth: '100%',
            overflow: 'scroll',
            minHeight: '40px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <ManageQuestionsButtons
            questions={draftQuestionsList ?? questions}
            iconButtons={iconButtons}
            selectedIndex={selectedIndex}
            isCreate
            setSelectedIndex={setSelectedIndex}
            addMoreQuestions={addMoreQuestions}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        </GameCreateButtonStack>

        {/* Create Question & Question Bank */}
        <GameCreateButtonStack
          sx={{
            ...(screenSize === ScreenSize.SMALL && {
              flexDirection: 'column',
            }),
          }}
        >
          <CentralButton
            smallScreenOverride
            buttonWidthOverride={
              screenSize === ScreenSize.SMALL ||
              screenSize === ScreenSize.MEDIUM
                ? '222px'
                : '100%'
            }
            buttonType={ButtonType.CREATEQUESTION}
            isEnabled={enabled}
            onClick={handleCreateQuestion}
          />
          <CentralButton
            smallScreenOverride
            buttonWidthOverride={
              screenSize === ScreenSize.SMALL ||
              screenSize === ScreenSize.MEDIUM
                ? '200px'
                : '100%'
            }
            buttonType={ButtonType.QUESTIONBANK}
            isEnabled={enabled}
            onClick={handleOpenQuestionBank}
          />
        </GameCreateButtonStack>
      </>
    </>
  );
}
