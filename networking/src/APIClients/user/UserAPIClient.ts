// import { generateClient } from "@aws-amplify/api";
import { BaseAPIClient, IQueryParameters, client } from '../BaseAPIClient';
import { IUserAPIClient, } from './interfaces/IUserAPIClient';

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
  ListUsersQueryVariables

} from "../../AWSMobileApi";

import {
  createUser,
  deleteUser,
  updateUser, 
  teacherIdAuth,
  listUsers
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
// export const client = generateClient({});

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

    const userNameFilter = { userName: { eq: createUserInput.userName } };
    const emailFilter = { email: { eq: createUserInput.email } };

    // Check if a user with the same username exists
    const userNameVariables: IQueryParameters = { limit: 1, nextToken: null, filter: userNameFilter };
    const userNameResponse = await client.graphql({ query: listUsers, variables: userNameVariables as ListUsersQueryVariables }) as { data: any };

    // Check if a user with the same email exists
    const emailVariables: IQueryParameters = { limit: 1, nextToken: null, filter: emailFilter };
    const emailResponse = await client.graphql({ query: listUsers, variables: emailVariables as ListUsersQueryVariables }) as { data: any };

    const userNameExists = userNameResponse.data?.listUsers?.items?.length > 0;
    const emailExists = emailResponse.data?.listUsers?.items?.length > 0;

    if (userNameExists && emailExists) {
      throw new Error("Both username and email already exist.");
    } else if (userNameExists) {
      throw new Error("Username already exists.");
    } else if (emailExists) {
      throw new Error("Email already exists.");
    }

    // Proceed with user creation since both are unique
    const input: CreateUserInput = createUserInput;
    const variables: CreateUserMutationVariables = { input };

    console.log("inside create USER");
    const user = await this.callGraphQL<CreateUserMutation>(createUser, variables);

    return user as IUser;

  } 

  // async isNicknameUnique(nickname: string): Promise<boolean> {
  //   const query = `
  //     query UserByUserName($userName: String!) {
  //       userByUserName(userName: $userName) {
  //         items {
  //           id
  //           userName
  //         }
  //       }
  //     }
  //   `;
  
  //   try {
  //     const response = await client.graphql({
  //       query,
  //       variables: { userName: nickname },
  //     }) as { data: { userByUserName: { items: Array<{ id: string; userName: string }> } } };
  
  //     // Check if the response structure is correct
  //     if (response && response.data && response.data.userByUserName) {
  //       const users = response.data.userByUserName.items;
  //       console.log("Found users:", users);
  //       return users.length === 0; // Unique if no matches
  //     } else {
  //       console.error("Unexpected response structure:", response);
  //       return true; // Default to unique if the response is unexpected
  //     }
  //   } catch (error) {
  //     console.error("Error checking nickname uniqueness:", error);
  //     throw new Error("Failed to verify nickname uniqueness.");
  //   }
  // }

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
