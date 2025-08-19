import { BaseAPIClient, GraphQLOptions } from "../BaseAPIClient";
import {
  getUser
} from "../../graphql/queries";
import { GetUserQuery } from "../../AWSMobileApi";
import UserParser from "../parser/UserParser";
import { IAWSUser } from "../models/IAWSUser";


export class UserAPIClient
  extends BaseAPIClient
{
  async getUser(id: string) {
    const queryFunction = getUser;
    const variables: GraphQLOptions = { input: { id } };
    const user = await this.callGraphQL<GetUserQuery>(
        queryFunction,
        variables
    )

    if (user.data.getUser) {
      return UserParser.parseIUserfromIAWSUser(user.data.getUser as unknown as IAWSUser);
    }

    return null;
  }
}