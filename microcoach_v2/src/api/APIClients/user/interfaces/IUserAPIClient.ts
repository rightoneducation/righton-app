import { CreateMicroCoachUserInput, UpdateMicroCoachUserInput } from "../../../../AWSAPI";
import { IUser, UserRole } from "../../../Models/IUser";

export interface IUserAPIClient{
    createUser(input: CreateMicroCoachUserInput): Promise<IUser | null>,
    updateUser(input: UpdateMicroCoachUserInput): Promise<IUser | null>,
    getUser(id: string): Promise<IUser | null>,
    getUserByCognitoId(cognitoId: string): Promise<IUser | null>,
    getUserByEmail(email: string): Promise<IUser | null>,
    listUsersByRole(role: UserRole): Promise<IUser[]>,
    getLocalUserProfile(): IUser | null,
    setLocalUserProfile(profile: IUser): void,
    clearLocalUserProfile(): void,
    loginAndRetrieveUserProfile(
      email: string,
      password: string,
    ): Promise<IUser | null>,
    signUpSendConfirmationCode(profile: IUser): Promise<void>,
    signUpConfirmAndBuildBackendUser(
      profile: IUser,
      confirmationCode: string,
    ): Promise<IUser>,
    signUpGoogleBuildBackendUser(profile: IUser): Promise<IUser>,
    signOut(): Promise<void>
}
