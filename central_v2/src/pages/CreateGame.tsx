import React, { useState, useCallback, useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import {
  AnswerType,
  AnswerPrecision,
  CentralQuestionTemplateInput,
  IGameTemplate,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
  CreatePublicGameTemplateInput,
  CreatePrivateGameQuestionsInput,
  CreatePublicGameQuestionsInput
} from '@righton/networking';
import { Box, Fade } from '@mui/material';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  CreateQuestionHighlightCard,
  GameQuestionType,
  ScreenSize,
  StorageKey,
  TemplateType,
} from '../lib/CentralModels';
import ModalBackground from '../components/modal/ModalBackground';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import LibraryTabsQuestions from '../components/librarytabs/LibraryTabsQuestions';
import useExploreQuestionsStateManager from '../hooks/useExploreQuestionsStateManager';
import tabExploreQuestionsIcon from '../images/tabPublic.svg';
import tabMyQuestionsIcon from '../images/tabMyQuestions.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import CreateGameImageUploadModal from '../components/cards/creategamecard/CreateGameImageUpload';
import { reverseTimesMap, timeLookup } from '../components/cards/creategamecard/time';
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import {
  updateDQwithCCSS,
  updateDQwithImage,
  updateDQwithImageURL,
  updateDQwithQuestionClick,
  updateDQwithTitle,
} from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import {
  updateDQwithCorrectAnswer,
  updateDQwithCorrectAnswerClick,
  updateDQwithCorrectAnswerSteps,
  updateDQwithAnswerSettings,
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { assembleQuestionTemplate } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';

interface CreateGameProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: () => void;
}

// Library Questions
const tabMap: { [key: number]: string } = {
  0: 'Explore Questions',
  1: 'My Questions',
  2: 'Favorites',
};

const tabIconMap: { [key: number]: string } = {
  0: tabExploreQuestionsIcon,
  1: tabMyQuestionsIcon,
  2: tabFavoritesIcon,
};

// Create Question
type TDraftQuestionsList = {
  publicPrivate: PublicPrivateType;
  isAIEnabled: boolean;
  isAIError: boolean;
  question: CentralQuestionTemplateInput;
  questionImageModalIsOpen: boolean;
  isCCSSVisibleModal: boolean;
  isImageUploadVisible: boolean;
  isImageURLVisible: boolean;
  isCreatingTemplate: boolean;
  isQuestionCardErrored: boolean;
  isQuestionCardSubmitted: boolean;
  highlightCard: CreateQuestionHighlightCard;
  isMultipleChoice: boolean;
  questionTemplate: IQuestionTemplate;
};

