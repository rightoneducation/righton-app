import { Auth } from "aws-amplify";
import { IUser, UserRole } from "../../Models";
import { IAuthManager } from "../IAuthManager";
import { BaseAPIClient } from "./BaseAPIClient";
import { isNullOrUndefined } from "../../IApiClient";
import { CognitoUser } from "@aws-amplify/auth";

export class AuthManager extends BaseAPIClient implements IAuthManager {
  private currentUser: IUser | null = null;

  async getCurrentAuthenticatedUser(): Promise<IUser | null> {
    let user;
    try {
      user = await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.error("getCurrentAuthenticatedUser", error);
      throw error;
    }
    if (isNullOrUndefined(user)) {
      return null;
    }
    let userSession = await Auth.userSession(user);
    if (isNullOrUndefined(userSession)) {
      return null;
    }
    this.updateCurrentUser(user);
    console.debug("getCurrentAuthenticatedUser", this.currentUser);
    return this.currentUser;
  }

  async signIn(username: string, password: string): Promise<IUser | null> {
    let user;
    try {
      user = await Auth.signIn(username, password);
    } catch (error) {
      console.error("signIn", error);
      throw error;
    }
    if (isNullOrUndefined(user)) {
      throw new Error("Failed to sign in");
    }
    this.updateCurrentUser(user);
    console.debug("signIn", this.currentUser);
    return this.currentUser;
  }

  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("signOut", error);
      throw error;
    }
    this.currentUser = null;
    console.debug("signOut");
  }

  async confirmSignUp(username: string, code: string): Promise<void> {
    await Auth.confirmSignUp(username, code);
    console.debug("confirmSignUp");
  }

  async signUp(
    email: string,
    password: string,
    attributes?: object
  ): Promise<IUser> {
    let signUpResult;
    try {
      signUpResult = await Auth.signUp({
        username: email,
        password: password,
        attributes: attributes,
      });
    } catch (error) {
      console.error("signUp", error);
      throw error;
    }
    return this.createUserFromCognitoUser(signUpResult.user);
  }

  // private methods
  private updateCurrentUser(user: any) {
    const cognitoUser = user as CognitoUser;
    if (isNullOrUndefined(cognitoUser)) {
      throw new Error("Failed to cast user to CognitoUser");
    }

    this.currentUser = this.createUserFromCognitoUser(cognitoUser);
  }

  private createUserFromCognitoUser(cognitoUser: CognitoUser): IUser {
    let isAdmin = cognitoUser
      .getSignInUserSession()
      ?.getAccessToken()
      .payload["cognito:groups"].includes("admin");
    return {
      role: isAdmin ? UserRole.Admin : UserRole.Student,
      cognitoUser: cognitoUser,
    };
  }
}
