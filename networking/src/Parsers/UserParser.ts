import { IUser } from '../Models/IUser';
import { IUserProfile } from '../Models/IUserProfile';
import { AWSUser } from '../Models/AWS/AWSUser';

export class UserParser {
  static parseIUserfromAWSUser(user: AWSUser): IUser {
    console.log('Parsing user:', user);
    const parsedUser: IUser = {
      id: user.id ?? '',
      userName: user.userName,
      dynamoId: user.dynamoId ?? '',
      cognitoId: user.cognitoId ?? '',
      title: user.title ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email,
      password: user.password ?? '',
      gamesMade: user.gamesMade ?? 0,
      questionsMade: user.questionsMade ?? 0,
      frontIdPath: user.frontIdPath ?? '',
      backIdPath: user.backIdPath ?? '',
      profilePicPath: user.profilePicPath ?? '',
      favoriteGameTemplateIds: user.favoriteGameTemplateIds ? JSON.parse(user.favoriteGameTemplateIds) : [],
      favoriteQuestionTemplateIds: user.favoriteQuestionTemplateIds ? JSON.parse(user.favoriteQuestionTemplateIds) : []
    }
    return parsedUser;
  }

  static parseAWSUserfromAuthUser(user: IUserProfile): AWSUser {
    const parsedUser: AWSUser = {
      id: user.id,
      userName: user.userName,
      cognitoId: user.cognitoId ?? '',
      dynamoId: user.dynamoId,
      frontIdPath: user.frontIdPath,
      backIdPath: user.backIdPath,
      profilePicPath: user.profilePicPath,
      title: user.title ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email,
      password: user.password ?? '',
      gamesMade: user.gamesMade ?? 0,
      questionsMade: user.questionsMade ?? 0,
    }
    return parsedUser;
  }
}