import { CognitoUser } from "@aws-amplify/auth";

export enum UserRole {
  Admin,
  Student,
}
export interface IUser {
  role: UserRole;
  cognitoUser: CognitoUser;
}
