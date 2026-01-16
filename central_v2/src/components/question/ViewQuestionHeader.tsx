import React, { useState } from "react";
import { Box } from "@mui/material";
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
  isEditEnabled: boolean;
  isOwner: boolean;
  screenSize: ScreenSize;
}

export default function ViewQuestionHeader({
  handleBackClick,
  handleEditQuestion,
  handleCloneQuestion,
  handleDeleteQuestion,
  isEditEnabled,
  isOwner,
  screenSize
}: ViewQuestionHeaderProps) {
  const theme = useTheme();
  const [modalState, setModalState] = useState<ModalStateType>(ModalStateType.NULL);
  const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState<boolean>(false);


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
                    buttonWidthOverride='127px'
                    onClick={handleEditQuestion}
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
                        // handleCloneQuestion()
                      }}
                    />
                  </Box>
                )}
                <CentralButton
                  buttonType={ButtonType.ADDTOGAMEPINK}
                  isEnabled
                  buttonWidthOverride="auto"
                  onClick={handleBackClick}
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
                onClick={handleBackClick}
              />
              <CentralButton
                buttonType={ButtonType.DUPLICATE}
                isEnabled
                iconOnlyOverride
                buttonWidthOverride='48px'
                onClick={handleCloneQuestion}
              />
            </Box>
          )}
          <CentralButton
            buttonType={ButtonType.ADDTOGAMEPINK}
            isEnabled
            onClick={handleBackClick}
          />
        </Box>
      )}
    </Box>
  );
}

