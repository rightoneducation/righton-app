import { useState, useCallback, useRef } from 'react';
import { PublicPrivateType } from '@righton/networking';
import { useNavigate } from 'react-router-dom';
import { StorageKey } from '../lib/CentralModels';

const useCreateGame = () => {
  const navigate = useNavigate();
  const questionComponentRef = useRef<HTMLDivElement | null>(null);
  const [isGameCardSubmitted, setIsGameCardSubmitted] =
    useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [openQuestionBank, setOpenQuestionBank] = useState<boolean>(false);
  const [openCreateQuestion, setOpenCreateQuestion] = useState<boolean>(false);
  const [publicPrivateGame, setPublicPrivateGame] = useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isGameCardErrored, setIsGameCardErrored] = useState<boolean>(false);

  const handleSaveGame = useCallback(async () => {
    // api call goes here.
    setIsGameCardSubmitted(true);
  }, []);

  const handleOpenCreateQuestion = useCallback(() => {
    if (openQuestionBank) {
      setOpenQuestionBank(false);
    }

    setOpenCreateQuestion((prev) => {
        // note - this is true
        const newState = !prev;
        // scroll down to question component elment
        if(newState && questionComponentRef.current) {
            questionComponentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }

        // scroll up if clicked again.
        if(!newState) {
            window.scrollTo({
                top: 0,
                behavior:'smooth'
            })
        }
        return newState
    });
  }, [openQuestionBank]);

  const handleOpenQuestionBank = useCallback(() => {
    if (openCreateQuestion) {
      setOpenCreateQuestion(false);
    }
    setOpenQuestionBank((prev) => !prev);
  }, [openCreateQuestion]);

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setPublicPrivateGame((prev) => value);
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {};

  return {
    questionComponentRef,
    isGameCardSubmitted,
    isGameCardErrored,
    questionCount,
    openQuestionBank,
    openCreateQuestion,
    publicPrivateGame,
    handleOpenCreateQuestion,
    handleOpenQuestionBank,
    handlePublicPrivateGameChange,
    handleDiscardGame,
    handleSaveGame,
    handleGameImageUploadClick,
  };
};

export default useCreateGame;