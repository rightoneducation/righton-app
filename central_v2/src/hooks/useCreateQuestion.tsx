import { useState, useCallback } from 'react';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  IncorrectCard,
  AnswerType,
} from '@righton/networking';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTSAPIClientsContext } from './context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import useCreateQuestionLoader from '../loaders/CreateQuestionLoader';
import {
  CreateQuestionHighlightCard,
  ScreenSize,
  StorageKey,
  TemplateType,
} from '../lib/CentralModels';
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
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';

export type TDraftQuestionsList = {
  publicPrivate: PublicPrivateType;
  isAIEnabled: boolean;
  isAIError: boolean;
  question: CentralQuestionTemplateInput;
  questionImageModalIsOpen: boolean;
  isCCSSVisibleModal: boolean;
  isImageUploadVisible: boolean;
  isImageURLVisible: boolean;
  isCreatingTemplate: boolean;
  highlightCard: CreateQuestionHighlightCard
  answerType: AnswerType;
};

const useCreateQuestion = (index: number) => {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const navigate = useNavigate();
  
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
      answerType: AnswerType.MULTICHOICE,
      highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
    };
  
    const [draftQuestionsList, setDraftQuestionsList] = useState<
      TDraftQuestionsList[]
    >([draftTemplate]);
 
  
  const [isQuestionCardSubmitted, setIsQuestionCardSubmitted] =
    useState<boolean>(false);
  const [isQuestionCardErrored, setIsQuestionCardErrored] =
    useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);


  const [draftQuestion, setDraftQuestion] =
    useState<CentralQuestionTemplateInput>(() => {
      return (
        {
          questionCard: {
            title: '',
            ccss: 'CCSS',
            isFirstEdit: true,
            isCardComplete: false,
          },
          correctCard: {
            answer: '',
            answerSteps: ['', '', ''],
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
        }
      );
    });

    const handleAnswerType = (answer: AnswerType ) => {
      setDraftQuestionsList((prev) => {
        return prev.map((questionItem, i) => {
          if(i === index) {
            const newDraftQuestion = {
              ...questionItem,
              answerType: answer,
            }
            return newDraftQuestion
          }
          return questionItem;
        })
      })
    }


        const handlePublicPrivateQuestionChange = (
          value: PublicPrivateType,
        ) => {
          setDraftQuestionsList((prev) => {
            return prev.map((questionItem, i) => {
              if (i === index) {
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
            if (i === index) {
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
  // QuestionCardBase handler functions
 const handleImageChange = async (
    inputImage?: File,
    inputUrl?: string,
  ) => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === index) {
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

  const handleImageSave = async (
    inputImage?: File,
    inputUrl?: string,
  ) => {
    setDraftQuestionsList((draftPrev) => {
      return draftPrev.map((questionItem, i) => {
        if (i === index) {
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
                highlightCard: CreateQuestionHighlightCard.CORRECTANSWER
              })
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
                highlightCard: CreateQuestionHighlightCard.CORRECTANSWER
              })
            };
            return updatedDraftQuestion;
          }
        }
        return questionItem;
      });
    });
  };

   const handleDebouncedTitleChange = useCallback(// eslint-disable-line
     (
       title: string,
       draftQuestionInput: CentralQuestionTemplateInput,
     ) => {
       setDraftQuestionsList((draftPrev) => {
         return draftPrev.map((questionItem, i) => {
           if (i === index) {
             const { isCardComplete, isFirstEdit } = questionItem.question.questionCard;
             const newDraftQuestion = updateDQwithTitle(
               questionItem.question,
               title,
             );
             const updatedItem: TDraftQuestionsList = {
               ...questionItem,
               question: newDraftQuestion,
               ...(isCardComplete && isFirstEdit && {
                 highlightCard: CreateQuestionHighlightCard.CORRECTANSWER
               })
             };
             return updatedItem;
           }
           return questionItem;
         });
       });
     },
     [index],
   );

  const handleDebouncedCorrectAnswerChange = useCallback(// eslint-disable-line
    (
      correctAnswer: string,
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      setDraftQuestionsList((draftPrev) => {
        return draftPrev.map((questionItem, i) => {
          if (i === index) {
            const { isCardComplete, isFirstEdit } =
              questionItem.question.correctCard;
            const newDraftQuestion = updateDQwithCorrectAnswer(
              questionItem.question,
              correctAnswer,
            );
            const updatedItem = {
              ...questionItem,
              question: newDraftQuestion,
              ...(isCardComplete && isFirstEdit && {
                highlightCard: CreateQuestionHighlightCard.INCORRECTANSWER1
              })
            };
            return updatedItem;
          }
          return questionItem;
        });
      });
    },
    [index],
  );

  const handleDebouncedCorrectAnswerStepsChange = useCallback(// eslint-disable-line
    (
      steps: string[],
      draftQuestionInput: CentralQuestionTemplateInput,
    ) => {
      setDraftQuestionsList((draftPrev) => {
        return draftPrev.map((questionItem, i) => {
          if (i === index) {
            const { isCardComplete, isFirstEdit } =
              questionItem.question.questionCard;
            const newDraftQuestion = updateDQwithCorrectAnswerSteps(
              questionItem.question,
              steps,
            );
            const updatedItem = {
              ...questionItem,
              question: newDraftQuestion,
              ...(isCardComplete && isFirstEdit && {
                highlightCard: CreateQuestionHighlightCard.INCORRECTANSWER1
              })
            };
            return updatedItem;
          }
          return questionItem;
        });
      });
    },
    [index],
  );

  const handleCloseQuestionModal = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === index) {
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
         if(i === index) {
           const currentDraftQuestion = questionItem.question;
           const { isCardComplete: correctCardComplete } = currentDraftQuestion.correctCard;
           const { isCardComplete: questionCardComplete } = questionItem.question.questionCard;
           switch(cardType) {
             case CreateQuestionHighlightCard.CORRECTANSWER:
               if(correctCardComplete) {
                 const newDraftQuestion = updateDQwithCorrectAnswerClick(
                   currentDraftQuestion,
                 );
                 return {...questionItem, question: newDraftQuestion, }
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
                 return {...questionItem, question: newDraftQuestion}
               }
               
               case CreateQuestionHighlightCard.QUESTIONCARD:
                 default:
                   if (questionCardComplete) {
                     const newDraftQuestion = updateDQwithQuestionClick(
                       currentDraftQuestion,
                     );
                     return {...questionItem, question: newDraftQuestion, }
                   }
                   break;
           }
         }
         return questionItem;
       })
     })
   };

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestionsList((draftPrev) => {
      return draftPrev.map((questionItem, i) => {
        if (i === index) {
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
            ...(isCardComplete && isFirstEdit && {
              highlightCard: CreateQuestionHighlightCard.CORRECTANSWER
            })
          };
          return updatedItem;
        }
        return questionItem;
      });
    });
  };

  // incorrect answer card functions
  const handleNextCardButtonClick = (
    cardData: IncorrectCard,
  ) => {
    setDraftQuestionsList((prev) => {
      const nextCard = getNextHighlightCard(
        cardData.id as CreateQuestionHighlightCard,
      );
      return prev.map((questionItem, i) => {
        if (i === index) {
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
            ...(nextCard && { highlightCard: nextCard as CreateQuestionHighlightCard }) 
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
        if (i === index) {
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
                ...(cardData.isFirstEdit && { highlightCard: nextCard as CreateQuestionHighlightCard })
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
              highlightCard: nextCard as CreateQuestionHighlightCard
            }) 
          };
        }
        return questionItem;
      });
    });
  };

  const handleCCSSClicks = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === index) {
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
        if(i === index) {
          const updatedItem = {
            ...questionItem,
            isAIError: !questionItem.isAIError
          }
          return updatedItem;
        }
        return questionItem;
      })
    })
  };

  const handleQuestionImageUploadClick = () => {
    setDraftQuestionsList((prev) => {
      return prev.map((questionItem, i) => {
        if (i === index) {
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
      setIsQuestionCardSubmitted(true);
      if (
        draftQuestion.questionCard.isCardComplete &&
        draftQuestion.correctCard.isCardComplete &&
        draftQuestion.incorrectCards.every((card: any) => card.isCardComplete)
      ) {
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          if (draftQuestion.questionCard.image) {
            const img = await apiClients.questionTemplate.storeImageInS3(
              draftQuestion.questionCard.image,
            );
            // have to do a nested await here because aws-storage returns a nested promise object
            result = await img.result;
            if (result && result.path && result.path.length > 0)
              url = result.path;
          } else if (draftQuestion.questionCard.imageUrl) {
            url = await apiClients.questionTemplate.storeImageUrlInS3(
              draftQuestion.questionCard.imageUrl,
            );
          }
          window.localStorage.setItem(StorageKey, '');
          console.log(draftQuestion.questionCard.imageUrl);
          if (url) {
            apiClients.questionTemplate.createQuestionTemplate(
              PublicPrivateType.PUBLIC,
              url,
              draftQuestion,
            );
          }
          setIsCreatingTemplate(false);
          navigate('/questions');
        }
      } else {
        setIsQuestionCardErrored(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const completeIncorrectAnswers = draftQuestionsList[
    index
  ].question.incorrectCards.filter((card) => card.isCardComplete);
  const incompleteIncorrectAnswers = draftQuestionsList[
    index
  ].question.incorrectCards.filter((card) => !card.isCardComplete);

  const openModal =
    draftQuestionsList[index].isImageUploadVisible ||
    draftQuestionsList[index].isImageURLVisible ||
    draftQuestionsList[index].isCreatingTemplate ||
    draftQuestionsList[index].isCCSSVisibleModal ||
    draftQuestionsList[index].questionImageModalIsOpen;

  return {
    // handlers
    handleAnswerType,
    handleQuestionImageUploadClick,
    handleNextCardButtonClick,
    handleIncorrectCardStackUpdate,
    handleAIError,
    handleAIIsEnabled,
    handleImageChange,
    handleImageSave,
    handlePublicPrivateQuestionChange,
    handleSaveQuestion,
    handleClick,
    handleCloseQuestionModal,
    handleCCSSClicks,
    handleCCSSSubmit,
    setDraftQuestion,
    handleDebouncedCorrectAnswerChange,
    handleDebouncedCorrectAnswerStepsChange,
    handleDebouncedTitleChange,
    setDraftQuestionsList,

    // state
    openModal,
    completeIncorrectAnswers,
    incompleteIncorrectAnswers,
    isQuestionCardSubmitted,
    isQuestionCardErrored,
    isCreatingTemplate,
    draftQuestionsList,
    isClicked,
  };
};
export default useCreateQuestion;
