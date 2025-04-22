import {
    CreatePublicGameQuestionsInput, 
    CreatePrivateGameQuestionsInput, 
    CreatePrivateGameTemplateInput, 
    CreatePublicGameTemplateInput, 
    IAPIClients,
    IQuestionTemplate,
    PublicPrivateType} from "@righton/networking";
import { TDraftQuestionsList, TGameTemplateProps, TPhaseTime } from "../../CreateGameModels";
import { reverseTimesMap } from "../../../components/cards/creategamecard/time";

type GameTemplate = CreatePrivateGameTemplateInput | CreatePublicGameTemplateInput;
type GameQuestionTemplate = CreatePublicGameQuestionsInput | CreatePrivateGameQuestionsInput;

export const checkGameFormIsValid = (draftGame: TGameTemplateProps): boolean => {
    return draftGame.gameTemplate.title !== '' &&
    draftGame.gameTemplate.description !== '' &&
    draftGame.gameTemplate.phaseOneTime !== 0 &&
    draftGame.gameTemplate.phaseTwoTime !== 0;
}

export const checkDQsAreValid = (draftQuestionsList: TDraftQuestionsList[]): boolean => {
    return draftQuestionsList.every((dq, index) => {
        const isValid =
          dq.question.questionCard.isCardComplete &&
          dq.question.correctCard.isCardComplete &&
          dq.question.incorrectCards.every((card) => card.isCardComplete);
        return isValid;
      });
}

export const updateGameTitle = (draftGame: TGameTemplateProps, title: string): TGameTemplateProps => {
    return {...draftGame, gameTemplate: { ...draftGame.gameTemplate, title, lowerCaseTitle: title.toLowerCase() }}
}

export const updateGameDescription = (draftGame: TGameTemplateProps, description: string): TGameTemplateProps => {
    return {...draftGame, gameTemplate: { ...draftGame.gameTemplate, description, lowerCaseDescription: description.toLowerCase() }}
}

export const updateGameTemplatePhaseTime = (draftGame: TGameTemplateProps, time: TPhaseTime): TGameTemplateProps => {
const phaseOne = reverseTimesMap[time.phaseOne];
const phaseTwo = reverseTimesMap[time.phaseTwo];
      return { ...draftGame, gameTemplate: { 
        ...draftGame.gameTemplate, 
        ...(time.phaseOne && { phaseOneTime: phaseOne }), 
        ...(time.phaseTwo && { phaseTwoTime: phaseTwo }), }}
}

export const updatePhaseTime = (time: TPhaseTime) => {
    return {
        ...time, 
        ...(time.phaseOne && { phaseOne: time.phaseOne }),
        ...(time.phaseTwo && { phaseTwo: time.phaseTwo }), }
}

export const toggleCreateQuestion = (draftGame: TGameTemplateProps, gameFormIsValid: boolean, ) => {
return { ...draftGame, 
    ...(draftGame.openQuestionBank &&
    gameFormIsValid && { openQuestionBank: false }),
  // check game form is complete before displaying question form
  ...(gameFormIsValid && { openCreateQuestion: !draftGame.openCreateQuestion }),
  // if the card was in an error state, but not anymore set it to false
  ...(gameFormIsValid &&
    draftGame.isGameCardErrored && { isGameCardErrored: false }),
  // if the form is not valid, flag an error
  ...(!gameFormIsValid && { isGameCardErrored: true }), }
}

export const toggleQuestionBank = (draftGame: TGameTemplateProps, gameFormIsValid: boolean) => {
    return {
        ...draftGame,
        ...(draftGame.openCreateQuestion &&
          gameFormIsValid && { openCreateQuestion: false }),
        ...(gameFormIsValid && { openQuestionBank: !draftGame.openQuestionBank }),
        ...(gameFormIsValid &&
          draftGame.isGameCardErrored && { isGameCardErrored: false }),
        ...(!gameFormIsValid && { isGameCardErrored: true }),
      }
}

export const updateGameImageSave = (draftGame: TGameTemplateProps, inputImage?: File, inputUrl?: string): TGameTemplateProps => {
    if(inputImage) {
        return {...draftGame, image: inputImage, imageUrl: undefined, isGameImageUploadVisible: false, isGameURLUploadVisible: false,}
    }

    if(inputUrl) {
        return { ...draftGame, imageUrl: inputUrl, image: undefined, isGameImageUploadVisible: false, isGameURLUploadVisible: false }
    }

    return draftGame;
};

export const updateGameImageChange = (draftGame: TGameTemplateProps, inputImage?: File, inputUrl?: string): TGameTemplateProps => {
    if(inputImage) {
        return { ...draftGame, image: inputImage, imageUrl: undefined }
    }

    if(inputUrl) {
        return { ...draftGame, imageUrl: inputUrl, image: undefined, }
    }

    return draftGame;
}

export const createGameTemplate = (
    draftGame: TGameTemplateProps, 
    draftQuestionsList: TDraftQuestionsList[], 
    gameImgUrl: string
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
        grade: draftQuestionsList[0].question.questionCard.ccss.split(".")[0],
        gradeFilter: draftQuestionsList[0].question.questionCard.ccss.split(".")[0],
        domain: draftQuestionsList[0].question.questionCard.ccss.split(".")[1],
        cluster: draftQuestionsList[0].question.questionCard.ccss.split(".")[2],
        standard: draftQuestionsList[0].question.questionCard.ccss.split(".")[3],
        imageUrl: gameImgUrl
        }
    }

    export const createNewQuestionTemplates = (draftQuestionsList: TDraftQuestionsList[], apiClients: IAPIClients) => {
        return draftQuestionsList.map(async (dq, i) => {
                    let result = null;
                    let url = null;
        
                    // if existing question return its ID for Game Creation
                    if(dq.questionTemplate.id) {
                      console.log("Existing id Skipped at index: ", i)
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
    }


    export const createGameQuestion = (
        draftGame: TGameTemplateProps, 
        gameTemplateId: string, 
        questionTemplateId: string
    ): GameQuestionTemplate => {
        return {
            ...(draftGame.publicPrivateGame === PublicPrivateType.PRIVATE) ? {
                publicGameTemplateID: String(gameTemplateId),
                  publicQuestionTemplateID: String(questionTemplateId),
            } : {
                privateGameTemplateID: String(gameTemplateId),
                privateQuestionTemplateID: String(questionTemplateId),
            }
        }
    }