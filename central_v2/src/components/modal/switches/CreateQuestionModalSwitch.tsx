import React from "react";
import { ConfirmStateType, ModalStateType, ScreenSize, TemplateType, ModalObject } from "../../../lib/CentralModels";
import SaveGameModal from '../SaveGameModal';
import DiscardGameModal from '../DiscardGameModal';
import ConfirmSaveModal from '../ConfirmSaveModal';
import EditGameModal from '../EditGameModal';
import UpdatingModal from '../UpdatingModal';

interface CreateQuestionModalSwitchProps {
  modalObject: ModalObject;
  screenSize: ScreenSize;
  handleDiscard: () => void;
  handleCloseDiscardModal: () => void;
  handlePublishQuestion: () => void;
  handleCloseSaveQuestionModal: () => void;
  handleSaveEditedQuestion: () => void;
  handleContinue: () => void;
  handleSaveDraft: () => void;
  isCardErrored: boolean;
  isDraft: boolean;
}

export default function CreateQuestionModalSwitch({ 
  modalObject,
  screenSize,
  handleDiscard,
  handleCloseDiscardModal,
  handlePublishQuestion,
  handleCloseSaveQuestionModal,
  handleSaveEditedQuestion,
  handleContinue,
  handleSaveDraft,
  isCardErrored,
  isDraft
}: CreateQuestionModalSwitchProps) {
  switch (modalObject.modalState) {
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
        handleSaveDraft={handleSaveDraft}
        isCardErrored={isCardErrored}
        isDraft={isDraft}
      />;
      break;
    case ModalStateType.UPDATE:
      return <EditGameModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handleSaveEditedGame={handleSaveEditedQuestion}
        handleCloseSaveGameModal={handleCloseSaveQuestionModal}
        isCardErrored={isCardErrored}
      />;
      break;
    case ModalStateType.LOADING:
    case ModalStateType.SAVING:
    case ModalStateType.PUBLISHING:
      return <UpdatingModal
        modalState={modalObject.modalState}
        isModalOpen
        templateType={TemplateType.QUESTION}
      />;
      break;
    case ModalStateType.CONFIRM:
      return <ConfirmSaveModal
        isModalOpen
        confirmState={modalObject.confirmState}
        templateType={TemplateType.QUESTION}
        handleContinue={handleContinue}
      />;
    default:
     return null;
  }
}
