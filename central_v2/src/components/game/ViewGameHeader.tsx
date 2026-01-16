import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ModalStateType, ScreenSize } from "../../lib/CentralModels";
import ModalBackground from "../modal/ModalBackground";
import DuplicateGameModal from "../modal/DuplicateGameModal";

interface ViewGameHeaderProps {
  handleBackClick: () => void;
  handleEditGame: () => void;
  handleLaunchGame: () => void;
  handleDuplicate: () => void;
  handleCloneGame: () => void;
  label: string;
  screenSize: ScreenSize;
  isOwner: boolean;
  isIncompleteDraft: boolean;
}

export default function ViewGameHeader({handleCloneGame,  handleDuplicate, handleBackClick, handleEditGame, handleLaunchGame,  label, screenSize, isOwner, isIncompleteDraft }: ViewGameHeaderProps) {
  
  const [modalState, setModalState] = useState<ModalStateType>(ModalStateType.NULL);
  const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState<boolean>(false);

  const handleCloseQuestionModal = () => {
    setModalState(ModalStateType.NULL);
  };

  const handleCloseDiscardModal = () => {
    setModalState(ModalStateType.NULL);
  };

  const handleConfirmModal = () => {
    handleCloneGame()  
  };

  const theme = useTheme();


  return(
    <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.mdPadding}px` }}>
      <Box style={{ 
        height: '48px',
        width: '100%', 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`, 
        paddingBottom: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`,
        }}>
          <ModalBackground
            isModalOpen={
              isCCSSVisibleModal ||
              modalState !== ModalStateType.NULL
            }
            handleCloseModal={handleCloseQuestionModal}
          /> 
        {modalState === ModalStateType.DUPLICATE && (
            <DuplicateGameModal
              isModalOpen
              handleCloseDiscardModal={handleCloseDiscardModal}
              handleConfirmModal={handleConfirmModal}
            />
          )}
        <Box style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TitleText style={{lineHeight: '48px'}} screenSize={screenSize}>{label} {isOwner ? 'My' : ''} Game</TitleText>
        </Box>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <CentralButton
            buttonType={ButtonType.BACK}
            isEnabled
            iconOnlyOverride={screenSize !== ScreenSize.LARGE}
            buttonWidthOverride={screenSize !== ScreenSize.LARGE ? '48px' : '127px'}
            onClick={handleBackClick}
          />
          
          {screenSize === ScreenSize.LARGE && (
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: `${theme.sizing.xSmPadding}px` }}>
              <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
              {isOwner ? (
                <CentralButton
                  buttonType={ButtonType.EDIT}
                  isEnabled
                  buttonWidthOverride='127px'
                  onClick={handleEditGame}
                />
              ) :(
                <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                  <CentralButton
                    buttonType={ButtonType.FAVORITE}
                    isEnabled
                    onClick={handleBackClick}
                  />
                  <CentralButton
                    buttonType={ButtonType.DUPLICATE}
                    isEnabled
                    onClick={() =>{
                      setModalState(ModalStateType.DUPLICATE)
                    }}
                  />
                </Box>
              )}
                <CentralButton
                  buttonType={ButtonType.LAUNCHPINK}
                  isEnabled={!isIncompleteDraft}
                  buttonWidthOverride="140px"
                  onClick={handleLaunchGame}
                />
              </Box>
              {isIncompleteDraft && (
                <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                  <Typography style={{ fontSize: '14px', color: '#000', fontFamily: 'Rubik', fontWeight: '400' }}>To launch your game, finish editing by completing all required fields.</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {screenSize !== ScreenSize.LARGE && (
        <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
        {isOwner ? (
              <CentralButton
                buttonType={ButtonType.EDIT}
                isEnabled
                iconOnlyOverride
                buttonWidthOverride='48px'
                onClick={handleBackClick}
              />
            ) :(
              <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                <CentralButton
                  buttonType={ButtonType.FAVORITE}
                  isEnabled
                  iconOnlyOverride
                  buttonWidthOverride='48px'
                  onClick={handleBackClick}
                />
                <CentralButton
                  buttonType={ButtonType.DUPLICATE}
                  isEnabled
                  iconOnlyOverride
                  buttonWidthOverride='48px'
                  onClick={handleBackClick}
                />
              </Box>
            )}
          <CentralButton
            buttonType={ButtonType.LAUNCHPINK}
            isEnabled={!isIncompleteDraft}
            onClick={handleLaunchGame}
          />
        </Box>
      )}
    </Box>
  )
}

