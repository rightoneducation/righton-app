export interface IUserAPIClient {
  createUser<User>( 
    createUserInput: User
  ): Promise<User>;
}