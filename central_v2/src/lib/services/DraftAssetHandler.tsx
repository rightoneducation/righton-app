import React from 'react';
import { IAPIClients, CloudFrontDistributionUrl, IGameTemplate, IQuestionTemplate, CentralQuestionTemplateInput, IUser, PublicPrivateType, TemplateType } from '@righton/networking';
import { checkGameFormIsValid, createGameImagePath, buildGameTemplate, buildGameQuestionPromises } from '../helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { checkDQsAreValid, buildQuestionTemplatePromises } from '../helperfunctions/createGame/CreateQuestionsListHelpers';
import { ICentralDataState, ISelectedGame, StorageKey } from '../CentralModels';
import {
  TGameTemplateProps,
  TDraftQuestionsList,
} from '../CreateGameModels';



/**
 * This class is responsible for handling the draft assets for a game
 * Draft assets are complicated for a few reasons:
 * a. When they are published, public/private assets are created and draft assets are deleted
 * b. During creation of draft games, public/private questions can be linked to draft games (but cant use join tables)
 * c. Additionally, draft questions can be linked to the game as draft gameQuestions (using a join table)
 * d. When a draft game is published, existing public/private questions must be handled separately from draft questions
 */

enum CreateDraftAssetStep {
  FINAL_PUBLIC_PRIVATE_TYPE,
  IMAGE_UPLOAD,
  CATEGORIZE_QUESTION_TEMPLATES,
  CREATE_NEW_QUESTION_TEMPLATES,
  PROCESS_ADDED_QUESTION_TEMPLATES,
  CREATE_GAME_TEMPLATE,
  CREATE_GAME_QUESTIONS,
}

enum UpdateDraftAssetStep {
  IMAGE_UPLOAD,
  CATEGORIZE_QUESTION_TEMPLATES,
  CREATE_NEW_QUESTION_TEMPLATES,
  PROCESS_ADDED_QUESTION_TEMPLATES,
  CREATE_GAME_TEMPLATE,
  CREATE_GAME_QUESTIONS,
}

enum PublishDraftAssetStep {
  VALIDATION,
  IMAGE_UPLOAD,
  CATEGORIZE_QUESTION_TEMPLATES,
  CREATE_NEW_QUESTION_TEMPLATES,
  PROCESS_ADDED_QUESTION_TEMPLATES,
  CREATE_GAME_TEMPLATE,
  CREATE_GAME_QUESTIONS,
  DELETE_OLD_DRAFT_GAME_QUESTIONS,
  DELETE_OLD_DRAFT_GAME_TEMPLATE,
  UPDATE_USER_STATS,
}

enum CreateDraftQuestionStep{
  IMAGE_UPLOAD,
  CREATE_QUESTION_TEMPLATE,
}

enum UpdateDraftQuestionStep{
  IMAGE_UPLOAD,
  UPDATE_QUESTION_TEMPLATE,
}

enum PublishDraftQuestionStep{

}

export class DraftAssetHandler {
  private rollbackActions: Array<() => Promise<void>> = [];
  private completedPublishSteps: PublishDraftAssetStep[] = [];
  private completedCreateSteps: CreateDraftAssetStep[] = [];
  private completedUpdateSteps: UpdateDraftAssetStep[] = [];
  private completedCreateQuestionSteps: CreateDraftQuestionStep[] = [];
  private completedUpdateQuestionSteps: UpdateDraftQuestionStep[] = [];
  private completedPublishQuestionSteps: PublishDraftQuestionStep[] = [];


  private static validateDraftGame(draftGame: TGameTemplateProps, draftQuestionsList: TDraftQuestionsList[]): boolean {
    return checkGameFormIsValid(draftGame) && checkDQsAreValid(draftQuestionsList);
  }

  private static async existingImageHandler(draftGame: TGameTemplateProps, apiClients: IAPIClients): Promise<string | null> {
    let gameImgUrl: string | null = null;
    if (draftGame.image || draftGame.imageUrl) {
      if (
        (!draftGame?.imageUrl?.startsWith('https://') ||
        !draftGame?.imageUrl?.startsWith('http://')) && 
        draftGame?.imageUrl
      ) {
        gameImgUrl = draftGame.imageUrl;
      } else {
        let { imageUrl } = draftGame;
        if (draftGame && imageUrl && imageUrl.length > 0){
          imageUrl = `${CloudFrontDistributionUrl}${imageUrl}`;
        }
        const draftGameWithUrl = { ...draftGame, imageUrl };
        gameImgUrl = await createGameImagePath(draftGameWithUrl, apiClients);
      }
    }
    return gameImgUrl;
  }

