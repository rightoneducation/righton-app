import {
  IAPIClients,
  IncorrectCard,
  IQuestionTemplate,
  PublicPrivateType,
} from '@righton/networking';
import {
  draftTemplate,
  TDraftQuestionsList,
  TGameTemplateProps,
  emptyQuestionTemplate
} from '../../CreateGameModels';
import {
  updateDQwithCCSS,
  updateDQwithImage,
  updateDQwithImageURL,
  updateDQwithQuestionClick,
  updateDQwithTitle,
} from '../createquestion/CreateQuestionCardBaseHelperFunctions';
import { CreateQuestionHighlightCard } from '../../CentralModels';
import {
  updateDQwithCorrectAnswer,
  updateDQwithCorrectAnswerClick,
  updateDQwithCorrectAnswerSteps,
} from '../createquestion/CorrectAnswerCardHelperFunctions';
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
} from '../createquestion/IncorrectAnswerCardHelperFunctions';

export const checkDQsAreValid = (
  draftQuestionsList: TDraftQuestionsList[],
): boolean => {
  return draftQuestionsList.every((dq, index) => {
    // const { ccss, image, imageUrl, title } = dq.question.questionCard;
    // const {answer, answerSteps } = dq.question.correctCard;

    // //question
    // const hasCCSS = ccss !== "";
    // const hasImage = image || imageUrl
    // const hasTitle = title !== ""
    // //correct answer
    // const hasAnswer = answer !== ""
    // const answerArr = answerSteps.map((answers) => answers !== "");

    // //incorrect options
    // dq.question.incorrectCards.every((card) => {
    //   const { answer, explanation } = card;
    //   return answer !== "" && explanation !== ""
    // })
    
    const isValid =
      dq.question.questionCard.isCardComplete &&
      dq.question.correctCard.isCardComplete &&
      dq.question.incorrectCards.every((card) => card.isCardComplete);
    return isValid;
  });
};

export const createNewQuestionTemplates = (
  draftQuestionsList: TDraftQuestionsList[],
  apiClients: IAPIClients,
) => {
  return draftQuestionsList.map(async (dq, i) => {
    let result = null;
    let url = null;

    // if existing question return its ID for Game Creation
    if (dq.questionTemplate.id) {
      console.log('Existing id Skipped at index: ', i);
      return { id: dq.questionTemplate.id } as IQuestionTemplate;
    }

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
};

export const updatePublicPrivateAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  value: PublicPrivateType,
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((question, i) => {
    if (i === selectedIndex) {
      return { ...question, publicPrivate: value };
    }
    return question;
  });
};

export const updateAIIsEnabledAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((question, i) => {
    if (i === selectedIndex) {
      return {
        ...question,
        isAIEnabled: !question.isAIEnabled,
        isAIError: !question.isAIError,
      };
    }
    return question;
  });
};

export const updateQuestionImageChangeAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  inputImage?: File,
  inputUrl?: string,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((question, i) => {
    if (i === selectedIndex) {
      const currentDraftQuestion = question.question;
      if (inputImage) {
        const newDraftQuestion = updateDQwithImage(
          currentDraftQuestion,
          undefined,
          inputImage,
        );
        const updatedImageItem = {
          ...question,
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
          ...question,
          question: newDraftQuestion,
        };
        return updatedImageURLItem;
      }
    }
    return question;
  });
};

export const updateQuestionImageSaveAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  inputImage?: File,
  inputUrl?: string,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateQuestionTitleChangeAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  title: string,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
      const { isCardComplete, isFirstEdit } =
        questionItem.question.questionCard;
      const newDraftQuestion = updateDQwithTitle(questionItem.question, title);
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
};

export const updateCorrectAnswerAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  correctAnswer: string,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
      const { isCardComplete, isFirstEdit } = questionItem.question.correctCard;
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
};

export const updateCorrectAnswerStepsAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  steps: string[],
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateQuestionAnswerTypeAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((draftItem, i) => {
    if (i === selectedIndex) {
      const updatedItem = {
        ...draftItem,
        isMultipleChoice: !draftItem.isMultipleChoice,
      };
      return updatedItem;
    }
    return draftItem;
  });
};

