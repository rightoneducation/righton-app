import React from "react";
import { ModalStateType, TemplateType } from "../../../lib/CentralModels";
import SaveGameModal from '../SaveGameModal';
import DiscardGameModal from '../DiscardGameModal';
import ConfirmSaveModal from '../ConfirmSaveModal';
import UpdatingModal from '../UpdatingModal';

interface CreateGameModalSwitchProps {
  modalState: ModalStateType;
  handleDiscard: () => void;
  handleCloseDiscardModal: () => void;
  handlePublishGame: () => void;
  handleCloseSaveGameModal: () => void;
  handleContinue: () => void;
  isCardErrored: boolean;
}

export default function CreateGameModalSwitch({ 
  modalState,
  handleDiscard,
  handleCloseDiscardModal,
  handlePublishGame,
  handleCloseSaveGameModal,
  handleContinue,
  isCardErrored,
}: CreateGameModalSwitchProps) {

  switch (modalState) {
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
        isCardErrored={isCardErrored}
      />;
      break;
    case ModalStateType.UPDATING:
      return <UpdatingModal
        isModalOpen
        templateType={TemplateType.GAME}
      />;
      break;
    case ModalStateType.CONFIRM:
      return <ConfirmSaveModal
        isModalOpen
        templateType={TemplateType.GAME}
        handleContinue={handleContinue}
      />;
    default:
     return null;
  }
}