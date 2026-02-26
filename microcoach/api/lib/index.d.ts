import { GraphQLResult } from "@aws-amplify/api";
export declare class APIClient {
    private client;
    constructor();
    protected callGraphQL<T>(query: any, variables?: Record<string, unknown>): Promise<GraphQLResult<T>>;
    configAmplify(awsconfig: any): void;
    listClassrooms(): Promise<any>;
    getClassroom(classId: string): Promise<any>;
    listSessions(classroomId: string): Promise<any>;
    getSession(sessionId: string): Promise<any>;
    createMisconception(sessionId: string, item: Record<string, unknown>): Promise<any>;
    updateMisconception(id: string, updates: Record<string, unknown>): Promise<any>;
    listActivities(misconceptionId: string): Promise<any>;
    createActivity(misconceptionId: string, item: Record<string, unknown>): Promise<any>;
    updateActivity(id: string, updates: Record<string, unknown>): Promise<any>;
    getLearningScienceDataByCCSS(ccss: string): Promise<any>;
    getAnalysis(classroomData: any, learningScienceData: any): Promise<any>;
    listRTDExamples(): Promise<any[]>;
    generateRTD(misconception: any, learningScienceData: any, classroomContext?: any, contextData?: any[]): Promise<any>;
    getAnalytics(classroomData: any, learningScienceData: any): Promise<any>;
    updateClassroom(classroomData: any, analytics: string): Promise<any>;
    createSavedNextStep(classroomId: string, item: Record<string, unknown>): Promise<any>;
    updateSavedNextStep(id: string, updates: Record<string, unknown>): Promise<any>;
    deleteSavedNextStep(id: string): Promise<void>;
    listSavedNextSteps(classroomId: string): Promise<any>;
}