export const updateCloseQuestionModelAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const handleCardClickAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  cardType: CreateQuestionHighlightCard,
) => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateCCSSAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  ccssString: string,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateNextButtonClickAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  cardData: IncorrectCard,
): TDraftQuestionsList[] => {
  const nextCard = getNextHighlightCard(
    cardData.id as CreateQuestionHighlightCard,
  );
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateIncorrectCardStackAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  cardData: IncorrectCard,
  completeAnswers: IncorrectCard[],
  incompleteAnswers: IncorrectCard[],
  isAIEnabledCard?: boolean,
) => {
  const nextCard = getNextHighlightCard(
    cardData.id as CreateQuestionHighlightCard,
  );
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
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
};

export const updateCCSSClickAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
      const updatedItem = {
        ...questionItem,
        isCCSSVisibleModal: true,
      };
      return updatedItem;
    }
    return questionItem;
  });
};

export const updateAIErrorAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
      const updatedItem = {
        ...questionItem,
        isAIError: !questionItem.isAIError,
      };
      return updatedItem;
    }
    return questionItem;
  });
};

export const updateImageUploadClickAtIndex = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): TDraftQuestionsList[] => {
  return draftQuestionsList.map((questionItem, i) => {
    if (i === selectedIndex) {
      const updatedItem = {
        ...questionItem,
        questionImageModalIsOpen: !questionItem.questionImageModalIsOpen,
      };
      return updatedItem;
    }
    return questionItem;
  });
};

export const openModalAtIndex = (
  draftGame: TGameTemplateProps,
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
): boolean => {
  return (
    draftQuestionsList?.[selectedIndex]?.isImageUploadVisible ||
    draftQuestionsList?.[selectedIndex]?.isImageURLVisible ||
    draftQuestionsList?.[selectedIndex]?.isCreatingTemplate ||
    draftQuestionsList?.[selectedIndex]?.isCCSSVisibleModal ||
    draftQuestionsList?.[selectedIndex]?.questionImageModalIsOpen ||
    draftGame.isGameImageUploadVisible
  );
};

export const buildLibraryQuestionAtIndex = (
  question: IQuestionTemplate,
): TDraftQuestionsList => {
  const correctAnswer = question.choices?.find((q) => q.isAnswer === true);
  const incorrectAnswers = question.choices?.filter((q) => !q.isAnswer);

  const incorrectCards = incorrectAnswers?.map((incorrectAnswer, i) => ({
    id: `card-${i + 1}`,
    answer: incorrectAnswer.text || '',
    explanation: incorrectAnswer.reason || '',
    isFirstEdit: true,
    isCardComplete: true,
  })) as IncorrectCard[];

  return {
    ...draftTemplate,
    questionTemplate: { ...question },
    question: {
      questionCard: {
        imageUrl: question?.imageUrl ? question.imageUrl : '',
        title: question?.title,
        ccss: question?.ccss,
        isFirstEdit: true,
        isCardComplete: true,
      },
      correctCard: {
        answer: correctAnswer ? correctAnswer?.text : '',
        answerSteps: question?.instructions
          ? question?.instructions
          : ['', '', ''],
        isFirstEdit: true,
        isCardComplete: true,
      },
      incorrectCards,
    },
    isLibraryViewOnly: true,
  };
};

type UpdateDraftListResult = {
  updatedList: TDraftQuestionsList[];
  addNew: boolean;
};
export const updateDraftListWithLibraryQuestion = (
  draftQuestionsList: TDraftQuestionsList[],
  selectedIndex: number,
  libraryQuestion: TDraftQuestionsList,
): UpdateDraftListResult => {
  const isFirstEmpty =
    draftQuestionsList.length === 1 &&
    !draftQuestionsList[0].question.questionCard.isCardComplete;

  if (isFirstEmpty) {
    return { updatedList: [libraryQuestion], addNew: false };
  }

  if (
    typeof selectedIndex === 'number' &&
    draftQuestionsList[selectedIndex] &&
    !draftQuestionsList[selectedIndex].question.questionCard.isCardComplete
  ) {
    const updated = [...draftQuestionsList];
    updated[selectedIndex] = libraryQuestion;
    return { updatedList: updated, addNew: false };
  }

  const currentIndex = draftQuestionsList.findIndex(
    (q) => !q.question.questionCard.isCardComplete,
  );

  if (currentIndex !== -1) {
    const updated = [...draftQuestionsList];
    updated[currentIndex] = libraryQuestion;
    return { updatedList: updated, addNew: false };
  }

  const updatedQuestions = [...draftQuestionsList, draftTemplate];
  updatedQuestions[updatedQuestions.length - 1] = libraryQuestion;

  return { updatedList: updatedQuestions, addNew: true };
};
