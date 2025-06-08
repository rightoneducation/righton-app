
import { BaseAPIClient, GraphQLOptions } from '../BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserInput,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  DeleteUnverifiedUserMutationVariables,
  GetUserQueryVariables,
  UserByCognitoIdQuery,
  UserByCognitoIdQueryVariables,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UpdateUserPassInput,
  UpdateUserPassMutation,
  UpdateUserPassMutationVariables,
  UserByUserNameQuery,
  UserByEmailQuery,
  GetUserQuery
} from "../../AWSMobileApi";
import {
  getUser,
  userByCognitoId,
  userByEmail,
  createUser,
  deleteUser,
  deleteUnverifiedUser,
  updateUser, 
  updateUserPass,
  userByUserName
} from "../../graphql";
import { UserParser } from "../../Parsers/UserParser";
import { IUser } from '../../Models/IUser';

export class UserAPIClient
  extends BaseAPIClient
  implements IUserAPIClient
{
  async createUser( 
    createUserInput: CreateUserInput
  ): Promise<IUser | null> {
    try{
    const input: CreateUserInput = createUserInput
    const variables: CreateUserMutationVariables = { input }
    const user = await this.callGraphQL<CreateUserMutation>(
        createUser,
        variables
    );
    if (user.data.createUser)
      return UserParser.parseIUserfromAWSUser(user.data.createUser) as IUser;
    } catch (error) {
      console.log(error);
    }
    return null;
  } 

  async deleteUser( 
    deleteUserInput: DeleteUserInput
  ): Promise<IUser | null> {
    const input: DeleteUserInput = deleteUserInput
    const variables: DeleteUserMutationVariables = { input }
    const user = await this.callGraphQL<DeleteUserMutation>(
        deleteUser,
        variables
    )
    if (user.data.deleteUser)
      return UserParser.parseIUserfromAWSUser(user.data.deleteUser) as IUser;
    return null;
  }

  async getUser(
    id: string
  ): Promise<IUser | null> {
    if (!id) return null;
    const variables: GetUserQueryVariables = { id }
    const user = await this.callGraphQL<GetUserQuery>(
        getUser,
        variables as unknown as GraphQLOptions
    )
    if (user.data.getUser)
      return UserParser.parseIUserfromAWSUser(user.data.getUser) as IUser;
    return null;
  }

  async getUserByCognitoId(
    cognitoId: string
  ): Promise<IUser | null> {
    if (!cognitoId) return null;
    const variables: UserByCognitoIdQueryVariables = { cognitoId }
    const user = await this.callGraphQL<UserByCognitoIdQuery>(
        userByCognitoId,
        variables as unknown as GraphQLOptions
    )
    if (user.data.userByCognitoId?.items[0])
      return UserParser.parseIUserfromAWSUser(user.data.userByCognitoId.items[0]) as IUser;
    return null;
  }

  async getUserByUserName(
    userName: string
  ): Promise<IUser | null> {
    const user = await this.callGraphQL<UserByUserNameQuery>(
        userByUserName,
        {userName} as unknown as GraphQLOptions
    )
    if (user.data.userByUserName?.items[0])
      return UserParser.parseIUserfromAWSUser(user.data.userByUserName.items[0]) as IUser;
    return null;
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    const user = await this.callGraphQL<UserByEmailQuery>(
        userByEmail,
        {email} as unknown as GraphQLOptions
    )
    if (user.data.userByEmail?.items[0])
      return UserParser.parseIUserfromAWSUser(user.data.userByEmail.items[0]) as IUser;
    return null;
  }


  async updateUser( 
    updateUserInput: UpdateUserInput
  ): Promise<IUser | null> {
    const input: UpdateUserInput = updateUserInput
    const variables: UpdateUserMutationVariables = { input }
    const user = await this.callGraphQL<UpdateUserMutation>(
        updateUser,
        variables
    )
    if (user.data.updateUser)
      return UserParser.parseIUserfromAWSUser(user.data.updateUser) as IUser;
    return null;
  }

  async deleteUnverifiedUser(
    email: string
  ): Promise<string | null> {
    let variables: DeleteUnverifiedUserMutationVariables = {
      input: { email},
    };
    try {
      const response = await this.mutateGraphQL(
        deleteUnverifiedUser,
        variables as unknown as GraphQLOptions
      ) as {data: { deleteUnverifiedUser: string }};
      const result = response.data.deleteUnverifiedUser;
      return result;
    } catch (e) {
      return null;
    }
  }

  async updateUserPass(
    email: string,
    pass: string
  ): Promise<string | null> {
    console.log("updateUserPass", email, pass);
    const input: UpdateUserPassInput = {email, pass};
    let variables: UpdateUserPassMutationVariables = {
      input,
    };
    console.log(variables);
    console.log("▶️ Sending mutation:", updateUserPass);
    try {
      const response = await this.callGraphQL<UpdateUserPassMutation>(
        updateUserPass,
        variables as unknown as GraphQLOptions
      ) as {data: {updateUserPass: string}};
      const result = response.data.updateUserPass;
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
