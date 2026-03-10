import { IMisconceptionEvidence } from './MisconceptionEvidenceParser';
import { ITabs } from './TabsParser';
export interface ICCSSStandard {
    standard: string;
    description: string;
}
export interface ICCSSStandards {
    targetObjective: ICCSSStandard;
    prerequisiteGaps: ICCSSStandard[];
    impactedObjectives: ICCSSStandard[];
}
export interface IQuestionErrorRate {
    label: string;
    errorRate: number;
}
export interface IStudentGroups {
    buildingUnderstanding: string[];
    understoodConcept: string[];
}
export interface IWrongAnswerExplanation {
    answer: string;
    explanation: string;
}
export interface IActivityMove {
    id: string;
    title: string;
    time: string;
    format: string;
    summary: string;
    targets: string | null;
    instructionalMove: string | null;
    strategyTag: string | null;
    aiReasoning: string;
    tabs: ITabs | null;
}
/**
 * A gap group entry from pregeneratedNextSteps — the precomputed shape
 * written by generate-next-steps.ts and stored on Session.pregeneratedNextSteps.
 */
export interface IGapGroup {
    id: string;
    title: string;
    frequency: string | null;
    isCore: boolean;
    occurrence: string;
    example: string | null;
    misconceptionSummary: string;
    aiReasoning: string | null;
    successIndicators: string[];
    ccssStandards: ICCSSStandards;
    evidence: IMisconceptionEvidence | null;
    questionErrorRates: IQuestionErrorRate[];
    ppqQuestions: unknown[];
    studentGroups: IStudentGroups;
    wrongAnswerExplanations: IWrongAnswerExplanation[];
    correctAnswerSolution: string[];
    priority: string;
    studentCount: number | null;
    studentPercent: number | null;
    moveOptions: IActivityMove[];
}
export declare class GapGroupParser {
    /**
     * Parse one gap group entry from a pregeneratedNextSteps array element.
     * Throws if the required `id` or `title` fields are missing.
     */
    static fromRaw(raw: unknown): IGapGroup;
    /**
     * Parse a pregeneratedNextSteps JSON string or array.
     * Returns an empty array if parsing fails.
     */
    static fromPregeneratedJson(raw: unknown): IGapGroup[];
    private static parseCCSSStandards;
    private static parseQuestionErrorRates;
    private static parseStudentGroups;
    private static parseWrongAnswerExplanations;
    /**
     * moveOptions is the primary field; legacy data may use a single `move` field.
     */
    private static parseMoveOptions;
    private static parseActivityMove;
    private static parseStringArray;
}
