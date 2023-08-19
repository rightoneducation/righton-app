import { IUser } from "../Models";

export interface IAuthManager {
  getCurrentAuthenticatedUser(): Promise<IUser | null>;
  signIn(username: string, password: string): Promise<IUser | null>;
  signOut(): Promise<void>;
  confirmSignUp(username: string, code: string): Promise<void>;
  signUp(email: string, password: string, attributes?: object): Promise<IUser>;
}
