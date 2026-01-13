import React from 'react';
import { IAPIClients, CloudFrontDistributionUrl, IGameTemplate, IQuestionTemplate, IUser, PublicPrivateType, TemplateType } from '@righton/networking';
import { checkGameFormIsValid, createGameImagePath, buildGameTemplate, buildGameQuestionPromises } from '../helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { checkDQsAreValid, buildQuestionTemplatePromises } from '../helperfunctions/createGame/CreateQuestionsListHelpers';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import { ICentralDataState, ISelectedGame } from '../CentralModels';

import {
  TGameTemplateProps,
  TDraftQuestionsList,
} from '../CreateGameModels';

/**
 * This class is responsible for handling the draft assets for a game
 * Draft assets are complicated for a few reasons:
 * 1. When they are published, public/private assets are created and draft assets are deleted
 * 2. During creation of draft games, public/private questions can be linked to draft games (but cant use join tables)
 * 3. Additionally, draft questions can be linked to the game as draft gameQuestions (using a join table)
 * 4. When a draft game is published, existing public/private questions must be handled separately from draft questions
 */

enum DraftAssetStep {
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
  CREATE_DRAFT_QUESTIONS = 'create_draft_questions',
  CREATE_DRAFT_GAME_QUESTIONS = 'create_draft_game_questions',
  PUBLISH_GAME = 'publish_game',
}

enum QuestionTemplateType {
  NEW, // questions that have been just added before publish (so can be stored directly as public/private)
  DRAFT, // questions that are draft questions, need to be converted to public/private and then deleted
  ADDED, // questions that are already public/private and will be added via publicQuestionIds or privateQuestionIds
}

export class DraftAssetHandler {
  private rollbackActions: Array<() => Promise<void>> = [];
  private completedSteps: DraftAssetStep[] = [];


  private validateDraftGame(draftGame: TGameTemplateProps, draftQuestionsList: TDraftQuestionsList[]): boolean {
    return checkGameFormIsValid(draftGame) && checkDQsAreValid(draftQuestionsList);
  }

  private async imageHandler(draftGame: TGameTemplateProps, apiClients: IAPIClients): Promise<string | null> {
    let gameImgUrl: string | null = null;
    if (draftGame.image || draftGame.imageUrl) {
      if (
        (!draftGame?.imageUrl?.startsWith('https://') ||
        !draftGame?.imageUrl?.startsWith('http://')) && 
        draftGame?.imageUrl
      ) {
        gameImgUrl = draftGame.imageUrl;
      } else {
        if ( draftGame && draftGame.imageUrl && draftGame?.imageUrl?.length > 0){
         draftGame.imageUrl = `${CloudFrontDistributionUrl}${draftGame.imageUrl}`;
        }
        gameImgUrl = await createGameImagePath(draftGame, apiClients);
      }
    }
    return gameImgUrl;
  }

