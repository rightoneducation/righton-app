import {
  CreatePublicGameQuestionsInput,
  CreatePrivateGameQuestionsInput,
  CreatePrivateGameTemplateInput,
  CreatePublicGameTemplateInput,
  PublicPrivateType,
  IAPIClients,
  CentralQuestionTemplateInput,
  IQuestionTemplate,
  AnswerType
} from '@righton/networking';
import {
  TDraftQuestionsList,
  TGameTemplateProps,
  TPhaseTime,
} from '../../CreateGameModels';
import { reverseTimesMap } from '../../../components/cards/creategamecard/time';

type GameTemplate =
  | CreatePrivateGameTemplateInput
  | CreatePublicGameTemplateInput;
type GameQuestionTemplate =
  | CreatePublicGameQuestionsInput
  | CreatePrivateGameQuestionsInput;

export const checkGameFormIsValid = (
  draftGame: TGameTemplateProps,
): boolean => {
  return (
    draftGame.gameTemplate.title !== '' &&
    draftGame.gameTemplate.description !== '' &&
    draftGame.gameTemplate.phaseOneTime !== 0 &&
    draftGame.gameTemplate.phaseTwoTime !== 0
  );
};

export const updateGameTitle = (
  draftGame: TGameTemplateProps,
  title: string,
): TGameTemplateProps => {
  return {
    ...draftGame,
    gameTemplate: {
      ...draftGame.gameTemplate,
      title,
      lowerCaseTitle: title.toLowerCase(),
    },
  };
};

export const updateGameDescription = (
  draftGame: TGameTemplateProps,
  description: string,
): TGameTemplateProps => {
  return {
    ...draftGame,
    gameTemplate: {
      ...draftGame.gameTemplate,
      description,
      lowerCaseDescription: description.toLowerCase(),
    },
  };
};

export const updateGameTemplatePhaseTime = (
  draftGame: TGameTemplateProps,
  time: TPhaseTime,
): TGameTemplateProps => {
  const phaseOne = reverseTimesMap[time.phaseOne];
  const phaseTwo = reverseTimesMap[time.phaseTwo];
  return {
    ...draftGame,
    gameTemplate: {
      ...draftGame.gameTemplate,
      ...(time.phaseOne && { phaseOneTime: phaseOne }),
      ...(time.phaseTwo && { phaseTwoTime: phaseTwo }),
    },
  };
};

export const updatePhaseTime = (time: TPhaseTime) => {
  return {
    ...time,
    ...(time.phaseOne && { phaseOne: time.phaseOne }),
    ...(time.phaseTwo && { phaseTwo: time.phaseTwo }),
  };
};

export const toggleCreateQuestion = (
  draftGame: TGameTemplateProps,
  gameFormIsValid: boolean,
) => {
  return {
    ...draftGame,
    ...(draftGame.openQuestionBank &&
      gameFormIsValid && { openQuestionBank: false }),
    // check game form is complete before displaying question form
    ...(gameFormIsValid && {
      openCreateQuestion: !draftGame.openCreateQuestion,
    }),
    // if the card was in an error state, but not anymore set it to false
    ...(gameFormIsValid &&
      draftGame.isGameCardErrored && { isGameCardErrored: false }),
    // if the form is not valid, flag an error
    ...(!gameFormIsValid && { isGameCardErrored: true }),
  };
};

export const toggleQuestionBank = (
  draftGame: TGameTemplateProps,
  gameFormIsValid: boolean,
) => {
  return {
    ...draftGame,
    ...(draftGame.openCreateQuestion &&
      gameFormIsValid && { openCreateQuestion: false }),
    ...(gameFormIsValid && { openQuestionBank: !draftGame.openQuestionBank }),
    ...(gameFormIsValid &&
      draftGame.isGameCardErrored && { isGameCardErrored: false }),
    ...(!gameFormIsValid && { isGameCardErrored: true }),
  };
};

export const updateGameImageSave = (
  draftGame: TGameTemplateProps,
  inputImage?: File,
  inputUrl?: string,
): TGameTemplateProps => {
  if (inputImage) {
    return {
      ...draftGame,
      image: inputImage,
      imageUrl: undefined,
      isGameImageUploadVisible: false,
      isGameURLUploadVisible: false,
    };
  }

  if (inputUrl) {
    return {
      ...draftGame,
      imageUrl: inputUrl,
      image: undefined,
      isGameImageUploadVisible: false,
      isGameURLUploadVisible: false,
    };
  }

  return draftGame;
};