const newEmptyTemplate: CentralQuestionTemplateInput = {
  questionCard: {
    title: '',
    ccss: 'CCSS',
    isFirstEdit: true,
    isCardComplete: false,
  },
  correctCard: {
    answer: '',
    answerSteps: ['', '', ''],
    answerSettings: {
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
    },
    isFirstEdit: true,
    isCardComplete: false,
  },
  incorrectCards: [
    {
      id: 'card-1',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
    {
      id: 'card-2',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
    {
      id: 'card-3',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
  ],
};

const emptyQuestionTemplate: IQuestionTemplate = {
  id: '',
  title: '',
  lowerCaseTitle: '',
  version: 0,
  ccss: '',
  domain: '',
  cluster: '',
  grade: '',
  gradeFilter: '',
  standard: '',
  gameTemplatesCount: 0,
};

const draftTemplate: TDraftQuestionsList = {
  publicPrivate: PublicPrivateType.PUBLIC,
  isAIEnabled: false,
  isAIError: false,
  question: newEmptyTemplate,
  questionImageModalIsOpen: false,
  isCCSSVisibleModal: false,
  isImageUploadVisible: false,
  isImageURLVisible: false,
  isCreatingTemplate: false,
  isQuestionCardErrored: false,
  isQuestionCardSubmitted: false,
  highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
  isMultipleChoice: true,
  questionTemplate: emptyQuestionTemplate,
};

// Create Game
export type TGameTemplateProps = {
  gameTemplate: IGameTemplate;
  isGameCardSubmitted: boolean;
  questionCount: number;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
  publicPrivateGame: PublicPrivateType;
  isGameCardErrored: boolean;
  isGameImageUploadVisible: boolean;
  isGameURLUploadVisible: boolean;
  isCreatingTemplate: boolean;
  image?: File | null;
  imageUrl?: string | undefined;
};

export type TPhaseTime = {
  phaseOne: string;
  phaseTwo: string;
};

const newGameTemplate: IGameTemplate = {
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
  imageUrl: null
};

const gameTemplate: TGameTemplateProps = {
  gameTemplate: newGameTemplate,
  isGameCardErrored: false,
  isGameCardSubmitted: false,
  questionCount: 1,
  openCreateQuestion: false,
  openQuestionBank: false,
  publicPrivateGame: PublicPrivateType.PUBLIC,
  isGameImageUploadVisible: false,
  isGameURLUploadVisible: false,
  isCreatingTemplate: false,
  image: null,
  imageUrl: '',
};

export default function CreateGame({ 
  screenSize,
  fetchElement,
  fetchElements
}: CreateGameProps) {
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const route = useMatch('/clone/game/:gameId');
  const isClone = route?.params.gameId !== null && route?.params.gameId !== undefined && route?.params.gameId.length > 0;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [saveQuestionError, setSaveQuestionError] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [originalGameImageUrl, setOriginalGameImageUrl] = useState<string>('');
  const [draftQuestionsList, setDraftQuestionsList] = useState<
    TDraftQuestionsList[]
  >([draftTemplate]);
  const [originalQuestionImageUrls, setOriginalQuestionImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });

  const gameFormIsValid =
    draftGame.gameTemplate.title !== '' &&
    draftGame.gameTemplate.description !== '' &&
    draftGame.gameTemplate.phaseOneTime !== 0 &&
    draftGame.gameTemplate.phaseTwoTime !== 0;

  const allDQAreValid = draftQuestionsList.every((dq, index) => {
    const isValid =
      dq.question.questionCard.isCardComplete &&
      dq.question.correctCard.isCardComplete &&
      dq.question.incorrectCards.every((card) => card.isCardComplete);

    return isValid;
  });

  /** CREATE GAME HANDLERS START HERE */
  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        title: val,
        lowerCaseTitle: val.toLowerCase(),
      },
    }));
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        description: val,
        lowerCaseDescription: val.toLowerCase(),
      },
    }));
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
          ...(time.phaseTwo && { phaseTwoTime: phaseTwo }),
        },
      };
      return updatedGameTemplate;
    });
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
      ...(draftGame.openQuestionBank &&
        gameFormIsValid && { openQuestionBank: false }),
      // check game form is complete before displaying question form
      ...(gameFormIsValid && { openCreateQuestion: !prev.openCreateQuestion }),
      // if the card was in an error state, but not anymore set it to false
      ...(gameFormIsValid &&
        draftGame.isGameCardErrored && { isGameCardErrored: false }),
      // if the form is not valid, flag an error
      ...(!gameFormIsValid && { isGameCardErrored: true }),
    }));
  };

  const handleOpenQuestionBank = () => {
    setDraftGame((prev) => ({
      ...prev,
      ...(draftGame.openCreateQuestion &&
        gameFormIsValid && { openCreateQuestion: false }),
      ...(gameFormIsValid && { openQuestionBank: !prev.openQuestionBank }),
      ...(gameFormIsValid &&
        draftGame.isGameCardErrored && { isGameCardErrored: false }),
      ...(!gameFormIsValid && { isGameCardErrored: true }),
    }));
  };

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setDraftGame((prev) => ({
      ...prev,
      publicPrivateGame: value,
    }));
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: !prev.isGameImageUploadVisible,
    }));
  };

  const handleCloseGameCardModal = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: false,
    }));
  };
  const handleGameImageSave = async (inputImage?: File, inputUrl?: string) => {
    if (inputImage) {
      setDraftGame((prev) => ({
        ...prev,
        image: inputImage,
        imageUrl: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }));
    }

    if (inputUrl) {
      setDraftGame((prev) => ({
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }));
    }
  };

  const handleGameImageChange = async (
    inputImage?: File,
    inputUrl?: string,
  ) => {
    if (inputImage) {
      setDraftGame((prev) => ({
        ...prev,
        image: inputImage,
        imageUrl: undefined,
      }));
    }

    if (inputUrl) {
      setDraftGame((prev) => ({
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
      }));
    }
  };

  const handleSaveGame = async () => {
    try {
      // set our card submitted state to true to check for errors and flag creating template to triggle loading modal
      setDraftGame((prev) => ({ ...prev, isGameCardSubmitted: true, isCreatingTemplate: true }));
      // check that the game form and question form is valid
      if (gameFormIsValid && allDQAreValid) {
        // check if user added image or image url
        let gameImgUrl: string | null = null;
        if ((draftGame.image || draftGame.imageUrl)){
          if ((!isClone || draftGame.imageUrl !== originalGameImageUrl)) {
            let gameImgResult = null;
            // handle case for image type: File
            if (draftGame.image) {
              const gameImg = await apiClients.gameTemplate.storeImageInS3(
                draftGame.image,
              );
              gameImgResult = await gameImg.result;
              if (gameImgResult && gameImgResult.path && gameImgResult.path.length > 0) {
                gameImgUrl = gameImgResult.path;
              }
              // handle case for imageUrl type: string
            } else if (draftGame.imageUrl) {
              gameImgUrl = await apiClients.gameTemplate.storeImageUrlInS3(
                draftGame.imageUrl,
              );
            }
          } else {
            gameImgUrl = originalGameImageUrl;
          }
        }
        // create game template and store in variable to retrieve id after response
        const createGame: CreatePublicGameTemplateInput = {
          title: draftGame.gameTemplate.title,
          lowerCaseTitle: draftGame.gameTemplate.title.toLowerCase(),
          description: draftGame.gameTemplate.description,
          lowerCaseDescription: draftGame.gameTemplate.description.toLowerCase(),
          questionTemplatesCount: 0,
          version: 0,
          phaseOneTime: draftGame.gameTemplate.phaseOneTime,
          phaseTwoTime: draftGame.gameTemplate.phaseTwoTime,
          ccss: draftQuestionsList[0].question.questionCard.ccss,
          grade: draftQuestionsList[0].question.questionCard.ccss.split(".")[0],
          gradeFilter: draftQuestionsList[0].question.questionCard.ccss.split(".")[0],
          domain: draftQuestionsList[0].question.questionCard.ccss.split(".")[1],
          cluster: draftQuestionsList[0].question.questionCard.ccss.split(".")[2],
          standard: draftQuestionsList[0].question.questionCard.ccss.split(".")[3],
          imageUrl: gameImgUrl
        };

        const gameTemplateResponse =
          await apiClients.gameTemplate.createGameTemplate(
            draftGame.publicPrivateGame,
            createGame,
          );

        // map over questions, handle image or image url cases and return updated question templates
        const newQuestionTemplates = draftQuestionsList.map(async (dq, i) => {
          let result = null;
          let url = null;

          // if we aren't cloning, or we have changed the image while cloning, write to s3
          if (!isClone || dq.question.questionCard.imageUrl !== originalQuestionImageUrls[i]) {
            // image file case
            if (dq.question.questionCard.image) {
              try {
                const img = await apiClients.questionTemplate.storeImageInS3(
                  dq.question.questionCard.image,
                );
                result = await img.result;
                if (result && result.path && result.path.length > 0) {
                  url = result.path;
                }
              } catch (err) {
                console.error('Error storing image:', err);
                throw new Error('Failed to store image.');
              }
            }
            // image url case
            else if (dq.question.questionCard.imageUrl) {
              try {
                url = await apiClients.questionTemplate.storeImageUrlInS3(
                  dq.question.questionCard.imageUrl,
                );
              } catch (err) {
                console.error('Error storing image URL:', err);
                throw new Error('Failed to store image URL.');
              }
            }
          } else {
            url = originalQuestionImageUrls[i];
          }
          console.log(dq.question);
          let newQuestionResponse: IQuestionTemplate | undefined;
        
          // if an image url is available, we can create a question template
          if (url) {
            try {
              newQuestionResponse =
                await apiClients.questionTemplate.createQuestionTemplate(
                  dq.publicPrivate,
                  url,
                  dq.question,
                );
            } catch (err) {
              console.error('Error creating question template:', err);
              throw new Error('Failed to create question template.');
            }
          }

          // return updated question with POST response
          return newQuestionResponse;
        });

        // write new questions to db
        const questionTemplateResponse =
          await Promise.all(newQuestionTemplates);

        // create an array of all the ids from the response and store in variable
        const questionTemplateIds = questionTemplateResponse.map(
          (question) => question?.id,
        );

        // make sure we have a gameTemplate id as well as question template ids before creating a game question
        if (gameTemplateResponse.id && questionTemplateIds.length > 0) {
          const createGameQuestions = questionTemplateIds.map(
            async (questionId, i) => {
              const gameQuestion: CreatePublicGameQuestionsInput | CreatePrivateGameQuestionsInput = {
              ...(draftGame.publicPrivateGame === PublicPrivateType.PUBLIC ? {
                publicGameTemplateID: String(gameTemplateResponse.id),
                publicQuestionTemplateID: String(questionId),
              }:{
                privateGameTemplateID: String(gameTemplateResponse.id),
                privateQuestionTemplateID: String(questionId),
              }),
              }
              console.log("Game Question: ",gameQuestion)
            try {
              const response = await apiClients.gameQuestions.createGameQuestions(
                draftGame.publicPrivateGame,
                gameQuestion,
              );
              console.log("Response: ", response);
            } catch(err) {
              setDraftGame((prev) => ({...prev, isCreatingTemplate: false}))
              console.error(`Failed to create game question at index ${i}:`, err);
            }
            },
          );
          // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
            await Promise.all(createGameQuestions);
        }
        setDraftGame((prev) => ({ ...prev, isCreatingTemplate: false, isGameCardSubmitted: false }));
        fetchElements(); 
        navigate('/');
      } else {
        // set draft game error
        setDraftGame((prev) => ({ ...prev, isGameCardErrored: true, isCreatingTemplate: false }));
        // flag error and return to stop operation.
          setSaveQuestionError(true);
      }
    } catch (err) {
      console.log(`HandleSaveGame - error: ${err}`);
    }
  };
  /** END OF CREATE GAME HANDLERS  */

  /** CREATE QUESTION HANDLERS START */
  const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const newDraftQuestion = {
            ...questionItem,
            publicPrivate: value,
          };
          return newDraftQuestion;
        }
        return questionItem;
      });
    });
  };

  const handleAIIsEnabled = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((item, i) => {
        if (i === selectedQuestionIndex) {
          return {
            ...item,
            isAIEnabled: !item.isAIEnabled,
            isAIError: !item.isAIError,
          };
        }
        return item;
      });
    });
  };

  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = questionItem.question;
          if (inputImage) {
            const newDraftQuestion = updateDQwithImage(
              currentDraftQuestion,
              undefined,
              inputImage,
            );
            const updatedImageItem = {
              ...questionItem,
              question: newDraftQuestion,
            };
            return updatedImageItem;
          }

          if (inputUrl) {
            const newDraftQuestion = updateDQwithImageURL(
              currentDraftQuestion,
              inputUrl,
            );
            const updatedImageURLItem = {
              ...questionItem,
              question: newDraftQuestion,
            };
            return updatedImageURLItem;
          }
        }
        return questionItem;
      });
    });
  };

  const handleImageSave = async (inputImage?: File, inputUrl?: string) => {
    setDraftQuestionsList((draftPrev) => {
      return draftPrev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = questionItem.question;
          const { isCardComplete } = questionItem.question.questionCard;
          if (inputImage) {
            const newDraftQuestion = updateDQwithImage(
              currentDraftQuestion,
              undefined,
              inputImage,
            );
            const updatedDraftQuestion = {
              ...questionItem,
              question: newDraftQuestion,
              isImageUploadVisible: false,
              isImageURLVisible: false,
              isCreatingTemplate: false,
              isCCSSVisibleModal: false,
              questionImageModalIsOpen: false,
              ...(isCardComplete && {
                highlightCard: CreateQuestionHighlightCard.CORRECTANSWER,
              }),
            };
            return updatedDraftQuestion;
          }

          if (inputUrl) {
            const newDraftQuestion = updateDQwithImageURL(
              currentDraftQuestion,
              inputUrl,
            );
            const updatedDraftQuestion = {
              ...questionItem,
              question: newDraftQuestion,
              isImageUploadVisible: false,
              isImageURLVisible: false,
              isCreatingTemplate: false,
              isCCSSVisibleModal: false,
              questionImageModalIsOpen: false,
              ...(isCardComplete && {
                highlightCard: CreateQuestionHighlightCard.CORRECTANSWER,
              }),
            };
            return updatedDraftQuestion;
          }
        }
        return questionItem;
      });
    });
  };

  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    (title: string) => {
      setDraftQuestionsList((draftPrev) => {
        return draftPrev.map((questionItem, i) => {
          if (i === selectedQuestionIndex) {
            const { isCardComplete, isFirstEdit } =
              questionItem.question.questionCard;
            const newDraftQuestion = updateDQwithTitle(
              questionItem.question,
              title,
            );
            const updatedItem: TDraftQuestionsList = {
              ...questionItem,
              question: newDraftQuestion,
              ...(isCardComplete &&
                isFirstEdit && {
                  highlightCard: CreateQuestionHighlightCard.CORRECTANSWER,
                }),
              questionTemplate: {
                ...questionItem.questionTemplate,
                title,
              },
            };
            return updatedItem;
          }
          return questionItem;
        });
      });
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerChange = useCallback(// eslint-disable-line
    (
      correctAnswer: string,
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      setDraftQuestionsList((draftPrev) => {
        return draftPrev.map((questionItem, i) => {
          if (i === selectedQuestionIndex) {
            const { isCardComplete, isFirstEdit } =
              questionItem.question.correctCard;
            const newDraftQuestion = updateDQwithCorrectAnswer(
              questionItem.question,
              correctAnswer,
            );
            const updatedItem = {
              ...questionItem,
              question: newDraftQuestion,
              ...(isCardComplete &&
                isFirstEdit && {
                  highlightCard: CreateQuestionHighlightCard.INCORRECTANSWER1,
                }),
              questionTemplate: {
                ...questionItem.questionTemplate,
              },
            };
            return updatedItem;
          }
          return questionItem;
        });
      });
    },
    [selectedQuestionIndex],
  );

  const handleDebouncedCorrectAnswerStepsChange = useCallback(// eslint-disable-line
    (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      setDraftQuestionsList((draftPrev) => {
        return draftPrev.map((questionItem, i) => {
          if (i === selectedQuestionIndex) {
            const { isCardComplete, isFirstEdit } =
              questionItem.question.questionCard;
            const newDraftQuestion = updateDQwithCorrectAnswerSteps(
              questionItem.question,
              steps,
            );
            const updatedItem = {
              ...questionItem,
              question: newDraftQuestion,
              ...(isCardComplete &&
                isFirstEdit && {
                  highlightCard: CreateQuestionHighlightCard.INCORRECTANSWER1,
                }),
            };
            return updatedItem;
          }
          return questionItem;
        });
      });
    },
    [selectedQuestionIndex],
  );

  const handleAnswerSettingsChange = (draftQuestionInput: CentralQuestionTemplateInput, answerType: AnswerType, answerPrecision?: AnswerPrecision ) => {
    setDraftQuestionsList((prev) => {
      return prev.map((draftItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = draftItem.question;
          const newQuestion = updateDQwithAnswerSettings(
            currentDraftQuestion,
            answerType,
            answerPrecision,
          );
          return {
            ...draftItem,
            question: newQuestion,
          };
        }
        return draftItem;
      });
    });
  };

  const handleAnswerType = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((draftItem, i) => {
        if (i === selectedQuestionIndex) {
          const updatedItem = {
            ...draftItem,
            isMultipleChoice: !draftItem.isMultipleChoice,
          };
          return updatedItem;
        }
        return draftItem;
      });
    });
  };

  const handleCloseQuestionModal = () => {
    if (draftGame.isGameImageUploadVisible) {
      setDraftGame((prev) => ({ ...prev, isGameImageUploadVisible: false }));
    }
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const updatedItem = {
            ...questionItem,
            isImageUploadVisible: false,
            isImageURLVisible: false,
            isCreatingTemplate: false,
            isCCSSVisibleModal: false,
            questionImageModalIsOpen: false,
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = questionItem.question;
          const { isCardComplete: correctCardComplete } =
            currentDraftQuestion.correctCard;
          const { isCardComplete: questionCardComplete } =
            questionItem.question.questionCard;
          switch (cardType) {
            case CreateQuestionHighlightCard.CORRECTANSWER:
              if (correctCardComplete) {
                const newDraftQuestion =
                  updateDQwithCorrectAnswerClick(currentDraftQuestion);
                return { ...questionItem, question: newDraftQuestion };
              }
              break;
            case CreateQuestionHighlightCard.INCORRECTANSWER1:
            case CreateQuestionHighlightCard.INCORRECTANSWER2:
            case CreateQuestionHighlightCard.INCORRECTANSWER3: {
              // then we can update the draftQuestion for the api call and the localStorage for retreival, respectively
              const newDraftQuestion = updateDQwithIncorrectAnswerClick(
                currentDraftQuestion,
                cardType,
              );
              return { ...questionItem, question: newDraftQuestion };
            }

            case CreateQuestionHighlightCard.QUESTIONCARD:
            default:
              if (questionCardComplete) {
                const newDraftQuestion =
                  updateDQwithQuestionClick(currentDraftQuestion);
                return { ...questionItem, question: newDraftQuestion };
              }
              break;
          }
        }
        return questionItem;
      });
    });
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestionsList((draftPrev) => {
      return draftPrev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const { isCardComplete, isFirstEdit } =
            questionItem.question.questionCard;
          const newDraftQuestion = updateDQwithCCSS(
            questionItem.question,
            ccssString,
          );
          const updatedItem = {
            ...questionItem,
            question: newDraftQuestion,
            isCCSSVisibleModal: false,
            ...(isCardComplete &&
              isFirstEdit && {
                highlightCard: CreateQuestionHighlightCard.CORRECTANSWER,
              }),
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    setDraftQuestionsList((prev) => {
      const nextCard = getNextHighlightCard(
        cardData.id as CreateQuestionHighlightCard,
      );
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = questionItem.question;
          const incompleteAnswers = currentDraftQuestion.incorrectCards.filter(
            (answer) => !answer.isCardComplete,
          );
          const completeAnswers = currentDraftQuestion.incorrectCards.filter(
            (answer) => answer.isCardComplete,
          );

          const updatedAnswer = incompleteAnswers.map((answer) =>
            answer.id === cardData.id ? cardData : answer,
          );
          const { newIncompleteAnswers, newCompleteAnswers } =
            handleMoveAnswerToComplete(updatedAnswer, completeAnswers);

          const newDraftQuestion = updateDQwithIncorrectAnswers(
            currentDraftQuestion,
            newIncompleteAnswers,
            newCompleteAnswers,
          );

          const updatedItem = {
            ...questionItem,
            question: newDraftQuestion,
            isAIError: false,
            ...(nextCard && {
              highlightCard: nextCard as CreateQuestionHighlightCard,
            }),
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleIncorrectCardStackUpdate = (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => {
    setDraftQuestionsList((prev) => {
      const nextCard = getNextHighlightCard(
        cardData.id as CreateQuestionHighlightCard,
      );
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const currentDraftQuestion = questionItem.question;
          const isUpdateInIncompleteCards = incompleteAnswers.find(
            (answer) => answer.id === cardData.id,
          );
          const isCardComplete =
            cardData.answer.length > 0 && cardData.explanation.length > 0;

          if (isUpdateInIncompleteCards) {
            const updatedIncompleteAnswers = incompleteAnswers.map((answer) =>
              answer.id === cardData.id ? cardData : answer,
            );

            if (isCardComplete && !isAIEnabledCard) {
              const { newIncompleteAnswers, newCompleteAnswers } =
                handleMoveAnswerToComplete(
                  updatedIncompleteAnswers,
                  completeAnswers,
                );
              const updatedDraftQuestion = updateDQwithIncorrectAnswers(
                currentDraftQuestion,
                newIncompleteAnswers,
                newCompleteAnswers,
              );
              const updatedItem = {
                ...questionItem,
                question: updatedDraftQuestion,
                isAIError: false,
                ...(cardData.isFirstEdit && {
                  highlightCard: nextCard as CreateQuestionHighlightCard,
                }),
              };
              return updatedItem;
            }

            // If not completed or if AI is enabled, simply update with the incomplete answers
            const updatedDraftQuestion = updateDQwithIncorrectAnswers(
              currentDraftQuestion,
              updatedIncompleteAnswers,
              completeAnswers,
            );
            return { ...questionItem, question: updatedDraftQuestion };
          }

          // If the card wasn't in incomplete answers, update the complete answers
          const updatedCompleteAnswers = completeAnswers.map((answer) =>
            answer.id === cardData.id ? cardData : answer,
          );
          const updatedDraftQuestion = updateDQwithIncorrectAnswers(
            currentDraftQuestion,
            incompleteAnswers,
            updatedCompleteAnswers,
          );
          return {
            ...questionItem,
            question: updatedDraftQuestion,
            ...(cardData.isFirstEdit && {
              highlightCard: nextCard as CreateQuestionHighlightCard,
            }),
          };
        }
        return questionItem;
      });
    });
  };

  const handleCCSSClicks = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const updatedItem = {
            ...questionItem,
            isCCSSVisibleModal: true,
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleAIError = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const updatedItem = {
            ...questionItem,
            isAIError: !questionItem.isAIError,
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleQuestionImageUploadClick = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === selectedQuestionIndex) {
          const updatedItem = {
            ...questionItem,
            questionImageModalIsOpen: !questionItem.questionImageModalIsOpen,
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  const handleSaveQuestion = async () => {
    try {
      // Make sure all cards are completed for question.
      if (!allDQAreValid) {
        setSaveQuestionError(true);
        return;
      }

      setIsCreatingTemplate(true);
      // process valid questions in order
      await Promise.all(
        draftQuestionsList.map(async (dq) => {
          let result = null;
          let url = null;

          /** handle image cases  */
          // image file case
          if (dq.question.questionCard.image) {
            try {
              const img = await apiClients.questionTemplate.storeImageInS3(
                dq.question.questionCard.image,
              );
              result = await img.result;
              if (result && result.path && result.path.length > 0) {
                url = result.path;
              }
            } catch (err) {
              console.error('Error storing image:', err);
              throw new Error('Failed to store image.');
            }
          }
          // image url case
          else if (dq.question.questionCard.imageUrl) {
            try {
              url = await apiClients.questionTemplate.storeImageUrlInS3(
                dq.question.questionCard.imageUrl,
              );
            } catch (err) {
              console.error('Error storing image URL:', err);
              throw new Error('Failed to store image URL.');
            }
          }

          // if a url is available, we can create a question template
          if (url) {
            try {
              await apiClients.questionTemplate.createQuestionTemplate(
                dq.publicPrivate,
                url,
                dq.question,
              );
            } catch (err) {
              console.error('Error creating question template:', err);
              throw new Error('Failed to create question template.');
            }
          }

          // return updated question with isCreatingTemplate: false after processing
          return {
            ...dq,
            isCreatingTemplate: false,
          };
        }),
      );

      // Reset data and re-direct user
      setDraftQuestionsList([]);
      setIsCreatingTemplate(false);
      setSaveQuestionError(false);
      navigate('/');
    } catch (err) {
      setSaveQuestionError(true);
      setIsCreatingTemplate(false);
      console.error('Error during save process:', err);
    }
  };

  /** END OF CREATE QUESTION HANDLERS  */

  useEffect(() => {
    setIsLoading(false);
    const selected = centralData.selectedGame;
    const title = selected?.title;
    if (selected !== null) {
      // regex to detect (clone of) in title
      const regex = /\(Clone of\)/i;
      if (title && !regex.test(title))
        selected.title = `(Clone of) ${title}`;
      setDraftGame(prev => ({
        ...prev,
        gameTemplate: selected,
        openCreateQuestion: true,
        imageUrl: selected.imageUrl ?? '',
      }));
      setOriginalGameImageUrl(selected.imageUrl ?? '');
      setPhaseTime({
        phaseOne: timeLookup(selected.phaseOneTime),
        phaseTwo: timeLookup(selected.phaseTwoTime),
      });
      const originals = selected?.questionTemplates;
      const assembled = originals?.map(q =>
        assembleQuestionTemplate(q.questionTemplate)
      );
    
      if (originals && assembled && assembled.length > 0) {
        setDraftQuestionsList(() =>
          originals.map((orig, i) => {
            setOriginalQuestionImageUrls((prev) => [...prev, orig.questionTemplate.imageUrl ?? '']);
            return {
              ...draftTemplate,
              question: assembled[i],
              questionTemplate: orig.questionTemplate,
            }
          })
        );
      }
    }
    const id = route?.params.gameId;
    if (!centralData.selectedGame && id){
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, id);
    }
  }, [centralData.selectedGame, route ]); // eslint-disable-line 

  const {
    handleView,
    getLabel,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions,
  } = useExploreQuestionsStateManager();

  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftQuestionsList((prev) => [...prev, draftTemplate]);
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount + 1,
      gameTemplate: {
        ...prev.gameTemplate,
      },
    }));
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const openModal =
    draftQuestionsList[selectedQuestionIndex].isImageUploadVisible ||
    draftQuestionsList[selectedQuestionIndex].isImageURLVisible ||
    draftQuestionsList[selectedQuestionIndex].isCreatingTemplate ||
    draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal ||
    draftQuestionsList[selectedQuestionIndex].questionImageModalIsOpen ||
    draftGame.isGameImageUploadVisible;

    const handleCreateGameQuestion = async () => {
      setDraftGame((prev) => ({...prev, isCreatingTemplate: true}))
      const gameQuestion: CreatePublicGameQuestionsInput | CreatePrivateGameQuestionsInput = {
        publicGameTemplateID: '2967ceff-36ad-4de3-9ec8-acde827ffe36',
        publicQuestionTemplateID: '23750fce-79db-4bff-82bd-7012f6d17e3b',
      }
      try {
        await apiClients.gameQuestions.createGameQuestions(
          draftGame.publicPrivateGame,
          gameQuestion,
        );
      } catch(err) {
        console.log("GameQuestion error", err);
      }

      setDraftGame((prev) => ({...prev, isCreatingTemplate: false}))
     
    }

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      {/* Modals for Question (below) */}
      <ModalBackground
        isModalOpen={openModal}
        handleCloseModal={handleCloseQuestionModal}
      />

      <CreatingTemplateModal
        isModalOpen={draftGame.isCreatingTemplate}
        templateType={TemplateType.GAME}
      />

      {/* tracks ccss state according to index */}
      {draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal && (
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={
            draftQuestionsList[selectedQuestionIndex].isCCSSVisibleModal
          }
          handleCCSSSubmit={handleCCSSSubmit}
          ccss={
            draftQuestionsList[selectedQuestionIndex].question.questionCard
              .ccss ?? ''
          }
        />
      )}

      {/* open modals according to correct index */}
      <ImageUploadModal
        draftQuestion={draftQuestionsList[selectedQuestionIndex].question}
        screenSize={screenSize}
        isModalOpen={
          draftQuestionsList[selectedQuestionIndex].questionImageModalIsOpen
        }
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseQuestionModal}
      />

      {/* Create Game Image Upload Modal */}
      <CreateGameImageUploadModal
        draftGame={draftGame}
        screenSize={screenSize}
        isModalOpen={draftGame.isGameImageUploadVisible}
        handleImageChange={handleGameImageChange}
        handleImageSave={handleGameImageSave}
        handleCloseModal={handleCloseGameCardModal}
      />

      {/* Create Game Card flow starts here */}
      <CreateGameBoxContainer>
        <CreateGameComponent
          draftGame={draftGame}
          isClone={isClone}
          screenSize={screenSize}
          handleSaveGame={handleSaveGame}
          handleDiscard={handleDiscardGame}
          handlePublicPrivateChange={handlePublicPrivateGameChange}
          handleImageUploadClick={handleGameImageUploadClick}
          onCreateQuestion={handleOpenCreateQuestion}
          onOpenQuestionBank={handleOpenQuestionBank}
          handlePhaseTime={handlePhaseTime}
          onGameDescription={handleGameDescription}
          onGameTitle={handleGameTitle}
          phaseTime={phaseTime}
          selectedIndex={selectedQuestionIndex}
          iconButtons={iconButtons}
          setSelectedIndex={handleQuestionIndexChange}
          addMoreQuestions={handleAddMoreQuestions}
        />

        {/* Create Question Form(s)  */}
        {draftQuestionsList.map(
          (draftQuestionItem, index) =>
            index === selectedQuestionIndex && (
              <Fade
                timeout={500}
                in={draftGame.openCreateQuestion}
                mountOnEnter
                unmountOnExit
                key={`Question--${index + 1}`}
              >
                <Box>
                  <QuestionElements
                    screenSize={screenSize}
                    isClone={isClone}
                    draftQuestion={draftQuestionItem.question}
                    completeIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                      (card) => card.isCardComplete,
                    )}
                    incompleteIncorrectAnswers={draftQuestionItem.question.incorrectCards.filter(
                      (card) => !card.isCardComplete,
                    )}
                    isCardSubmitted={draftQuestionItem.isQuestionCardSubmitted}
                    isCardErrored={draftQuestionItem.isQuestionCardErrored}
                    highlightCard={draftQuestionItem.highlightCard}
                    isAIEnabled={draftQuestionItem.isAIEnabled}
                    isAIError={draftQuestionItem.isAIError}
                    isPublic={
                      draftQuestionItem.publicPrivate ===
                      PublicPrivateType.PUBLIC
                    }
                    isMultipleChoice={draftQuestionItem.isMultipleChoice}
                    handleAnswerType={handleAnswerType}
                    handleDebouncedCorrectAnswerChange={
                      handleDebouncedCorrectAnswerChange
                    }
                    handleDebouncedCorrectAnswerStepsChange={
                      handleDebouncedCorrectAnswerStepsChange
                    }
                    handleAnswerSettingsChange={handleAnswerSettingsChange}
                    handleDebouncedTitleChange={handleDebouncedTitleChange}
                    handlePublicPrivateChange={
                      handlePublicPrivateQuestionChange
                    }
                    handleDiscardQuestion={handleDiscard}
                    handleSaveQuestion={handleSaveQuestion}
                    handleAIError={handleAIError}
                    handleAIIsEnabled={handleAIIsEnabled}
                    handleNextCardButtonClick={handleNextCardButtonClick}
                    handleIncorrectCardStackUpdate={
                      handleIncorrectCardStackUpdate
                    }
                    handleClick={handleClick}
                    handleCCSSClick={handleCCSSClicks}
                    handleImageUploadClick={handleQuestionImageUploadClick}
                  />
                </Box>
              </Fade>
            ),
        )}

        {/* Question Bank goes here */}
        <Fade
          in={draftGame.openQuestionBank}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box>
            <LibraryTabsQuestions
              screenSize={screenSize}
              tabMap={tabMap}
              tabIconMap={tabIconMap}
              setIsTabsOpen={setIsTabsOpen}
              getLabel={getLabel}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              handlePublicPrivateChange={handlePublicPrivateQuestionChange}
              fetchElements={loadMoreQuestions}
              handleView={handleView}
            />
          </Box>
        </Fade>
      </CreateGameBoxContainer>
    </CreateGameMainContainer>
  );
}
