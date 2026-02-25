import { Amplify } from "aws-amplify";
import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6 } from '@aws-amplify/api-graphql';
import {
  getClassroom,
  listClassrooms,
  getSession,
  sessionsByClassroomId,
  activitiesByMisconceptionId,
  savedNextStepsByClassroomId,
} from "./graphql/queries";
import {
  getLearningScience,
  getAnalytics,
  getAnalysis,
  generateRTD,
  updateClassroom,
  createMisconception,
  updateMisconception,
  createActivity,
  updateActivity,
  createSavedNextStep,
  updateSavedNextStep,
  deleteSavedNextStep,
} from "./graphql/mutations";
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

  // ── Classroom ──────────────────────────────────────────────────────────────

  async listClassrooms() {
    const result = await this.callGraphQL<any>(listClassrooms);
    return result.data?.listClassrooms?.items ?? [];
  }

  async getClassroom(classId: string) {
    const classroom = await this.callGraphQL<any>(getClassroom, { id: classId });
    return classroom.data?.getClassroom;
  }

  // ── Session ────────────────────────────────────────────────────────────────

  async listSessions(classroomId: string) {
    const result = await this.callGraphQL<any>(sessionsByClassroomId, { classroomId });
    return result.data?.sessionsByClassroomId?.items ?? [];
  }

  async getSession(sessionId: string) {
    const result = await this.callGraphQL<any>(getSession, { id: sessionId });
    return result.data?.getSession ?? null;
  }

  // ── Misconception ──────────────────────────────────────────────────────────

  async createMisconception(sessionId: string, item: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(createMisconception, {
      input: { ...item, sessionId },
    });
    return result.data?.createMisconception;
  }

  async updateMisconception(id: string, updates: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(updateMisconception, {
      input: { id, ...updates },
    });
    return result.data?.updateMisconception;
  }

  // ── Activity ───────────────────────────────────────────────────────────────

  async listActivities(misconceptionId: string) {
    const result = await this.callGraphQL<any>(activitiesByMisconceptionId, { misconceptionId });
    return result.data?.activitiesByMisconceptionId?.items ?? [];
  }

  async createActivity(misconceptionId: string, item: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(createActivity, {
      input: {
        ...item,
        misconceptionId,
        misconceptionActivitiesId: misconceptionId,
      },
    });
    return result.data?.createActivity;
  }

  async updateActivity(id: string, updates: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(updateActivity, {
      input: { id, ...updates },
    });
    return result.data?.updateActivity;
  }

  // ── Learning Science / Analytics ───────────────────────────────────────────

  async getLearningScienceDataByCCSS(ccss: string) {
    const learningScienceData = await this.callGraphQL<any>(getLearningScience, {
      input: { ccss },
    });
    return learningScienceData.data?.getLearningScience;
  }

  async getAnalysis(classroomData: any, learningScienceData: any) {
    const result = await this.callGraphQL<any>(getAnalysis, {
      input: {
        classroomData: typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData),
        learningScienceData: typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData),
      },
    });
    return result.data?.getAnalysis;
  }

  async generateRTD(misconception: any, learningScienceData: any, classroomContext?: any) {
    const result = await this.callGraphQL<any>(generateRTD, {
      input: {
        misconception: typeof misconception === 'string' ? misconception : JSON.stringify(misconception),
        learningScienceData: typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData),
        ...(classroomContext != null && {
          classroomContext: typeof classroomContext === 'string' ? classroomContext : JSON.stringify(classroomContext),
        }),
      },
    });
    return result.data?.generateRTD;
  }

  async getAnalytics(classroomData: any, learningScienceData: any) {
    const analytics = await this.callGraphQL<any>(getAnalytics, {
      input: {
        classroomData:
          typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData),
        learningScienceData:
          typeof learningScienceData === 'string'
            ? learningScienceData
            : JSON.stringify(learningScienceData),
      },
    });
    return analytics.data?.getAnalytics;
  }

  async updateClassroom(classroomData: any, analytics: string) {
    const input: { id: string; analytics: string; userName?: string } = {
      id: classroomData.id,
      analytics,
    };
    if (classroomData.userName != null) input.userName = classroomData.userName;
    const classroom = await this.callGraphQL<any>(updateClassroom, { input });
    return classroom.data?.updateClassroom;
  }

  // ── SavedNextStep ──────────────────────────────────────────────────────────

  async createSavedNextStep(classroomId: string, item: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(createSavedNextStep, {
      input: { ...item, classroomId },
    });
    return result.data?.createSavedNextStep;
  }

  async updateSavedNextStep(id: string, updates: Record<string, unknown>) {
    const result = await this.callGraphQL<any>(updateSavedNextStep, {
      input: { id, ...updates },
    });
    return result.data?.updateSavedNextStep;
  }

  async deleteSavedNextStep(id: string) {
    await this.callGraphQL<any>(deleteSavedNextStep, { input: { id } });
  }

  async listSavedNextSteps(classroomId: string) {
    const result = await this.callGraphQL<any>(savedNextStepsByClassroomId, { classroomId });
    return result.data?.savedNextStepsByClassroomId?.items ?? [];
  }
}
