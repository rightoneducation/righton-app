import React from "react";
import { ModalStateType, ScreenSize, TemplateType } from "../../../lib/CentralModels";
import SaveGameModal from '../SaveGameModal';
import DiscardGameModal from '../DiscardGameModal';
import ConfirmSaveModal from '../ConfirmSaveModal';
import UpdatingModal from '../UpdatingModal';

interface CreateQuestionModalSwitchProps {
  modalState: ModalStateType;
  screenSize: ScreenSize;
  handleDiscard: () => void;
  handleCloseDiscardModal: () => void;
  handlePublishQuestion: () => void;
  handleCloseSaveQuestionModal: () => void;
  handleContinue: () => void;
  isCardErrored: boolean;
}

export default function CreateQuestionModalSwitch({ 
  modalState,
  screenSize,
  handleDiscard,
  handleCloseDiscardModal,
  handlePublishQuestion,
  handleCloseSaveQuestionModal,
  handleContinue,
  isCardErrored,
}: CreateQuestionModalSwitchProps) {
  switch (modalState) {
    case ModalStateType.DISCARD:
      return <DiscardGameModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handleDiscardClick={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
      />;
      break;
    case ModalStateType.PUBLISH:
      return <SaveGameModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handlePublishGame={handlePublishQuestion}
        handleCloseSaveGameModal={handleCloseSaveQuestionModal}
        isCardErrored={isCardErrored}
      />;
      break;
    case ModalStateType.LOADING:
    case ModalStateType.SAVING:
    case ModalStateType.PUBLISHING:
      return <UpdatingModal
        modalState={modalState}
        isModalOpen
        templateType={TemplateType.QUESTION}
      />;
      break;
    case ModalStateType.CONFIRM:
      return <ConfirmSaveModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handleContinue={handleContinue}
      />;
    default:
     return null;
  }
}
