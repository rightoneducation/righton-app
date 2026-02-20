import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ScreenSize, ModalStateType } from "../../lib/CentralModels";
import DuplicateModal from "../modal/DuplicateModal";
// import CreateQuestionModalSwitch from '../components/modal/switches/CreateQuestionModalSwitch';
import ModalBackground from "../modal/ModalBackground";

interface ViewQuestionHeaderProps {
  handleBackClick: () => void;
  handleEditQuestion: () => void;
  handleCloneQuestion: () => void;
  handleDeleteQuestion: () => void;
  handleAddToGameClick: () => void;
  handleFavoriteClick: () => void;
  isEditEnabled: boolean;
  isOwner: boolean;
  screenSize: ScreenSize;
}

export default function ViewQuestionHeader({
  handleBackClick,
  handleEditQuestion,
  handleCloneQuestion,
  handleDeleteQuestion,
  handleAddToGameClick,
  handleFavoriteClick,
  isEditEnabled,
  isOwner,
  screenSize
}: ViewQuestionHeaderProps) {
  const theme = useTheme();
  const [modalState, setModalState] = useState<ModalStateType>(ModalStateType.NULL);
  const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState<boolean>(false);
  // breakpoint for <1500px 
  const isMediumLargeScreen = useMediaQuery('(max-width: 1500px)');


  const handleCloseDiscardModal = () => {
    setModalState(ModalStateType.NULL);
  };

  const handleConfirmModal = () => {
    handleCloneQuestion()  
  };

  const handleCloseQuestionModal = () => {
    setModalState(ModalStateType.NULL);
  };

  return (
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
          <DuplicateModal
            isModalOpen
            handleCloseDiscardModal={handleCloseDiscardModal}
            handleConfirmModal={handleConfirmModal}
          />
        )}
        <Box style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TitleText style={{lineHeight: '48px'}} screenSize={screenSize}>View {isOwner ? 'My' : ''} Question</TitleText>
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
                    buttonWidthOverride={isMediumLargeScreen ? '40px' : 'auto'}
                    iconOnlyOverride={isMediumLargeScreen}
                    smallScreenOverride={isMediumLargeScreen}
                    onClick={handleEditQuestion}
                  />
                ) :(
                  <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                    <CentralButton
                      buttonType={ButtonType.FAVORITE}
                      isEnabled
                      buttonWidthOverride={isMediumLargeScreen ? '40px' : 'auto'}
                      iconOnlyOverride={isMediumLargeScreen}
                      smallScreenOverride={isMediumLargeScreen}
                      onClick={handleFavoriteClick}
                    />
                    <CentralButton
                      buttonType={ButtonType.DUPLICATE}
                      isEnabled
                      buttonWidthOverride={isMediumLargeScreen ? '40px' : 'auto'}
                      iconOnlyOverride={isMediumLargeScreen}
                      smallScreenOverride={isMediumLargeScreen}
                      onClick={() =>{
                        setModalState(ModalStateType.DUPLICATE)
                      }}
                    />
                  </Box>
                )}
                <CentralButton
                  buttonType={ButtonType.ADDTOGAMEPINK}
                  isEnabled
                  buttonWidthOverride={isMediumLargeScreen ? '40px' : 'auto'}
                  iconOnlyOverride={isMediumLargeScreen}
                  smallScreenOverride={isMediumLargeScreen}
                  onClick={handleAddToGameClick}
                />
              </Box>
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
              onClick={handleEditQuestion}
            />
          ) :(
            <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
              <CentralButton
                buttonType={ButtonType.FAVORITE}
                isEnabled
                iconOnlyOverride
                buttonWidthOverride='48px'
                onClick={handleFavoriteClick}
              />
              <CentralButton
                buttonType={ButtonType.DUPLICATE}
                isEnabled
                iconOnlyOverride
                buttonWidthOverride='48px'
                onClick={() => setModalState(ModalStateType.DUPLICATE)}
              />
            </Box>
          )}
          <CentralButton
            buttonType={ButtonType.ADDTOGAMEPINK}
            isEnabled
            onClick={handleAddToGameClick}
          />
        </Box>
      )}
    </Box>
  );
}

