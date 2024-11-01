import { BaseAPIClient } from '../BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';

interface IUser {
  id: string; // more fields to be added that match your schema definition
}

export class UserAPIClient
  extends BaseAPIClient
  implements IUserAPIClient
{
  async createUser<IUser>( 
    createUserInput: IUser
  ): Promise<IUser> {
    let user: any;
    // in here is where we are going to write the call that will ultimately create a user
    // we are going to make use of prewritten functions in BaseAPIClient to actually execute the call via amplify
    // but we need to customize that call to work for a user. This function allows us to do that in a type safe way
    // we can reference UpdateQuestion in QuestionAPIClient.ts (under gamesession) for an example of how to do this
    // you can disregard the parsing functions for now. We just need to determine what our input variables will be and what graphql function we should be passing 
    // to the this.callGraphlQL function that is defined in BaseAPIClient



    // when we are all done, we should be able to do something like apiClients.userAPIClient.createUser({ Input stuff here}); to create the user on the button click

    return user as IUser;
  } 
}