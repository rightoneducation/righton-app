import { 
  Amplify
} from "aws-amplify";
import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6 } from '@aws-amplify/api-graphql';
import { getClassroom } from "./graphql/queries";
import { getLearningScience, getAnalytics, updateClassroom } from "./graphql/mutations";
import awsconfig from "./aws-exports";

export class APIClient {
  private client: any;
  constructor() {
    this.configAmplify(awsconfig);
    this.client = generateClient({});
  }

  protected async callGraphQL<T>(
    query: any,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResult<T>> {
    const response = this.client.graphql({ query, variables }) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }

  async getClassroom(classId: string) {
    const classroom = await this.callGraphQL<any>(getClassroom, {
      id: classId
    });
    return classroom.data?.getClassroom;
  }

  async getLearningScienceDataByCCSS(ccss: string) {
    const learningScienceData = await this.callGraphQL<any>(getLearningScience, {
      input: { ccss }
    });
    return learningScienceData.data?.getLearningScience;
  }

  async getAnalytics(classroomData: any, learningScienceData: any) {
    const analytics = await this.callGraphQL<any>(getAnalytics, {
      input: {
        classroomData: typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData),
        learningScienceData: typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData),
      }
    });
    return analytics.data?.getAnalytics;
  }

  async updateClassroom(classroomData: any, analytics: string) {
    const input: { id: string; analytics: string; userName?: string } = {
      id: classroomData.id,
      analytics,
    };
    if (classroomData.userName != null) input.userName = classroomData.userName;
    const classroom = await this.callGraphQL<any>(updateClassroom, {
      input,
    });
    return classroom.data?.updateClassroom;
  }
}