import { useState, useCallback, useRef } from 'react';
import { PublicPrivateType, IGameTemplate } from '@righton/networking';
import { useNavigate } from 'react-router-dom';
import { StorageKey } from '../lib/CentralModels';
import { reverseTimesMap } from '../components/cards/creategamecard/time';

export type TGameInfo = {
  title: string;
  description: string;
};

export type TPhaseTime = {
  phaseOne: string;
  phaseTwo: string;
};

export type TGameTemplateProps = {
  gameTemplate: IGameTemplate,
  isGameCardSubmitted: boolean;
  questionCount: number;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
  publicPrivateGame: PublicPrivateType
  isGameCardErrored: boolean;
  isGameImageUploadVisible: boolean;
  isGameURLUploadVisible: boolean;
  image?: File | null;
  imageUrl?: string | undefined;
}

const useCreateGame = () => {
  const navigate = useNavigate();
  const newGameTemplate = {
    id: '',
    title: '',
    lowerCaseTitle: '',
    owner: '',
    version: 0,
    description: '',
    lowerCaseDescription: '',
    phaseOneTime: 0,
    phaseTwoTime: 0,
    questionTemplatesCount: 0,
    questionTemplatesOrder: [],
  };

  const gameTemplate:TGameTemplateProps = {
    gameTemplate: newGameTemplate,
    isGameCardErrored: false,
    isGameCardSubmitted: false,
    questionCount: 1,
    openCreateQuestion: false,
    openQuestionBank: false,
    publicPrivateGame: PublicPrivateType.PUBLIC,
    isGameImageUploadVisible: false,
    isGameURLUploadVisible: false,
    image: null,
    imageUrl: ""
  }

  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });

  const gameFormIsValid = 
  draftGame.gameTemplate.title !== "" && 
  draftGame.gameTemplate.description !== "" &&
  draftGame.gameTemplate.phaseOneTime !== 0 &&
  draftGame.gameTemplate.phaseTwoTime !== 0;

  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        title: val,
        lowerCaseTitle: val.toLowerCase(),
      }
    }))
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        description: val,
        lowerCaseDescription: val.toLowerCase(),
      }
    }))
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    setDraftGame((prev) => {
      const phaseOne = reverseTimesMap[time.phaseOne];
      const phaseTwo = reverseTimesMap[time.phaseTwo];
      const updatedGameTemplate = {
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
         ...(time.phaseOne && { phaseOneTime: phaseOne }),
         ...(time.phaseTwo && { phaseTwoTime: phaseTwo })
        }
      }
      return updatedGameTemplate;
    })
    setPhaseTime((prev) => ({
      ...prev,
      ...(time.phaseOne && { phaseOne: time.phaseOne }),
      ...(time.phaseTwo && { phaseTwo: time.phaseTwo }),
    }));
  };

  const handleOpenCreateQuestion = () => {
    setDraftGame((prev) => ({
      ...prev,
      // check if form is complete & if question bank is open, close it.
      ...(draftGame.openQuestionBank && gameFormIsValid && { openQuestionBank: false }),
      // check game form is complete before displaying question form
      ...(gameFormIsValid && { openCreateQuestion: !prev.openCreateQuestion }),
      // if the card was in an error state, but not anymore set it to false
      ...(gameFormIsValid && draftGame.isGameCardErrored && { isGameCardErrored: false }),
      // if the form is not valid, flag an error
      ...(!gameFormIsValid && { isGameCardErrored: true })
    }))
  }

  const handleOpenQuestionBank =() => {
    setDraftGame((prev) => ({
      ...prev,
      ...(draftGame.openCreateQuestion && gameFormIsValid && { openCreateQuestion: false }),
      ...(gameFormIsValid && { openQuestionBank: !prev.openQuestionBank }),
      ...(gameFormIsValid && draftGame.isGameCardErrored && { isGameCardErrored: false }),
      ...(!gameFormIsValid && { isGameCardErrored: true })
    }))
  };

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setDraftGame((prev) => ({
      ...prev,
      publicPrivateGame: value
    }))
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: !prev.isGameImageUploadVisible,
    }))
  };

  const handleCloseGameCardModal = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: false,
    }))
  }

  const handleSaveGame = useCallback(async () => {
    // api call goes here.
    // game card errors should be handled here too.
    setDraftGame((prev) => ({...prev, isGameCardSubmitted: true }));
  }, []);

  const handleGameImageSave = async (inputImage?: File, inputUrl?: string) => {
    
    if(inputImage) {
      setDraftGame((prev) => ({ 
        ...prev,
        image: inputImage,
        imageUrl: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }))
    }

    if(inputUrl) {
      setDraftGame((prev) => ({ 
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }))
    }
  }

  const handleGameImageChange = async (inputImage?: File, inputUrl?: string) => {
    if(inputImage) {
      setDraftGame((prev) => ({ 
        ...prev,
        image: inputImage,
        imageUrl: undefined,
      }))
    }

    if(inputUrl) {
      setDraftGame((prev) => ({ 
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
      }))
    }
    
  }

  return {
    phaseTime,
    draftGame,
    handleGameImageSave,
    handleGameImageChange,
    setDraftGame,
    handleGameTitle,
    handleGameDescription,
    handlePhaseTime,
    handleOpenCreateQuestion,
    handleOpenQuestionBank,
    handlePublicPrivateGameChange,
    handleDiscardGame,
    handleSaveGame,
    handleGameImageUploadClick,
    handleCloseGameCardModal
  };
};

export default useCreateGame;
