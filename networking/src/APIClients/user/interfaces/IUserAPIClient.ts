import {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput
} from "../../../AWSMobileApi";

export interface IUserAPIClient {
  createUser<User>( 
    createUserInput: CreateUserInput
  ): Promise<User>;

  deleteUser<User>( 
    deleteUserInput: DeleteUserInput
  ): Promise<User>;

  updateUser<User>( 
    updateUserInput: UpdateUserInput
  ): Promise<User>;
  
  uploadTeacherId<String>( 
    teacherIdImage: File
  ): Promise<String>;
}