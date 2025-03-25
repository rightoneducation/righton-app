
import { BaseAPIClient, GraphQLOptions } from '../BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserInput,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UserByUserNameQuery
} from "../../AWSMobileApi";
import {
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
    const input: CreateUserInput = createUserInput
    const variables: CreateUserMutationVariables = { input }
    const user = await this.callGraphQL<CreateUserMutation>(
        createUser,
        variables
    );
    if (user.data.createUser)
      return UserParser.parseIUserfromAWSUser(user.data.createUser) as IUser;
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

  async getUserByUserName(
    userName: string
  ): Promise<IUser | null> {
    const user = await this.callGraphQL<UserByUserNameQuery>(
        userByUserName,
        {userName} as unknown as GraphQLOptions
    )
    console.log(user);
    if (user.data.userByUserName?.items[0])
      return UserParser.parseIUserfromAWSUser(user.data.userByUserName.items[0]) as IUser;
    return null;
  }
  

  async updateUser( 
    updateUserInput: UpdateUserInput
  ): Promise<IUser | null> {
    console.log(updateUserInput);
    const input: UpdateUserInput = updateUserInput
    const variables: UpdateUserMutationVariables = { input }
    console.log(variables);
    const user = await this.callGraphQL<UpdateUserMutation>(
        updateUser,
        variables
    )
    console.log(user.data.updateUser);
    if (user.data.updateUser)
      return UserParser.parseIUserfromAWSUser(user.data.updateUser) as IUser;
    return null;
  }
}
