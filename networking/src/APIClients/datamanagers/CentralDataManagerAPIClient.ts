import { Environment } from '../interfaces/IBaseAPIClient';
import { ICentralDataManagerAPIClient } from './interfaces/ICentralDataManagerAPIClient';
import { IGameTemplateAPIClient, IQuestionTemplateAPIClient, IGameQuestionsAPIClient } from '../templates';
import { PublicPrivateType, SortDirection, GradeTarget, SortType } from "../BaseAPIClient";
import { IUserProfile } from '../../Models/IUserProfile';
import { IAuthAPIClient } from '../auth';
import { IUserAPIClient } from '../user';
import { UserParser } from '../../Parsers/UserParser';
import {
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';

export const userProfileLocalStorage = 'righton_userprofile';

export class CentralDataManagerAPIClient implements ICentralDataManagerAPIClient{
  protected env: Environment;
  protected authAPIClient: IAuthAPIClient;
  protected userAPIClient: IUserAPIClient;
  protected gameTemplateAPIClient: IGameTemplateAPIClient;
  protected gameQuestionsAPIClient: IGameQuestionsAPIClient;
  protected questionTemplateAPIClient: IQuestionTemplateAPIClient;

  constructor (
    env: Environment,
    authAPIClient: IAuthAPIClient,
    userAPIClient: IUserAPIClient,
    gameTemplateAPIClient: IGameTemplateAPIClient,
    gameQuestionsAPIClient: IGameQuestionsAPIClient,
    questionTemplateAPIClient: IQuestionTemplateAPIClient,
  ) {
    this.env = env;
    this.authAPIClient = authAPIClient;
    this.userAPIClient = userAPIClient;
    this.gameTemplateAPIClient = gameTemplateAPIClient;
    this.gameQuestionsAPIClient = gameQuestionsAPIClient;
    this.questionTemplateAPIClient = questionTemplateAPIClient;
  } 
  
  public initGames = async () => {
    let games = [];
    const response = await this.gameTemplateAPIClient.listGameTemplates(PublicPrivateType.PUBLIC, 12, null, SortDirection.DESC, null, [], null, true);
    if (response){
      games.push(...response.gameTemplates);
      while (games.length < 12) {
        if (!response.nextToken) break;
        const nextResponse = await this.gameTemplateAPIClient.listGameTemplates(PublicPrivateType.PUBLIC, 12, response.nextToken, SortDirection.DESC, null, [], null, true);
        if (nextResponse && nextResponse.gameTemplates) {
          games.push(...nextResponse.gameTemplates);
          response.nextToken = nextResponse.nextToken;
        } else {
          break;
        }
      }
      return { nextToken: response.nextToken, games };
    }
    return { nextToken: null, games: [] };
  };

  public initQuestions = async () => {
    let questions = [];
    const response = await this.questionTemplateAPIClient.listQuestionTemplates(PublicPrivateType.PUBLIC, 24, null, SortDirection.DESC, null, [], null);
    if (response) {
      questions.push(...response.questionTemplates);
      while (questions.length < 24) {
        if (!response.nextToken) break;
        const nextResponse = await this.questionTemplateAPIClient.listQuestionTemplates(PublicPrivateType.PUBLIC, 24, response.nextToken, SortDirection.DESC, null, [], null);
        if (nextResponse && nextResponse.questionTemplates) {
          questions.push(...nextResponse.questionTemplates);
          response.nextToken = nextResponse.nextToken;
        } else {
          break;
        }
      }
      return { nextToken: response.nextToken, questions };
    }
    return { nextToken: null, questions: [] };
  };

  public favoriteGameTemplate = async (gameId: string, user: IUserProfile) => {
    let newFavoriteGameTemplateIds = user.favoriteGameTemplateIds ? JSON.parse(JSON.stringify(user.favoriteGameTemplateIds)) : [];
    const isFav = newFavoriteGameTemplateIds.includes(gameId);
    if (isFav === true)
      newFavoriteGameTemplateIds = newFavoriteGameTemplateIds.filter((id: string) => id !== gameId);
    else 
      newFavoriteGameTemplateIds.push(gameId);
    return await this.userAPIClient.updateUser({ id: user.dynamoId ?? '', favoriteGameTemplateIds: JSON.stringify(newFavoriteGameTemplateIds) });
  };

  public favoriteQuestionTemplate = async (questionId: string, user: IUserProfile) => {
    let newFavoriteQuestionTemplateIds = user.favoriteQuestionTemplateIds ? JSON.parse(JSON.stringify(user.favoriteQuestionTemplateIds)) : [];
    const isFav = newFavoriteQuestionTemplateIds.includes(questionId);
    if (isFav === true)
      newFavoriteQuestionTemplateIds = newFavoriteQuestionTemplateIds.filter((id: string) => id !== questionId);
    else 
      newFavoriteQuestionTemplateIds.push(questionId);
    return await this.userAPIClient.updateUser({ id: user.dynamoId ?? '', favoriteQuestionTemplateIds: JSON.stringify(newFavoriteQuestionTemplateIds) });
  };

  public searchForGameTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[], favIds: string[] | null, isLibrary?: boolean, userId?: string) => {
    switch(sortType){
      case SortType.listGameTemplatesByDate: {
        let response;
        if (!isLibrary) 
          response = await this.gameTemplateAPIClient.listGameTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.gameTemplateAPIClient.listGameTemplatesByUserDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByGrade: {
        let response;
        if (!isLibrary)
         response = await this.gameTemplateAPIClient.listGameTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.gameTemplateAPIClient.listGameTemplatesByUserGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByQuestionCount: {
        let response;
        if (!isLibrary)
          response = await this.gameTemplateAPIClient.listGameTemplatesByQuestionTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.gameTemplateAPIClient.listGameTemplatesByUserPublicQuestionTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplates:
      default: {
        let response;
        if (!isLibrary)
          response = await this.gameTemplateAPIClient.listGameTemplates(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.gameTemplateAPIClient.listGameTemplatesByUserDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, games: []};
  };

  public searchForQuestionTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[], favIds: string[] | null, isLibrary?: boolean, userId?: string) => {
    switch(sortType){
      case SortType.listQuestionTemplatesByDate: {
        let response;
        if (!isLibrary)
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByUserDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGrade: {
        let response;
        if (!isLibrary)
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByUserGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGameCount: {
        let response;
        if (!isLibrary)
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByGameTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByUserPublicGameTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplates:
      default: {
        let response;
        if (!isLibrary)
          response = await this.questionTemplateAPIClient.listQuestionTemplates(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        else 
          response = await this.questionTemplateAPIClient.listQuestionTemplatesByUserDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds, userId ?? '');
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, questions: []};
  };

  public removeQuestionTemplateFromGameTemplate = async (type: PublicPrivateType, questionId: string, gameId: string) => {
    const gameQuestionIds = await this.questionTemplateAPIClient.getQuestionTemplateJoinTableIds(type, questionId);
    const gameQuestionId = gameQuestionIds.find((id) => id === gameId);

    if (gameQuestionId) {
      try {
        await this.gameQuestionsAPIClient.deleteGameQuestions(type, gameQuestionId);
        return true;
      } catch (error: any) {
        throw new Error(`Failed to delete game question associated with question template: ${error.message}`);
      }
    }
    return false;
  };

  public deleteQuestionTemplate = async (type: PublicPrivateType, questionId: string) => {
    try {
      // need to delete the question template from the join table first
      const gameQuestionIds = await this.questionTemplateAPIClient.getQuestionTemplateJoinTableIds( type, questionId);
      if (gameQuestionIds && gameQuestionIds.length > 0) {
        const deletedGameQuestions = gameQuestionIds.map(async (gameQuestionId) => {
          await this.gameQuestionsAPIClient.deleteGameQuestions(type, gameQuestionId);
        });
        Promise.all(deletedGameQuestions).then(() =>{
          // Now delete the question template itself
          const response = this.questionTemplateAPIClient.deleteQuestionTemplate(type, questionId);
          return response;
        })
        .catch((error) => {
          throw new Error(`Failed to delete game questions associated with question template: ${error.message}`);
        });
      } else {
        // If there are no game questions associated with the question template, delete the question template directly
        const response = this.questionTemplateAPIClient.deleteQuestionTemplate(type, questionId);
        return response;
      }
      return;
    } catch (error: any) {
        throw new Error(`Failed to delete question template: ${error.message}`);
    }
  };

  public refreshLocalUserProfile = async () => {
    const localUser = window.localStorage.getItem(userProfileLocalStorage);
    const parsedLocalUser = localUser ? JSON.parse(localUser) : null;
    if (!parsedLocalUser) return;

    const result = this.userAPIClient.getUserByUserName(parsedLocalUser.userName).then((updatedUser) => {
      if (updatedUser !== null){
        const userProfile = { ...parsedLocalUser, ...updatedUser };
        this.setLocalUserProfile(userProfile);
        return userProfile;
      } else {
        this.clearLocalUserProfile();
        return null;
      }
    });
    return result;
  }

  public getLocalUserProfile = () => {
    const profile = window.localStorage.getItem(userProfileLocalStorage);
    if (profile){
      return JSON.parse(profile) as IUserProfile;
    }
    return null;
  };

  public setLocalUserProfile = (userProfile: IUserProfile) => {
    window.localStorage.setItem(userProfileLocalStorage, JSON.stringify(userProfile));
  }

  public clearLocalUserProfile = () => {
    window.localStorage.removeItem(userProfileLocalStorage);
  }

  public getUser = async (cognitoId: string) => {
    const userProfile = await this.userAPIClient.getUserByCognitoId(cognitoId);
    if (userProfile !== null){
      this.setLocalUserProfile(userProfile);
      return userProfile;
    }
    return null;
  }

  public loginUserAndRetrieveUserProfile = async (userName: string, password: string) => {
    let userProfile = null;
    try {
      await this.authAPIClient.awsSignIn(userName, password);
      const currentCognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      if (!attributes || !attributes.nickname) 
        return null;
      const currentDynamoDBUser = await this.userAPIClient.getUserByUserName(attributes.nickname);
      if  (currentDynamoDBUser !== null){
        userProfile = {
          cognitoId: currentCognitoUser.userId,
          ...currentDynamoDBUser
        };
      this.setLocalUserProfile(userProfile); 
      this.authAPIClient.isUserAuth = true;
     }
      return userProfile;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public loginGoogleAndRetrieveUserProfile = async () => {
    let userProfile = null;
    try {
      await this.authAPIClient.awsSignInFederated();
      const currentSession = await this.authAPIClient.getCurrentSession();
      const cognitoId = currentSession?.userSub;
      if (!cognitoId) 
        return null;
      const currentDynamoDBUser = await this.userAPIClient.getUser(cognitoId);
      if  (currentDynamoDBUser !== null){
        userProfile = {
          cognitoId: cognitoId,
          ...currentDynamoDBUser
        };
      }
      if  (currentDynamoDBUser && userProfile){
        this.setLocalUserProfile(userProfile); 
        this.authAPIClient.isUserAuth = true;
      }
      return userProfile;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public signUpSendConfirmationCode = async (user: IUserProfile) => {
    return this.authAPIClient.awsSignUp(user.userName, user.email, user.password ?? '');
  };

  public signUpConfirmAndBuildBackendUser = async (user: IUserProfile, confirmationCode: string, frontImage: File, backImage: File) => {
    let createUserInput = UserParser.parseAWSUserfromAuthUser(user);
    let updatedUser = JSON.parse(JSON.stringify(user));
    try {
      await this.authAPIClient.awsConfirmSignUp(user.email, confirmationCode);
    } catch (error: any) {
      throw new Error(error);
    }
    try {
      await this.authAPIClient.awsSignIn(user.email, user.password ?? '');
      const currentUser = await getCurrentUser();
      const images = await Promise.all([
        this.authAPIClient.awsUploadImagePrivate(frontImage) as any,
        this.authAPIClient.awsUploadImagePrivate(backImage) as any
      ]);
      const dynamoId = uuidv4();
      createUserInput = { ...createUserInput, id: dynamoId, frontIdPath: images[0].path, backIdPath: images[1].path, cognitoId: currentUser.userId, dynamoId: dynamoId };

      const randomIndex = Math.floor(Math.random() * 5) + 1;
      
      updatedUser = { ...createUserInput, id: dynamoId, frontIdPath: images[0].path, backIdPath: images[1].path, cognitoId: currentUser.userId, dynamoId: dynamoId, profilePicPath: `defaultProfilePic${randomIndex}.jpg`};
      await this.userAPIClient.createUser(updatedUser);
      this.setLocalUserProfile(updatedUser);
      this.authAPIClient.isUserAuth = true;

      return { updatedUser, images };
    } catch (error: any) {
      this.authAPIClient.awsUserCleaner(updatedUser);
      throw new Error (error);
    }
  };


  public signUpGoogleBuildBackendUser = async (user: IUserProfile, frontImage: File, backImage: File) => {
    // Need to put it in Email into user.
    let getEmail = await this.authAPIClient.getUserEmail();
    if(getEmail){
      user.email = getEmail;
    }
    let createUserInput = UserParser.parseAWSUserfromAuthUser(user);
    let updatedUser = JSON.parse(JSON.stringify(user));
    let firstName = createUserInput.firstName;
    let lastName = createUserInput.lastName;
    try {
      const currentUser = await getCurrentUser();
      updatedUser = { ...updatedUser, cognitoId: currentUser.userId };
      const images = await Promise.all([
        this.authAPIClient.awsUploadImagePrivate(frontImage) as any,
        this.authAPIClient.awsUploadImagePrivate(backImage) as any
      ]);
      const dynamoId = uuidv4();
      
      createUserInput = { ...createUserInput, id: dynamoId, firstName, lastName, frontIdPath: images[0].path, backIdPath: images[1].path, cognitoId: currentUser.userId, dynamoId: dynamoId };
      const randomIndex = Math.floor(Math.random() * 5) + 1;

      updatedUser = { ...createUserInput, id: dynamoId, firstName, lastName, frontIdPath: images[0].path, backIdPath: images[1].path, cognitoId: currentUser.userId, dynamoId: dynamoId, profilePicPath: `defaultProfilePic${randomIndex}.jpg` };
      await this.userAPIClient.createUser(updatedUser);
      this.setLocalUserProfile(updatedUser);
      this.authAPIClient.isUserAuth = true;
      //TODO: set user status to LOGGED_IN
      return { updatedUser, images };

    } catch (error: any) {
      this.authAPIClient.awsUserCleaner(updatedUser);
      throw new Error (JSON.stringify(error));
    }
  };

  public userProfileInformationUpdate = async (user: IUserProfile, oldUser: IUserProfile, frontImage?: File | null,
    backImage?: File | null
  ) => {
    let createUserInput = UserParser.parseAWSUserfromAuthUser(user);
    let updatedUser = JSON.parse(JSON.stringify(createUserInput));

    let oldUserInput = UserParser.parseAWSUserfromAuthUser(oldUser);

    if(updatedUser.userName != oldUserInput.userName){
      try {
        await this.authAPIClient.updateCognitoUsername(updatedUser.userName)
      }
      catch (error: any) {
        throw new Error (JSON.stringify(error));
      }
    }
    
    if (frontImage && backImage) {
      try {
        const upadtingImages = await Promise.all([
          this.authAPIClient.awsUploadImagePrivate(frontImage) as any,
          this.authAPIClient.awsUploadImagePrivate(backImage) as any
        ]);
        updatedUser = {...updatedUser, frontIdPath: upadtingImages[0].path, backIdPath: upadtingImages[1].path}
      }
      catch (error: any) {
        throw new Error (JSON.stringify(error));
      }
    }
    if(frontImage || backImage){
      if (frontImage) {
        try {
          const uploadedFront = await this.authAPIClient.awsUploadImagePrivate(frontImage) as any;
          updatedUser = { ...updatedUser, frontIdPath: uploadedFront.path };
        } catch (error: any) {
          throw new Error(`Front image upload failed: ${JSON.stringify(error)}`);
        }
      }
      if (backImage) {
        try {
          const uploadedBack = await this.authAPIClient.awsUploadImagePrivate(backImage) as any;
          updatedUser = { ...updatedUser, backIdPath: uploadedBack.path };
        } catch (error: any) {
          throw new Error(`Back image upload failed: ${JSON.stringify(error)}`);
        }
      }
    }

    await this.userAPIClient.updateUser(updatedUser);
    this.setLocalUserProfile(updatedUser);
    return { updatedUser };
  };


  public userProfileImageUpdate = async (user: IUserProfile, newProfilePic: File | null) => {
    let createUserInput = UserParser.parseAWSUserfromAuthUser(user);
    let updatedUser = JSON.parse(JSON.stringify(createUserInput));

    if (newProfilePic) {
      try {
        const uploadedImage = await this.authAPIClient.awsUploadImagePrivate(newProfilePic) as any;
        updatedUser = { ...updatedUser, profilePicPath: uploadedImage.path };
      } catch (error: any) {
        throw new Error(`Profile image upload failed: ${JSON.stringify(error)}`);
      }
    }
    await this.userAPIClient.updateUser(updatedUser);
    this.setLocalUserProfile(updatedUser);
    return { updatedUser };
  };


  public signOut = async () => {
    await this.authAPIClient.awsSignOut();
    this.authAPIClient.isUserAuth = false;
    this.clearLocalUserProfile();
  };
}