import React from "react";
import { CentralQuestionTemplateInput } from "@righton/networking";
import { ConfirmStateType, ModalStateType, ScreenSize, TemplateType, ModalObject } from "../../../lib/CentralModels";
import SaveGameModal from '../SaveGameModal';
import DiscardGameModal from '../DiscardGameModal';
import ConfirmSaveModal from '../ConfirmSaveModal';
import EditGameModal from '../EditGameModal';
import UpdatingModal from '../UpdatingModal';
import DeleteModal from '../DeleteModal';

interface CreateQuestionModalSwitchProps {
  modalObject: ModalObject;
  screenSize: ScreenSize;
  title: string;
  handleDiscard: () => void;
  handleCloseDiscardModal: () => void;
  handleDeleteQuestion: () => void;
  handleCloseDeleteModal: () => void;
  handlePublishQuestion: () => void;
  handleCloseSaveQuestionModal: () => void;
  handleSaveEditedQuestion: () => void;
  handleContinue: () => void;
  handleSaveDraft: () => void;
  isCardErrored: boolean;
  isDraft: boolean;
  draftQuestion: CentralQuestionTemplateInput;
  originalQuestion: CentralQuestionTemplateInput | null;
}

export default function CreateQuestionModalSwitch({ 
  modalObject,
  screenSize,
  title,
  handleDiscard,
  handleCloseDiscardModal,
  handlePublishQuestion,
  handleDeleteQuestion,
  handleCloseDeleteModal,
  handleCloseSaveQuestionModal,
  handleSaveEditedQuestion,
  handleContinue,
  handleSaveDraft,
  isCardErrored,
  isDraft,
  draftQuestion,
  originalQuestion,
}: CreateQuestionModalSwitchProps) {
  switch (modalObject.modalState) {
    case ModalStateType.DELETE:
      return <DeleteModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handleProceedToDelete={handleDeleteQuestion}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />;
      break;
    case ModalStateType.DISCARD:
      return <DiscardGameModal
        isModalOpen
        templateType={TemplateType.QUESTION}
        handleDiscardClick={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
        handleSaveEditedGame={handleSaveEditedQuestion}
        handlePublish={handlePublishQuestion}
      />;
      break;
    case ModalStateType.PUBLISH:
      return <SaveGameModal
        isModalOpen
        title={title}
        templateType={TemplateType.QUESTION}
        handlePublishGame={handlePublishQuestion}
        handleCloseSaveGameModal={handleCloseSaveQuestionModal}
        handleSaveDraft={handleSaveDraft}
        isCardErrored={isCardErrored}
        isDraft={isDraft}
        draftQuestion={draftQuestion}
        originalQuestion={originalQuestion}
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