  private static async newImageHandler(draftGame: TGameTemplateProps, apiClients: IAPIClients): Promise<string | null> {
    let gameImgUrl: string | null = null;
    if (draftGame.image || draftGame.imageUrl) {
      if (
        (!draftGame?.imageUrl?.startsWith('https://') ||
        !draftGame?.imageUrl?.startsWith('http://')) && 
        draftGame?.imageUrl
      ) {
        gameImgUrl = draftGame.imageUrl;
      } else {
        gameImgUrl = await createGameImagePath(draftGame, apiClients);
      }
    }
    return gameImgUrl;
  }

  private static async newQuestionImageHandler(draftQuestion: CentralQuestionTemplateInput, apiClients: IAPIClients): Promise<string | null> {
    let url: string | null = null;
    let result = null;
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
    } else {
      url = draftQuestion.questionCard.imageUrl || null;
    }
    return url;
  }

  private static categorizeQuestionTemplates(draftQuestionsList: TDraftQuestionsList[]): {
    newQuestionTemplates: TDraftQuestionsList[],
    draftQuestionTemplates: TDraftQuestionsList[],
    addedQuestionTemplates: TDraftQuestionsList[],
  } {
    const newQuestionTemplates: TDraftQuestionsList[] = [];
    const draftQuestionTemplates: TDraftQuestionsList[] = [];
    const addedQuestionTemplates: TDraftQuestionsList[] = [];
    draftQuestionsList.forEach((dq) => {
      if (dq.questionTemplate.publicPrivateType === PublicPrivateType.DRAFT) {
        draftQuestionTemplates.push(dq);
      } else if ((dq.questionTemplate.publicPrivateType === PublicPrivateType.PUBLIC || dq.questionTemplate.publicPrivateType === PublicPrivateType.PRIVATE) && dq.questionTemplate.id) {
        addedQuestionTemplates.push(dq);
      } else {
        newQuestionTemplates.push(dq);
      }
    });
    return {
      newQuestionTemplates,
      draftQuestionTemplates,
      addedQuestionTemplates,
    }
  }

  private static extractDraftGameQuestionsIds(draftQuestionsList: TDraftQuestionsList[], draftGame: TGameTemplateProps): string[] {
    // pull the question template ids from the selected game and cross reference with categroized question templates
    const draftGameQuestions = draftGame.gameTemplate.questionTemplates
      ?.filter((item) => item.questionTemplate.publicPrivateType === PublicPrivateType.DRAFT)
      ?.filter((item) => draftQuestionsList.some((dq) => dq.questionTemplate.id === item.questionTemplate.id))
      ?.map((item) => item.gameQuestionId)
       ?? [];
    return draftGameQuestions;
  }

  private static extractRemovedDraftQuestionIds(draftQuestionsList: TDraftQuestionsList[], draftGame: TGameTemplateProps): string[] {
    // identify draft game questions that have been removed from the current draft questions list
    const removedDraftGameQuestions = draftGame.gameTemplate.questionTemplates
      ?.filter((item) => item.questionTemplate.publicPrivateType === PublicPrivateType.DRAFT)
      ?.filter((item) => !draftQuestionsList.some((dq) => dq.questionTemplate.id === item.questionTemplate.id))
      ?.map((item) => item.gameQuestionId)
       ?? [];
    return removedDraftGameQuestions;
  }

  private static async updateUserStats(centralData: ICentralDataState, draftQuestionsList: TDraftQuestionsList[], apiClients: IAPIClients): Promise<IUser | null> {
    const existingNumGames = centralData.userProfile?.gamesMade || 0;
    const existingNumQuestions =
      centralData.userProfile?.questionsMade || 0;
    const newNumGames = existingNumGames + 1;
    // add new questions to user number of questions
    const newNumQuestions =
      existingNumQuestions +
      draftQuestionsList.filter((dq) => !dq.questionTemplate.id).length;
    return apiClients.user.updateUser({
      id: centralData.userProfile?.id || '',
      gamesMade: newNumGames,
      questionsMade: newNumQuestions,
    });
  }

  /**
   * Creates a draft game and returns the updated draft game
   * Here are the steps to create a draft game:
   * 1. Update the game and questions to store the currently selected public private type
   * 2. Image Upload and Image URL Return
   * 3. Categorize Question Templates By Type
   * 4. Create newly added Draft Question Templates
   * 5. Process the linked public/private question templates and update the game template with their ids
   * 6. Create Game Template
   * 7. Create Draft GameQuestions (only for newly added draft questions)
   * @param centralData 
   * @param draftGame 
   * @param draftQuestionsList 
   * @param apiClients 
   * @param selectedGameId 
   */
  async createDraftGame(
    centralData: ICentralDataState, 
    draftGame: TGameTemplateProps, 
    draftQuestionsList: TDraftQuestionsList[], 
    apiClients: IAPIClients,
  ): Promise<TGameTemplateProps> {
    try {
      // Step 1: Update the game and questions to store the currently selected public private type
      // finalPublicPrivateType is the user's desired final public/private type
      const newDraftGame = {
        ...draftGame,
        publicPrivateGame: PublicPrivateType.DRAFT,
        finalPublicPrivateType: draftGame.gameTemplate.finalPublicPrivateType,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
      };
      const newDraftQuestionsList = draftQuestionsList.map((dq) => ({
        ...dq,
        questionTemplate: {
          ...dq.questionTemplate,
          finalPublicPrivateType: newDraftGame.gameTemplate.finalPublicPrivateType
        }
      }));
      this.completedCreateSteps.push(CreateDraftAssetStep.FINAL_PUBLIC_PRIVATE_TYPE);

      // Step 2: Image Upload and Image URL Return
      const gameImgUrl = await DraftAssetHandler.newImageHandler(newDraftGame, apiClients);
      const userId = centralData.userProfile?.id || '';
      this.completedCreateSteps.push(CreateDraftAssetStep.IMAGE_UPLOAD);

      // Step 3: Categorize Question Templates By Type
      const { 
        newQuestionTemplates, 
        draftQuestionTemplates, 
        addedQuestionTemplates 
      } = DraftAssetHandler.categorizeQuestionTemplates(newDraftQuestionsList);
      this.completedCreateSteps.push(CreateDraftAssetStep.CATEGORIZE_QUESTION_TEMPLATES);

      // Step 4: Create newly added Draft Question Templates 
      const newQuestionTemplatePromises = buildQuestionTemplatePromises(
        newQuestionTemplates,
        userId,
        apiClients,
        PublicPrivateType.DRAFT,
      );
      const questionTemplateResponse = await Promise.all(newQuestionTemplatePromises);
      // extract ccssDescription from question templates
      const questionTemplateCCSS = questionTemplateResponse.map(
        (question) => String(question?.ccssDescription),
      );
      // create an array of all the ids from the question templates
      const questionTemplateIds = questionTemplateResponse.map((question) =>
        String(question?.id),
      );
      this.completedCreateSteps.push(CreateDraftAssetStep.CREATE_NEW_QUESTION_TEMPLATES);

      // Step 5: Process the linked public/private question templates and update the game template with their ids
      const addQuestionTemplateCCSS = addedQuestionTemplates
        .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
      questionTemplateCCSS.push(...addQuestionTemplateCCSS);

      newDraftGame.gameTemplate.publicQuestionIds = addedQuestionTemplates
        .filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PUBLIC)
        .map((question) => question.questionTemplate.id);

      newDraftGame.gameTemplate.privateQuestionIds = addedQuestionTemplates
        .filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PRIVATE)
        .map((question) => question.questionTemplate.id);

      this.completedCreateSteps.push(CreateDraftAssetStep.PROCESS_ADDED_QUESTION_TEMPLATES);

      // Step 6: Create Game Template
      const createDraftGameTemplate = buildGameTemplate(
        newDraftGame,
        userId,
        draftQuestionsList,
        gameImgUrl,
        questionTemplateCCSS,
        true
      );
      const gameTemplateResponse =
        await apiClients.gameTemplate.createGameTemplate(
          PublicPrivateType.DRAFT as TemplateType,
          createDraftGameTemplate,
        );
      this.completedCreateSteps.push(CreateDraftAssetStep.CREATE_GAME_TEMPLATE);

      // Step 7: Create Draft GameQuestions (only for newly added draft questions)
      // make sure we have a gameTemplate id as well as question template ids before creating a game question
      if (gameTemplateResponse.id && (questionTemplateIds.length > 0)) {
          // this is only for new questions so we don't write gamequestions that mix draft and public/private questions
          const createGameQuestions = buildGameQuestionPromises(
            newDraftGame,
            gameTemplateResponse.id,
            questionTemplateIds,
            apiClients,
            PublicPrivateType.DRAFT,
          );
          // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
          await Promise.all(createGameQuestions);
      }

      // identify draft questions that have been removed from the game and delete the respective gamequestions
      const removedDraftGameQuestions = DraftAssetHandler.extractRemovedDraftQuestionIds(draftQuestionsList, newDraftGame);
      if (removedDraftGameQuestions.length > 0) {
        const gameQuestionPromises = removedDraftGameQuestions.map(async (gameQuestionId) => {
          return apiClients.gameQuestions.deleteGameQuestions(PublicPrivateType.DRAFT, gameQuestionId);
        });
        await Promise.all(gameQuestionPromises);
      }
      this.completedCreateSteps.push(CreateDraftAssetStep.CREATE_GAME_QUESTIONS);

      const createDraftGameResponse = {
        ...newDraftGame,
        gameTemplate: {
          ...newDraftGame.gameTemplate,
          publicPrivateType: PublicPrivateType.DRAFT,
        },
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }
      return createDraftGameResponse;
    } catch (err) {
      console.error(`Failed to create draft game:`, err);
      const createDraftGameResponse = {
        ...draftGame,
        isCreatingTemplate: false,
      }
      return createDraftGameResponse;
    }
  }

  async updateDraftGame(
    centralData: ICentralDataState,
    draftGame: TGameTemplateProps,
    draftQuestionsList: TDraftQuestionsList[],
    apiClients: IAPIClients,
  ): Promise<TGameTemplateProps> {
    try {
      // Step 1: Update the draft game to store the currently selected public private type
      const updatedDraftGame = {
        ...draftGame,
        publicPrivateGame: PublicPrivateType.DRAFT,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
      };
      
      // Step 2: Image Upload and Image URL Return
      const gameImgUrl = await DraftAssetHandler.existingImageHandler(updatedDraftGame, apiClients);
      this.completedUpdateSteps.push(UpdateDraftAssetStep.IMAGE_UPLOAD);
      // Step 3: Get the user id
      const userId = centralData.userProfile?.id || '';
      
      // Step 4: Categorize Question Templates By Type and Update Game Template Public/Private Question IDs
      const { 
        newQuestionTemplates, 
        draftQuestionTemplates, 
        addedQuestionTemplates 
      } = DraftAssetHandler.categorizeQuestionTemplates(draftQuestionsList);

      const addedQuestionTemplatePublicIds = addedQuestionTemplates
        .filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PUBLIC)
        .map((question) => question.questionTemplate.id);
      const addedQuestionTemplatePrivateIds = addedQuestionTemplates
        .filter((question) => question.questionTemplate.publicPrivateType === PublicPrivateType.PRIVATE)
        .map((question) => question.questionTemplate.id);
      
      updatedDraftGame.gameTemplate.publicQuestionIds = addedQuestionTemplatePublicIds;
      updatedDraftGame.gameTemplate.privateQuestionIds = addedQuestionTemplatePrivateIds;
      this.completedUpdateSteps.push(UpdateDraftAssetStep.CATEGORIZE_QUESTION_TEMPLATES);

      // Step 5: Create new Question Templates
      const newQuestionTemplateResponses = buildQuestionTemplatePromises(
        newQuestionTemplates,
        userId,
        apiClients,
        PublicPrivateType.DRAFT,
      );
      const questionTemplateResponse = await Promise.all(newQuestionTemplateResponses);
      this.completedUpdateSteps.push(UpdateDraftAssetStep.CREATE_NEW_QUESTION_TEMPLATES);

      // Step 6: Create Question Template CCSS and IDs
      const questionTemplateCCSS = questionTemplateResponse.map(
        (question) => String(question?.ccssDescription),
      );
      const addQuestionTemplateCCSS = addedQuestionTemplates
        .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
      const draftQuestionTemplateCCSS = draftQuestionTemplates
        .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
      questionTemplateCCSS.push(...addQuestionTemplateCCSS);
      questionTemplateCCSS.push(...draftQuestionTemplateCCSS);
      this.completedUpdateSteps.push(UpdateDraftAssetStep.PROCESS_ADDED_QUESTION_TEMPLATES);

      // Step 7: Create Game Template
      const createGame = buildGameTemplate(
        updatedDraftGame,
        userId,
        draftQuestionsList,
        gameImgUrl,
        questionTemplateCCSS,
        true
      );

      const gameTemplateResponse =
        await apiClients.gameTemplate.updateGameTemplate(
          PublicPrivateType.DRAFT as TemplateType,
          {...createGame, id: draftGame.gameTemplate.id},
        );
      this.completedUpdateSteps.push(UpdateDraftAssetStep.CREATE_GAME_TEMPLATE);
      // Step 8: Create any new GameQuestions
      const questionTemplateIds = questionTemplateResponse.map((question) =>
        String(question?.id),
      );
      // make sure we have a gameTemplate id as well as question template ids before creating a game question
      if (gameTemplateResponse.id && (questionTemplateIds.length > 0)) {
        // this is only for new questions so we don't write gamequestions that mix draft and public/private questions
        const createGameQuestions = buildGameQuestionPromises(
          updatedDraftGame,
          gameTemplateResponse.id,
          questionTemplateIds,
          apiClients,
          PublicPrivateType.DRAFT,
        );
        // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
        await Promise.all(createGameQuestions);
      }


      // identify draft questions that have been removed from the game and delete the respective gamequestions
      const removedDraftGameQuestions = DraftAssetHandler.extractRemovedDraftQuestionIds(draftQuestionsList, updatedDraftGame);
      if (removedDraftGameQuestions.length > 0) {
        const gameQuestionPromises = removedDraftGameQuestions.map(async (gameQuestionId) => {
          return apiClients.gameQuestions.deleteGameQuestions(PublicPrivateType.DRAFT, gameQuestionId);
        });
        await Promise.all(gameQuestionPromises);
      }
      this.completedUpdateSteps.push(UpdateDraftAssetStep.CREATE_GAME_QUESTIONS);
      const updateDraftGameResponse = {
        ...updatedDraftGame,
        isCreatingTemplate: false,
        isGameCardSubmitted: false,
      }
      return updateDraftGameResponse;
    } catch (err) {
      console.error(`Failed to update draft game:`, err);
      return draftGame;
    }
  }

   /**
   * Publishes a draft game and returns the updated draft game
   * Here are the steps to publish a draft game:
    * 1. Validation
    * 2. Image Upload and Image URL Return
    * 3. Categorize Question Templates By Type
    * 4. Create Question Templates
    * 5. Create Game Template
    * 6. Create GameQuestions
    * 7. Delete Old Draft Game Questions
    * 8. Delete Old Draft Game Template
    * 9. Update User Stats
   * @param centralData - The central data state
   * @param draftGame - The draft game
   * @param draftQuestionsList - The draft questions list
   * @param apiClients - The API clients
   * @param selectedGameId - The selected game id
   * @returns The published draft game (used to adjust state variables in main code)
   */
   async publishDraftGame(
    centralData: ICentralDataState,
    draftGame: TGameTemplateProps, 
    draftQuestionsList: TDraftQuestionsList[], 
    apiClients: IAPIClients,
    selectedGameId: string
  ): Promise<TGameTemplateProps> {
    try{
      const updatedDraftGame: typeof draftGame = {
        ...draftGame,
        isGameCardSubmitted: true,
        isCreatingTemplate: true,
        gameTemplate: {
          ...draftGame.gameTemplate,
          publicPrivateType: draftGame.gameTemplate.finalPublicPrivateType,
        }
      }
      // Step 1: Validation
      const isDraftGameValid = DraftAssetHandler.validateDraftGame(updatedDraftGame, draftQuestionsList);
      this.completedPublishSteps.push(PublishDraftAssetStep.VALIDATION);
      if (isDraftGameValid) {
        // Step 2: Image Upload and Image URL Return
        const gameImgUrl = await DraftAssetHandler.existingImageHandler(updatedDraftGame, apiClients);
        this.completedPublishSteps.push(PublishDraftAssetStep.IMAGE_UPLOAD);
        const userId = centralData.userProfile?.id || '';
       
        // Step 3: Categorize Question Templates By Type
        const { 
          newQuestionTemplates, 
          draftQuestionTemplates, 
          addedQuestionTemplates 
        } = DraftAssetHandler.categorizeQuestionTemplates(draftQuestionsList);
        this.completedPublishSteps.push(PublishDraftAssetStep.CATEGORIZE_QUESTION_TEMPLATES);


        let questionTemplateCCSS: string[] = [];
        let combinedQuestionTemplateIds: string[] = [];
       
        // Step 4: Create Question Templates
        if (
          newQuestionTemplates.length > 0 || 
          draftQuestionTemplates.length > 0 || 
          addedQuestionTemplates.length > 0
        ) {
          // Step 4a: Create New Question Templates (required for newly added questions and draft questions)
          const newQuestionTemplatesPromises = buildQuestionTemplatePromises(
            [...newQuestionTemplates, ...draftQuestionTemplates],
            userId,
            apiClients,
            updatedDraftGame.gameTemplate.publicPrivateType
          );
          
          const questionTemplateResponse =
            await Promise.all(newQuestionTemplatesPromises);
        
          // create an array of all the CCSS descriptions from the response
          questionTemplateCCSS = questionTemplateResponse.map(
            (question) => String(question?.ccssDescription),
          );
          // create an array of all the ids from the response
          const questionTemplateIds = questionTemplateResponse.map(
            (question) => String(question?.id),
          );
          this.completedPublishSteps.push(PublishDraftAssetStep.CREATE_NEW_QUESTION_TEMPLATES);

          // Step 4b: Process Added Question Templates (required for questions that are already public/private)
          // extract ccss descriptions from added question templates
          const addQuestionTemplateCCSS = addedQuestionTemplates
            .map((draftQuestion) => String(draftQuestion.questionTemplate.ccssDescription));
          questionTemplateCCSS.push(...addQuestionTemplateCCSS);
          // create an array of all the ids from the added question templates
          const addedQuestionTemplatesIds = addedQuestionTemplates.map(
            (question) => String(question?.questionTemplate?.id),
          )

          // combined ids from new question templates and added question templates
          // used when creating join table entries
          combinedQuestionTemplateIds = [...questionTemplateIds, ...addedQuestionTemplatesIds];
          this.completedPublishSteps.push(PublishDraftAssetStep.PROCESS_ADDED_QUESTION_TEMPLATES);
        }
          // Step 5: Create Game Template
          const createGame = buildGameTemplate(
            updatedDraftGame,
            userId,
            draftQuestionsList,
            gameImgUrl,
            questionTemplateCCSS
          );
         const gameTemplateResponse =
            await apiClients.gameTemplate.createGameTemplate(
            updatedDraftGame.gameTemplate.publicPrivateType as TemplateType,
            createGame,
          );
          this.completedPublishSteps.push(PublishDraftAssetStep.CREATE_GAME_TEMPLATE);

          // Step 6: Create GameQuestions
          // make sure we have a gameTemplate id as well as question template ids before creating a game question
          if (gameTemplateResponse.id && combinedQuestionTemplateIds.length > 0) {
              combinedQuestionTemplateIds = Array.from(new Set(combinedQuestionTemplateIds));
              const createGameQuestions = buildGameQuestionPromises(
                updatedDraftGame,
                gameTemplateResponse.id,
                combinedQuestionTemplateIds,
                apiClients,
                updatedDraftGame.gameTemplate.publicPrivateType
              );
              // create new gameQuestion with gameTemplate.id & questionTemplate.id pairing
              await Promise.all(createGameQuestions);
          }
          this.completedPublishSteps.push(PublishDraftAssetStep.CREATE_GAME_QUESTIONS);

          // Step 7: Delete Old Draft Game Questions
          // delete draft game questions first to avoid circular reference errors
          if (gameTemplateResponse && selectedGameId && centralData.selectedGame) {
            if (draftQuestionsList.length > 0) {
              const draftGameQuestions = DraftAssetHandler.extractDraftGameQuestionsIds(draftQuestionsList, updatedDraftGame);
              if (draftGameQuestions.length > 0) {
                const gameQuestionPromises = draftGameQuestions.map(async (gameQuestionId) => {
                  return apiClients.gameQuestions.deleteGameQuestions(
                    PublicPrivateType.DRAFT,
                    gameQuestionId,
                  );
                });
                await Promise.all(gameQuestionPromises);
              }
              this.completedPublishSteps.push(PublishDraftAssetStep.DELETE_OLD_DRAFT_GAME_QUESTIONS);
              
            }

            // Step 8: Delete Old Draft Game Template
            const response =await apiClients.gameTemplate.deleteGameTemplate(
              PublicPrivateType.DRAFT as TemplateType,
              selectedGameId
            )
            this.completedPublishSteps.push(PublishDraftAssetStep.DELETE_OLD_DRAFT_GAME_TEMPLATE);
          }
        

        // Step 9: Update User Stats
        // update user stats
        const response = await DraftAssetHandler.updateUserStats(centralData, draftQuestionsList, apiClients);
        if (response) {
          this.completedPublishSteps.push(PublishDraftAssetStep.UPDATE_USER_STATS);
        }
        // TODO: return a value to handle these updates
        // Also handle errors and rollbacks
        // then create an update draft game function (as this is a publish draft game function)
        const publishDraftGameResponse = {
          ...draftGame,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }
        return publishDraftGameResponse;
      } 
      // if the draft game is not valid, return the draft game with the isGameCardErrored flag
      const publishDraftGameResponse = {
        ...draftGame,
        isCreatingTemplate: false,
        ...(!isDraftGameValid && { isGameCardErrored: true }),
      }
      return publishDraftGameResponse;
      
    } catch (err) {
      console.error('Error publishing draft game:', err);
      const publishDraftGameResponse = {
        ...draftGame,
        isCreatingTemplate: false,
      }
      return publishDraftGameResponse;
    }
  }

  async createDraftQuestion(
    centralData: ICentralDataState,
    draftQuestion: CentralQuestionTemplateInput,
    apiClients: IAPIClients,
    originalImageURl: string | null,
  ): Promise<boolean> {
    try {
      let url = ''; 
      if (
        draftQuestion.questionCard.imageUrl !== originalImageURl
      ) {
        url = await DraftAssetHandler.newQuestionImageHandler(draftQuestion, apiClients) || '';
      } else {
        url = draftQuestion.questionCard.imageUrl;
      }
      this.completedCreateQuestionSteps.push(CreateDraftQuestionStep.IMAGE_UPLOAD);
      window.localStorage.setItem(StorageKey, '');
      const response = await apiClients.questionTemplate.createQuestionTemplate(
        PublicPrivateType.DRAFT as TemplateType,
        url,
        centralData.userProfile?.id || '',
        draftQuestion,
      );
      this.completedCreateQuestionSteps.push(CreateDraftQuestionStep.CREATE_QUESTION_TEMPLATE);
      return !!response;
    } catch (err) {
      console.error('Error creating draft question:', err);
      return false;
    }
  }

  async updateDraftQuestion(
    centralData: ICentralDataState,
    draftQuestion: CentralQuestionTemplateInput,
    apiClients: IAPIClients,
    originalImageURl: string | null,
    questionTemplateId: string,
  ): Promise<boolean> {
    try {
      let url = ''; 
      if (
        draftQuestion.questionCard.imageUrl !== originalImageURl
      ) {
        url = await DraftAssetHandler.newQuestionImageHandler(draftQuestion, apiClients) || '';
      } else {
        url = draftQuestion.questionCard.imageUrl;
      }
      this.completedUpdateQuestionSteps.push(UpdateDraftQuestionStep.IMAGE_UPLOAD);
      window.localStorage.setItem(StorageKey, '');
      const response = await apiClients.questionTemplate.updateQuestionTemplate(
        PublicPrivateType.DRAFT as TemplateType,
        url,
        centralData.userProfile?.id || '',
        draftQuestion,
        questionTemplateId,
      );
      this.completedUpdateQuestionSteps.push(UpdateDraftQuestionStep.UPDATE_QUESTION_TEMPLATE);
      return !!response;
    } catch (err) {
      console.error('Error creating draft question:', err);
      return false;
    }
  }
}