import { IMisconceptionEvidence } from './MisconceptionEvidenceParser';
import { ITabs } from './TabsParser';
import { ICCSSStandards } from './GapGroupParser';
/**
 * The shape of a SavedNextStep as used in React state and UI components.
 * Timestamps are milliseconds (number), complex fields are parsed objects.
 */
export interface ILocalSavedNextStep {
    id: string;
    createdAt: number;
    completedAt: number | undefined;
    status: 'planned' | 'completed';
    gapGroupId: string;
    gapGroupTitle: string;
    targetObjectiveStandard: string | undefined;
    priority: string;
    studentCount: number | null;
    studentPercent: number | null;
    occurrence: string;
    misconceptionSummary: string;
    successIndicators: string[];
    ccssStandards: ICCSSStandards | undefined;
    gaps: string[];
    moveId: string;
    moveTitle: string;
    moveTime: string;
    moveFormat: string;
    moveSummary: string;
    aiReasoning: string;
    evidence: IMisconceptionEvidence | null;
    move: {
        id: string;
        title: string;
        time: string;
        format: string;
        summary: string;
        aiReasoning: string;
        tabs: ITabs | null;
    };
}
/**
 * The shape of a SavedNextStep as returned from the GraphQL API / DynamoDB.
 * Timestamps are ISO strings, evidence and tabs are AWSJSON (string or already-parsed object).
 */
export interface IDBSavedNextStep {
    id: string;
    classroomId: string;
    sessionId: string | null;
    activityId: string | null;
    status: string;
    createdAt: string;
    completedAt: string | null;
    sortOrder: number | null;
    misconceptionId: string;
    misconceptionTitle: string;
    targetObjectiveStandard: string | null;
    priority: string;
    studentCount: number | null;
    studentPercent: number | null;
    occurrence: string | null;
    misconceptionSummary: string | null;
    successIndicators: string[];
    activityTitle: string;
    activityTime: string;
    activityFormat: string;
    activitySummary: string;
    aiReasoning: string | null;
    evidence: unknown;
    tabs: unknown;
}
/**
 * The input shape for createSavedNextStep / updateSavedNextStep mutations.
 * evidence and tabs must be JSON strings (AWSJSON scalars).
 */
export interface ISavedNextStepMutationInput {
    id: string;
    classroomId: string;
    status: string;
    misconceptionId: string;
    misconceptionTitle: string;
    targetObjectiveStandard: string | undefined;
    priority: string;
    studentCount: number | null;
    studentPercent: number | null;
    occurrence: string;
    misconceptionSummary: string;
    successIndicators: string[];
    activityId: string;
    activityTitle: string;
    activityTime: string;
    activityFormat: string;
    activitySummary: string;
    aiReasoning: string;
    evidence: string | null;
    tabs: string | null;
}
export declare class SavedNextStepParser {
    /**
     * Convert a raw DB/API record to the local UI shape.
     * Throws if required fields (id) are missing.
     */
    static dbToLocal(db: IDBSavedNextStep): ILocalSavedNextStep;
    static mapDbToLocal(items: IDBSavedNextStep[]): ILocalSavedNextStep[];
    /**
     * Build the mutation input from a local item + a gap group move.
     * Serializes evidence and tabs to JSON strings for AWSJSON fields.
     */
    static toMutationInput(classroomId: string, local: ILocalSavedNextStep): ISavedNextStepMutationInput;
}