  private categorizeQuestionTemplates(draftQuestionsList: TDraftQuestionsList[]): {
    newQuestionTemplates: TDraftQuestionsList[],
    draftQuestionTemplates: TDraftQuestionsList[],
    addedQuestionTemplates: TDraftQuestionsList[],
  } {
    const newQuestionTemplates: TDraftQuestionsList[] = [];
    const draftQuestionTemplates: TDraftQuestionsList[] = [];
    const addedQuestionTemplates: TDraftQuestionsList[] = [];
    draftQuestionsList.forEach((dq) => {
      if (dq.questionTemplate.publicPrivateType === PublicPrivateType.DRAFT || !dq.questionTemplate.id) {
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

  private extractDraftGameQuestionsIds(draftQuestionsList: TDraftQuestionsList[], selectedGame: ISelectedGame): string[] {
    // pull the question template ids from the selected game and cross reference with categroized question templates
    const draftGameQuestions = selectedGame.game?.questionTemplates
      ?.filter((item) => item.questionTemplate.publicPrivateType === PublicPrivateType.DRAFT)
      ?.map((item) => item.gameQuestionId)
      ?.filter((item) => draftQuestionsList.some((dq) => dq.questionTemplate.id === item))
       ?? [];
    return draftGameQuestions;
  }

  private async updateUserStats(centralData: ICentralDataState, draftQuestionsList: TDraftQuestionsList[], apiClients: IAPIClients): Promise<IUser | null> {
    const existingNumGames = centralData.userProfile?.gamesMade || 0;
    const existingNumQuestions =
      centralData.userProfile?.questionsMade || 0;
    const newNumGames = existingNumGames + 1;
    // add new questions to user number of questions
    const newNumQuestions =
      existingNumQuestions +
      draftQuestionsList.filter((dq) => !dq.questionTemplate.id).length;
    return await apiClients.user.updateUser({
      id: centralData.userProfile?.id || '',
      gamesMade: newNumGames,
      questionsMade: newNumQuestions,
    });
  }

  async publishDraftGame(
    draftGame: TGameTemplateProps, 
    draftQuestionsList: TDraftQuestionsList[], 
    apiClients: IAPIClients,
    selectedGameId: string
  ): Promise<void> {
    const centralData = useCentralDataState(); // used for user profile id
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
      const isDraftGameValid = this.validateDraftGame(updatedDraftGame, draftQuestionsList);
      this.completedSteps.push(DraftAssetStep.VALIDATION);
      if (isDraftGameValid) {
        // Step 2: Image Upload and Image URL Return
        const gameImgUrl = await this.imageHandler(updatedDraftGame, apiClients);
        this.completedSteps.push(DraftAssetStep.IMAGE_UPLOAD);
        const userId = centralData.userProfile?.id || '';
       
        // Step 3: Categorize Question Templates By Type
        const { 
          newQuestionTemplates, 
          draftQuestionTemplates, 
          addedQuestionTemplates 
        } = this.categorizeQuestionTemplates(draftQuestionsList);
        this.completedSteps.push(DraftAssetStep.CATEGORIZE_QUESTION_TEMPLATES);

        let gameTemplateResponse: IGameTemplate | undefined;
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
          let questionTemplateIds = questionTemplateResponse.map(
            (question) => String(question?.id),
          );
          this.completedSteps.push(DraftAssetStep.CREATE_NEW_QUESTION_TEMPLATES);

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
          this.completedSteps.push(DraftAssetStep.PROCESS_ADDED_QUESTION_TEMPLATES);
        }
          // Step 5: Create Game Template
          const createGame = buildGameTemplate(
            updatedDraftGame,
            userId,
            draftQuestionsList,
            gameImgUrl,
            questionTemplateCCSS
          );
          gameTemplateResponse =
            await apiClients.gameTemplate.createGameTemplate(
            updatedDraftGame.gameTemplate.publicPrivateType as TemplateType,
            createGame,
          );
          this.completedSteps.push(DraftAssetStep.CREATE_GAME_TEMPLATE);

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
          this.completedSteps.push(DraftAssetStep.CREATE_GAME_QUESTIONS);

          // Step 7: Delete Old Draft Game Questions
          // delete draft game questions first to avoid circular reference errors
          if (gameTemplateResponse && selectedGameId && centralData.selectedGame) {
            
            if (draftQuestionsList.length > 0) {
              const draftGameQuestions = this.extractDraftGameQuestionsIds(draftQuestionsList, centralData.selectedGame);
              
              if (draftGameQuestions.length > 0) {
                const gameQuestionPromises = draftGameQuestions.map(async (gameQuestionId) => {
                  return apiClients.gameQuestions.deleteGameQuestions(
                    PublicPrivateType.DRAFT,
                    gameQuestionId,
                  );
                });
                await Promise.all(gameQuestionPromises);
              }
              this.completedSteps.push(DraftAssetStep.DELETE_OLD_DRAFT_GAME_QUESTIONS);
            }
            
            // Step 8: Delete Old Draft Game Template
            const response =await apiClients.gameTemplate.deleteGameTemplate(
              PublicPrivateType.DRAFT as TemplateType,
              selectedGameId
            )
            this.completedSteps.push(DraftAssetStep.DELETE_OLD_DRAFT_GAME_TEMPLATE);
          }
        }

        // Step 9: Update User Stats
        // update user stats
        const response = await this.updateUserStats(centralData, draftQuestionsList, apiClients);
        if (response) {
          this.completedSteps.push(DraftAssetStep.UPDATE_USER_STATS);
        }
        // TODO: return a value to handle these updates
        // Also handle errors and rollbacks
        setDraftGame((prev) => ({
          ...prev,
          isCreatingTemplate: false,
          isGameCardSubmitted: false,
        }));
        setModalObject({
          modalState: ModalStateType.CONFIRM,
          confirmState: ConfirmStateType.PUBLISHED,
        });
      } else {
        setDraftGame((prev) => ({
          ...prev,
          ...(!gameFormIsValid && { isGameCardErrored: true }),
          isCreatingTemplate: false,
        }));
        if (!allDQAreValid) {
          setDraftQuestionsList((prev) => handleQuestionListErrors(prev));
          // then find first errored card and set index to that question
        }
      }
  }
}