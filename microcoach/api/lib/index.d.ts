import { GraphQLResult } from "@aws-amplify/api";
export declare class APIClient {
    private client;
    constructor();
    protected callGraphQL<T>(query: any, variables?: Record<string, unknown>): Promise<GraphQLResult<T>>;
    configAmplify(awsconfig: any): void;
    getClassroom(classId: string): Promise<any>;
    getLearningScienceDataByCCSS(ccss: string): Promise<any>;
    getAnalytics(classroomData: any, learningScienceData: any): Promise<any>;
    updateClassroom(classroomData: any, analytics: string): Promise<any>;
    createSavedNextStep(classroomId: string, item: Record<string, unknown>): Promise<any>;
    updateSavedNextStep(id: string, updates: Record<string, unknown>): Promise<any>;
    deleteSavedNextStep(id: string): Promise<void>;
    listSavedNextSteps(classroomId: string): Promise<any>;
}