export const updateGameImageChange = (
  draftGame: TGameTemplateProps,
  inputImage?: File,
  inputUrl?: string,
): TGameTemplateProps => {
  if (inputImage) {
    return { ...draftGame, image: inputImage, imageUrl: undefined };
  }

  if (inputUrl) {
    return { ...draftGame, imageUrl: inputUrl, image: undefined };
  }

  return draftGame;
};

export const createGameImagePath = async (
  draftGame: TGameTemplateProps,
  apiClients: IAPIClients,
): Promise<string | null> => {
  let gameImgUrl: string | null = null;
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
  return gameImgUrl;
};

export const buildGameTemplate = (
  draftGame: TGameTemplateProps,
  draftQuestionsList: TDraftQuestionsList[],
  gameImgUrl?: string | null,
): GameTemplate => {
  return {
    title: draftGame.gameTemplate.title,
    lowerCaseTitle: draftGame.gameTemplate.title.toLowerCase(),
    description: draftGame.gameTemplate.description,
    lowerCaseDescription: draftGame.gameTemplate.description.toLowerCase(),
    questionTemplatesCount: 0,
    version: 0,
    phaseOneTime: draftGame.gameTemplate.phaseOneTime,
    phaseTwoTime: draftGame.gameTemplate.phaseTwoTime,
    ccss: draftQuestionsList[0].question.questionCard.ccss,
    grade: draftQuestionsList[0].question.questionCard.ccss.split('.')[0] ?? '',
    gradeFilter:
      draftQuestionsList[0].question.questionCard.ccss.split('.')[0] ?? '',
    domain:
      draftQuestionsList[0].question.questionCard.ccss.split('.')[1] ?? '',
    cluster:
      draftQuestionsList[0].question.questionCard.ccss.split('.')[2] ?? '',
    standard:
      draftQuestionsList[0].question.questionCard.ccss.split('.')[3] ?? '',
    imageUrl: gameImgUrl,
  };
};


export const buildGameQuestion = (
  draftGame: TGameTemplateProps,
  gameTemplateId: string,
  questionTemplateId: string,
): GameQuestionTemplate => {
  return {
    ...(draftGame.publicPrivateGame === PublicPrivateType.PUBLIC
      ? {
          publicGameTemplateID: String(gameTemplateId),
          publicQuestionTemplateID: String(questionTemplateId),
        }
      : {
          privateGameTemplateID: String(gameTemplateId),
          privateQuestionTemplateID: String(questionTemplateId),
        }),
  };
};

export const buildGameQuestionPromises = (
  draftGame: TGameTemplateProps,
  gameTemplateId: string,
  questionTemplateIds: string[],
  apiClients: IAPIClients,
) => {
  return questionTemplateIds.map(async (questionId, i) => {
    const gameQuestion = buildGameQuestion(
      draftGame,
      String(gameTemplateId),
      String(questionId),
    );
    const response = await apiClients.gameQuestions.createGameQuestions(
      draftGame.publicPrivateGame,
      gameQuestion,
    );
    console.log(
      `${draftGame.publicPrivateGame}GameQuestion response`,
      response,
    );
  });
};

export const assembleQuestionTemplate = (template: IQuestionTemplate): CentralQuestionTemplateInput => {
    const correctAnswer = template.choices?.find((choice) => choice.isAnswer);
    const incorrectAnswers = template.choices?.filter((choice) => !choice.isAnswer);
    const blankIncorrectAnswers = Array.from({ length: 3 }, (_, i) => ({
        id: `card-${i + 1}`,
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: true
    }));
    const incorrectCards = incorrectAnswers?.map((answer, index) => ({
        id: `card-${index + 1}`,
        answer: answer.text,
        explanation: answer.reason,
        isFirstEdit: true,
        isCardComplete: true
    })) ?? blankIncorrectAnswers;
    
    return {
       questionCard: {
            title: template.title,
            ccss: template.ccss,
            isFirstEdit: true,
            isCardComplete: true,
            imageUrl: template.imageUrl ?? '',
        },
        correctCard: {
            answer: correctAnswer?.text ?? '',
            answerSteps: template.instructions ?? [],
            answerSettings: {
                answerType: template.answerSettings?.answerType ?? AnswerType.STRING,
                answerPrecision: template.answerSettings?.answerPrecision
            },
            isFirstEdit: true,
            isCardComplete: true,
        },
        incorrectCards,
    }
}
