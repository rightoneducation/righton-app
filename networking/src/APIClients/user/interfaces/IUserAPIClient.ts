import {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput
} from "../../../AWSMobileApi";
import { IUser } from '../../../Models/IUser';

export interface IUserAPIClient {
  createUser( 
    createUserInput: CreateUserInput
  ): Promise<IUser | null>;

  deleteUser( 
    deleteUserInput: DeleteUserInput
  ): Promise<IUser | null>;

  getUserByCognitoId(
    cognitoId: string
  ): Promise<IUser | null>;

  getUserByUserName(
    userName: string
  ): Promise<IUser | null>;

  getUserByEmail( 
    email: string
  ): Promise<IUser | null>;

  getUser(
    id: string
  ): Promise<IUser | null>;

  updateUser( 
    updateUserInput: UpdateUserInput
  ): Promise<IUser | null>;
}