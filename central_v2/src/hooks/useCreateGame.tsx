import { useState, useCallback, useRef } from 'react';
import { PublicPrivateType } from '@righton/networking';
import { useNavigate } from 'react-router-dom';
import { StorageKey } from '../lib/CentralModels';

export type TGameInfo = {
  title: string;
  description: string;
};

export type TPhaseTime = {
  phaseOne: string;
  phaseTwo: string;
};

const useCreateGame = () => {
  const navigate = useNavigate();
  const questionComponentRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const [isGameCardSubmitted, setIsGameCardSubmitted] =
    useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [openQuestionBank, setOpenQuestionBank] = useState<boolean>(false);
  const [openCreateQuestion, setOpenCreateQuestion] = useState<boolean>(false);
  const [publicPrivateGame, setPublicPrivateGame] = useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isGameCardErrored, setIsGameCardErrored] = useState<boolean>(false);
  const [gameTitle, setGameTitle] = useState<string>('');
  const [gameDescription, setGameDescription] = useState<string>('');
  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });
  const [isGameImageUploadVisible, setIsGameImageUploadVisible] = useState<boolean>(false);
  const [isGameURLUploadVisible, setIsGameURLUploadVisible] = useState<boolean>(false);

  const shouldOpenOnClick = 
  gameTitle !== "" && 
  gameDescription !== "" &&
  phaseTime.phaseOne !== "" &&
  phaseTime.phaseTwo !== ""


  const handleGameTitle = (val: string) => {
    setGameTitle(val);
  };

  const handleGameDescription = (val: string) => {
    setGameDescription(val);
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    setPhaseTime((prev) => ({
      ...prev,
      ...(time.phaseOne && { phaseOne: time.phaseOne }),
      ...(time.phaseTwo && { phaseTwo: time.phaseTwo }),
    }));
  };

  const handleSaveGame = useCallback(async () => {
    // api call goes here.
    // game card errors should be handled here too.
    setIsGameCardSubmitted(true);
  }, []);

  const handleOpenCreateQuestion = useCallback(() => {
    if (openQuestionBank && shouldOpenOnClick) {
      setOpenQuestionBank(false);
    }
    if(shouldOpenOnClick) {
        setOpenCreateQuestion((prev) => !prev);
    }
  }, [openQuestionBank, shouldOpenOnClick]);

  const handleOpenQuestionBank = useCallback(() => {
    if (openCreateQuestion) {
      setOpenCreateQuestion(false);
    }
    if(shouldOpenOnClick) {
        setOpenQuestionBank((prev) => !prev);
    }
  }, [openCreateQuestion, shouldOpenOnClick]);

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setPublicPrivateGame((prev) => value);
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {
    setIsGameImageUploadVisible(true)
  };

  const handleCloseGameCardModal = () => {
    setIsGameImageUploadVisible(false)
  }

  return {
    questionComponentRef,
    topRef,
    isGameCardSubmitted,
    isGameCardErrored,
    questionCount,
    openQuestionBank,
    openCreateQuestion,
    publicPrivateGame,
    phaseTime,
    gameTitle,
    gameDescription,
    isGameImageUploadVisible,
    setIsGameCardErrored,
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
