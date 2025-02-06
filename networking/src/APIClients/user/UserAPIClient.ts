import { generateClient } from "@aws-amplify/api";
import { BaseAPIClient, IQueryParameters } from '../BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';

import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserInput,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  TeacherIdAuthInput,
  TeacherIdAuthMutation,
  TeacherIdAuthMutationVariables,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  ListUsersQueryVariables,
} from "../../AWSMobileApi";

import {
  createUser,
  deleteUser,
  updateUser, 
  listUsers,
  teacherIdAuth
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

export const client = generateClient({});

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


    // sample code for checking unique users
    const filter = { userName: { eq: createUserInput.userName }, and: { email: { eq: createUserInput.email } } }
    const listUsersVariables: IQueryParameters = { limit: 1, nextToken: null, filter }
    const response = await client.graphql({query: listUsers, variables: listUsersVariables as ListUsersQueryVariables }) as { data: any };
    if (response.data.listUsers.items.length > 0) {
      throw new Error("User already exists");
    }

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

  // Function to convert a Base64 string to a File
  async base64ToFile(base64: string, fileName: string, mimeType: string): Promise<File> {
    const byteString = atob(base64.split(',')[1]); // Decode Base64
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
  }

  // Function to convert a File to a Base64 string
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  }
  async uploadTeacherId <String>(
    teacherIdImage: File,
    fileName: string,
    fileType: string
  ): Promise<String> {
    const teacherImage = await this.fileToBase64(teacherIdImage)
    const input: TeacherIdAuthInput = {teacherImage, fileName, fileType}
    const variables: TeacherIdAuthMutationVariables = { input }
    console.log("printing variables:" ,variables)
    const imagePath = await this.callGraphQL<TeacherIdAuthMutation>(
        teacherIdAuth,
        variables
    )
    return imagePath as String
  }
}