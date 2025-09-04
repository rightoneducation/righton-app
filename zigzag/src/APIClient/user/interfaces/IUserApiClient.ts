import { IUser } from "../../../API/models/User/IUser";

export interface IUserApiClient {
    getUser: (id: string) => Promise<IUser | undefined>;
    getUserByEmail: (email: string) => Promise<IUser | undefined>;
    listUsers: (limit?: number, nextToken?: string) => Promise<{ users: IUser[], nextToken?: string }>;
    createUser: (input: Partial<IUser> & { email: string }) => Promise<IUser | undefined>;
    updateUser: (id: string, input: Partial<IUser>) => Promise<IUser | undefined>;
    deleteUser: (id: string) => Promise<void>;
}
