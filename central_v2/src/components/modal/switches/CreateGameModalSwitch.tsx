import React from "react";
import { CentralQuestionTemplateInput, PublicPrivateType } from "@righton/networking";
import { ModalStateType, ScreenSize, TemplateType, ConfirmStateType, ModalObject } from "../../../lib/CentralModels";
import SaveGameModal from '../SaveGameModal';
import DiscardGameModal from '../DiscardGameModal';
import ConfirmSaveModal from '../ConfirmSaveModal';
import UpdatingModal from '../UpdatingModal';
import CreateQuestionModal from '../CreateQuestionModal';
// import DuplicateModal from "../DuplicateModal";

interface CreateGameModalSwitchProps {
  modalObject: ModalObject;
  screenSize: ScreenSize;
  publicPrivate: PublicPrivateType;
  handleDiscard: () => void;
  handleCloseDiscardModal: () => void;
  handlePublishGame: () => void;
  handleCloseSaveGameModal: () => void;
  handleContinue: () => void;
  handleCreateQuestion: (draftQuestion: CentralQuestionTemplateInput) => void;
  handleCloseCreateQuestionModal: () => void;
  handleSaveDraft: () => void;
  isCardErrored: boolean;
}

export default function CreateGameModalSwitch({ 
  modalObject,
  screenSize,
  publicPrivate,
  handleDiscard,
  handleCloseDiscardModal,
  handlePublishGame,
  handleCloseSaveGameModal,
  handleContinue,
  handleCreateQuestion,
  handleCloseCreateQuestionModal,
  handleSaveDraft,
  isCardErrored,
}: CreateGameModalSwitchProps) {

  switch (modalObject.modalState) {
    case ModalStateType.CREATEQUESTION:
      return <CreateQuestionModal
        isModalOpen
        screenSize={screenSize}
        publicPrivate={publicPrivate}
        handleCreateQuestion={handleCreateQuestion}
        handleCloseCreateQuestionModal={handleCloseCreateQuestionModal}
      />;
      break;
    case ModalStateType.DISCARD:
      return <DiscardGameModal
        isModalOpen
        templateType={TemplateType.GAME}
        handleDiscardClick={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
      />;
      break;
    case ModalStateType.PUBLISH:
      return <SaveGameModal
        isModalOpen
        templateType={TemplateType.GAME}
        handlePublishGame={handlePublishGame}
        handleCloseSaveGameModal={handleCloseSaveGameModal}
        handleSaveDraft={handleSaveDraft}
        isCardErrored={isCardErrored}
      />;
      break;
    case ModalStateType.LOADING:
    case ModalStateType.SAVING:
    case ModalStateType.PUBLISHING:
      return <UpdatingModal
        modalState={modalObject.modalState}
        isModalOpen
        templateType={TemplateType.GAME}
      />;
      break;
    case ModalStateType.CONFIRM:
      return <ConfirmSaveModal
        isModalOpen
        confirmState={modalObject.confirmState}
        templateType={TemplateType.GAME}
        handleContinue={handleContinue}
      />;
    default:
     return null;
  }
}