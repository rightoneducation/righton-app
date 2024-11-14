import { BaseAPIClient } from '../BaseAPIClient';
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
  UpdateUserMutationVariables

} from "../../AWSMobileApi";

import {
  createUser,
  deleteUser,
  updateUser
} from "../../graphql";

// interface IUser {
//   id?: string | null,
//   userName: string,
//   title?: string | null,
//   firstName?: string | null,
//   lastName?: string | null,
//   email: string,
//   password?: string | null,
//   gamesMade?: number | null,
//   questionsMade?: number | null,
// }

export class UserAPIClient
  extends BaseAPIClient
  implements IUserAPIClient
{
  async createUser<IUser>( 
    createUserInput: CreateUserInput
  ): Promise<IUser> {
    // in here is where we are going to write the call that will ultimately create a user
    // we are going to make use of prewritten functions in BaseAPIClient to actually execute the call via amplify
    // but we need to customize that call to work for a user. This function allows us to do that in a type safe way
    // we can reference UpdateQuestion in QuestionAPIClient.ts (under gamesession) for an example of how to do this
    // you can disregard the parsing functions for now. We just need to determine what our input variables will be and what graphql function we should be passing 
    // to the this.callGraphlQL function that is defined in BaseAPIClient

    // when we are all done, we should be able to do something like apiClients.userAPIClient.createUser({ Input stuff here}); to create the user on the button click
    const input: CreateUserInput = createUserInput
    const variables: CreateUserMutationVariables = { input }
    console.log(variables)
    const user = await this.callGraphQL<CreateUserMutation>(
        createUser,
        variables
    )
    return user as IUser;
  } 

  async deleteUser<IUser>( 
    deleteUserInput: DeleteUserInput
  ): Promise<IUser> {
    const input: DeleteUserInput = deleteUserInput
    const variables: DeleteUserMutationVariables = { input }
    console.log(variables)
    const user = await this.callGraphQL<DeleteUserMutation>(
        deleteUser,
        variables
    )
    return user as IUser;
  }

  async updateUser<IUser>( 
    updateUserInput: UpdateUserInput
  ): Promise<IUser> {
    const input: UpdateUserInput = updateUserInput
    const variables: UpdateUserMutationVariables = { input }
    const user = await this.callGraphQL<UpdateUserMutation>(
        updateUser,
        variables
    )
    return user as IUser;
  }
}

