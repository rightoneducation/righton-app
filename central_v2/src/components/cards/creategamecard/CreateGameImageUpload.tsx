import React from 'react';
import { CentralQuestionTemplateInput } from '@righton/networking';
import ImageUploadModal from "../../modal/ImageUploadModal";
import { ScreenSize } from '../../../lib/CentralModels';

interface ICreateGameImageUpload {
 screenSize: ScreenSize;
  isModalOpen: boolean;
  draftQuestion: CentralQuestionTemplateInput;
  handleImageChange: (inputImage?: File, inputUrl?: string) => void;
  handleImageSave: (image?: File, inputUrl?: string) => void;
  handleCloseModal: () => void;
}
export default function CreateGameImageUploadModal({
    screenSize,
    isModalOpen,
    draftQuestion,
    handleImageChange,
    handleImageSave,
    handleCloseModal,
}: ICreateGameImageUpload) {

    return <ImageUploadModal
    draftQuestion={draftQuestion} 
    screenSize={screenSize}  
    isModalOpen={isModalOpen} 
    handleImageChange={handleImageChange}
    handleImageSave={handleImageSave} 
    handleCloseModal={handleCloseModal}
    />
}