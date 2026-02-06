import { 
  Amplify
} from "aws-amplify";
import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6 } from '@aws-amplify/api-graphql';
import { getClassroom } from "./graphql/queries";
import { getLearningScience } from "./graphql/mutations";
import awsconfig from "./aws-exports";

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GraphQLAuthMode;
}

export class APIClient {
  private client: any;
  constructor() {
    this.configAmplify(awsconfig);
    this.client = generateClient({});
  }
  
  protected async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    const authMode = "iam";
    const response = this.client.graphql({query: query, variables: options, authMode: authMode as GraphQLAuthMode}) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }

  async getClassroom(className: string) {
    const classroom = await this.callGraphQL<any>(getClassroom, {
      input: {
        className: className
      }
    });
    return classroom.data?.getClassroom;
  }

  async getLearningScienceDataByCCSS(ccss: string) {
    const learningScienceData = await this.callGraphQL<any>(getLearningScience, {
      input: {
        ccss: ccss
      }
    });
    return learningScienceData.data?.getLearningScience;
  }
}