import { Environment } from '../interfaces/IBaseAPIClient';
import { ICentralDataManagerAPIClient } from './interfaces/ICentralDataManagerAPIClient';
import { IGameTemplateAPIClient, IQuestionTemplateAPIClient } from '../templates';
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
  protected questionTemplateAPIClient: IQuestionTemplateAPIClient;

  constructor (
    env: Environment,
    authAPIClient: IAuthAPIClient,
    userAPIClient: IUserAPIClient,
    gameTemplateAPIClient: IGameTemplateAPIClient,
    questionTemplateAPIClient: IQuestionTemplateAPIClient,
  ) {
    this.env = env;
    this.authAPIClient = authAPIClient;
    this.userAPIClient = userAPIClient;
    this.gameTemplateAPIClient = gameTemplateAPIClient;
    this.questionTemplateAPIClient = questionTemplateAPIClient;
  } 
  
  public initGames = async () => {
    const response = await this.gameTemplateAPIClient.listGameTemplates(PublicPrivateType.PUBLIC, 12, null, SortDirection.DESC, null, [], null);
    if (response){
      return { nextToken: response.nextToken, games: response.gameTemplates };
    }
    return { nextToken: null, games: [] };
  };

  public initQuestions = async () => {
    const response = await this.questionTemplateAPIClient.listQuestionTemplates(PublicPrivateType.PUBLIC, 24, null, SortDirection.DESC, null, [], null);
    if (response)
      return { nextToken: response.nextToken, questions: response.questionTemplates };
    return { nextToken: null, questions: [] };
  };

  public favoriteGameTemplate = async (gameId: string, user: IUserProfile) => {
    let newFavoriteGameTemplateIds = user.favoriteGameTemplateIds ? JSON.parse(JSON.stringify(user.favoriteGameTemplateIds)) : [];
    const isFav = newFavoriteGameTemplateIds.includes(gameId);
    if (isFav === true)
      newFavoriteGameTemplateIds = newFavoriteGameTemplateIds.filter((id: string) => id !== gameId);
    else 
      newFavoriteGameTemplateIds.push(gameId);
    console.log(newFavoriteGameTemplateIds);
    console.log(user);
    return await this.userAPIClient.updateUser({ id: user.dynamoId ?? '', favoriteGameTemplateIds: JSON.stringify(newFavoriteGameTemplateIds) });
  };

  public favoriteQuestionTemplate = async (questionId: string, favorite: boolean) => {
    console.log(questionId);
    console.log(favorite);
  };

  public searchForGameTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[], favIds: string[] | null) => {
    switch(sortType){
      case SortType.listGameTemplatesByDate: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByGrade: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByQuestionCount: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByQuestionTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplates:
      default: {
        const response = await this.gameTemplateAPIClient.listGameTemplates(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, games: []};
  };

  public searchForQuestionTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[], favIds: string[] | null) => {
    switch(sortType){
      case SortType.listQuestionTemplatesByDate: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGrade: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGameCount: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByGameTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplates:
      default: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplates(type, limit, nextToken, sortDirection, search, gradeTargets, favIds);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, questions: []};
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

    // CreatUserInput is done to avoid putting cognito ID into the dynamoDB
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

  public userProfileImageUpdate = async (user: IUserProfile, newProfilePic: File | null, frontImage?: File | null,
    backImage?: File | null
  ) => {
    console.log("Inside userProfileImageUpdate!!", user)
    let createUserInput = UserParser.parseAWSUserfromAuthUser(user);
    let updatedUser = JSON.parse(JSON.stringify(createUserInput));
    
    if (frontImage && backImage) {
      try {
        const upadtingImages = await Promise.all([
          this.authAPIClient.awsUploadImagePrivate(frontImage) as any,
          this.authAPIClient.awsUploadImagePrivate(backImage) as any
        ]);
        updatedUser = {...updatedUser, frontIdPath: upadtingImages[0].path, backIdPath: upadtingImages[1].path}
        console.log("Going to update images with these: ", upadtingImages)
      }
      catch (error: any) {
        throw new Error (JSON.stringify(error));
      }
    }

    try {
      if(newProfilePic){
        const images = await Promise.all([
          this.authAPIClient.awsUploadImagePrivate(newProfilePic) as any,
        ]);
        updatedUser = { ...updatedUser, profilePicPath: images[0].path};
        console.log("After returning from s3!!", updatedUser)
      }

      await this.userAPIClient.updateUser(updatedUser);
      this.setLocalUserProfile(updatedUser);
      return {updatedUser};
    } catch (error: any) {
      throw new Error (JSON.stringify(error));
    }
  };

  public signOut = async () => {
    this.authAPIClient.awsSignOut();
    this.authAPIClient.isUserAuth = false;
    this.clearLocalUserProfile();
  };
}