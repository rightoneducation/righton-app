import { IUser } from "../../models/User/IUser";
import { IAWSUser } from "../../models/User/IAWSUser";
import { getUser, listUsers } from "../../../graphql/queries";
import { createUser, updateUser, deleteUser } from "../../../graphql/mutations";
import { BaseAPIClient, GraphQLOptions } from "../../BaseAPIClient";
import { GetUserQuery, ListUsersQuery, CreateUserMutation, UpdateUserMutation, DeleteUserMutation } from "../../../../AWSMobileApi";
import { UserParser } from "../../parser/UserParser";
import { IUserApiClient } from "../../../APIClient/user/interfaces/IUserApiClient";

export class UserApiClient extends BaseAPIClient implements IUserApiClient {
  
  async getUser(id: string): Promise<IUser | undefined> {
    try {
      const queryFunction = getUser;
      const variables: GraphQLOptions = { input: { id } };

      const user = await this.callGraphQL<GetUserQuery>(
        queryFunction,
        variables
      );

      if (!user.data.getUser) {
        throw new Error("User not found.");
      }

      return UserParser.userFromAWSUser(user.data.getUser as IAWSUser);
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user.");
    }
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    try {
      const queryFunction = listUsers;
      const variables: GraphQLOptions = { 
        input: { 
          filter: { email: { eq: email } },
          limit: 1
        } 
      };

      const users = await this.callGraphQL<ListUsersQuery>(
        queryFunction,
        variables
      );

      if (!users.data.listUsers?.items || users.data.listUsers.items.length === 0) {
        throw new Error("User not found.");
      }

      return UserParser.userFromAWSUser(users.data.listUsers.items[0] as IAWSUser);
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user by email.");
    }
  }

  async listUsers(limit?: number, nextToken?: string): Promise<{ users: IUser[], nextToken?: string }> {
    try {
      const queryFunction = listUsers;
      const variables: GraphQLOptions = { 
        input: { 
          limit: limit || 100,
          nextToken 
        } 
      };

      const response = await this.callGraphQL<ListUsersQuery>(
        queryFunction,
        variables
      );

      if (!response.data.listUsers) {
        throw new Error("Failed to fetch users.");
      }

      const users = response.data.listUsers.items?.map((user: any) => 
        UserParser.userFromAWSUser(user as IAWSUser)
      ) || [];

      return {
        users,
        nextToken: response.data.listUsers.nextToken || undefined
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching users.");
    }
  }

  async createUser(input: Partial<IUser> & { email: string }): Promise<IUser | undefined> {
    try {
      const queryFunction = createUser;
      
      // Convert IUser to AWS format for mutation
      const awsInput = this.convertIUserToAWSInput(input);
      
      const variables: GraphQLOptions = { input: awsInput };

      const response = await this.callGraphQL<CreateUserMutation>(
        queryFunction,
        variables
      );

      if (!response.data.createUser) {
        throw new Error("Failed to create user.");
      }

      return UserParser.userFromAWSUser(response.data.createUser as IAWSUser);
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user.");
    }
  }

  async updateUser(id: string, input: Partial<IUser>): Promise<IUser | undefined> {
    try {
      const queryFunction = updateUser;
      
      // Convert IUser to AWS format for mutation
      const awsInput = this.convertIUserToAWSInput(input);
      awsInput.id = id; // Ensure ID is set for update
      
      const variables: GraphQLOptions = { input: awsInput };

      const response = await this.callGraphQL<UpdateUserMutation>(
        queryFunction,
        variables
      );

      if (!response.data.updateUser) {
        throw new Error("Failed to update user.");
      }

      return UserParser.userFromAWSUser(response.data.updateUser as IAWSUser);
    } catch (error) {
      console.error(error);
      throw new Error("Error updating user.");
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const queryFunction = deleteUser;
      const variables: GraphQLOptions = { input: { id } };

      const response = await this.callGraphQL<DeleteUserMutation>(
        queryFunction,
        variables
      );

      if (!response.data.deleteUser) {
        throw new Error("Failed to delete user.");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting user.");
    }
  }

  // Helper method to convert IUser to AWS input format
  private convertIUserToAWSInput(input: Partial<IUser>): any {
    const awsInput: any = {};

    if (input.email !== undefined) awsInput.email = input.email;
    if (input.userName !== undefined) awsInput.userName = input.userName;
    if (input.password !== undefined) awsInput.password = input.password;
    if (input.points !== undefined) awsInput.points = input.points;
    if (input.currentStreak !== undefined) awsInput.currentStreak = input.currentStreak;
    if (input.maxStreak !== undefined) awsInput.maxStreak = input.maxStreak;
    if (input.globalRank !== undefined) awsInput.globalRank = input.globalRank;
    if (input.topSubjects !== undefined) awsInput.topSubjects = input.topSubjects;
    if (input.accuracy !== undefined) awsInput.accuracy = input.accuracy;
    if (input.hasAnsweredToday !== undefined) awsInput.hasAnsweredToday = input.hasAnsweredToday;
    if (input.lastAnsweredDate !== undefined) awsInput.lastAnsweredDate = input.lastAnsweredDate?.toISOString();
    if (input.sessions !== undefined) awsInput.sessions = JSON.stringify(input.sessions);

    return awsInput;
  }
}
