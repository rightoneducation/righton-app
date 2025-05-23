
import { BaseAPIClient, GraphQLOptions } from '../BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserInput,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  GetUserQueryVariables,
  UserByCognitoIdQuery,
  UserByCognitoIdQueryVariables,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UserByUserNameQuery,
  GetUserQuery
} from "../../AWSMobileApi";
import {
  getUser,
  userByCognitoId,
  createUser,
  deleteUser,
  updateUser, 
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
}
