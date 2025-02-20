import { IUser } from '../Models/IUser';
import { IUserProfile } from '../Models/IUserProfile';
import { AWSUser } from '../Models/AWS/AWSUser';

export class UserParser {
  static parseIUserfromAWSUser(user: AWSUser): IUser {
    
    const parsedUser: IUser = {
      id: user.id ?? '',
      username: user.userName,
      title: user.title ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email,
      password: user.password ?? '',
      gamesMade: user.gamesMade ?? 0,
      questionsMade: user.questionsMade ?? 0
    }
    return parsedUser;
  }

  static parseAWSUserfromAuthUser(user: IUserProfile): AWSUser {
    const parsedUser: AWSUser = {
      id: user.id,
      userName: user.username,
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