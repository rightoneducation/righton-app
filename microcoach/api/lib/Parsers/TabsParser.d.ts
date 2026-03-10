/**
 * The schema defines Overview.whatStudentsDo / whatYouDo as String, but at
 * runtime the LLM outputs arrays of {label, detail} bullet objects.
 * Both shapes are represented here; consumers should handle either.
 */
export interface IOverviewBullet {
    label: string;
    detail: string;
}
export interface IOverview {
    whatStudentsDo: string | IOverviewBullet[];
    whatYouDo: string | IOverviewBullet[];
    importance: string;
}
export interface IActivitySteps {
    setup: string[];
    problem: string;
    coreActivity: string[];
    discussionQuestions: string[];
    incorrectWorkedExamples: string[];
}
export interface IMaterials {
    required: string[];
    optional: string[];
}
export interface IStudentGroup {
    name: string;
    description: string;
    students: string[];
}
export interface IHighFlyers {
    students: string[];
    description: string;
}
export interface IStudentGroupings {
    groups: IStudentGroup[];
    highFlyers: IHighFlyers | null;
    aiRecommendation: string;
}
export interface ITabs {
    overview: IOverview | null;
    activitySteps: IActivitySteps | null;
    materials: IMaterials | null;
    studentGroupings: IStudentGroupings | null;
}
export declare class TabsParser {
    /**
     * Parse a raw tabs value (object or JSON string) from pregeneratedNextSteps
     * or a DB AWSJSON field. Returns null if input is null/undefined.
     */
    static fromRaw(raw: unknown): ITabs | null;
    private static parseOverview;
    /**
     * whatStudentsDo / whatYouDo may be a plain String or an array of
     * {label, detail} objects depending on which LLM output path created them.
     */
    private static parseBulletField;
    private static parseActivitySteps;
    private static parseMaterials;
    private static parseStudentGroupings;
    private static parseStudentGroups;
    private static parseHighFlyers;
    private static parseStringArray;
    /**
     * Serialize a tabs object to a JSON string for an AWSJSON field.
     * Ensures no undefined values slip through.
     */
    static toAwsJson(tabs: ITabs | null | undefined): string | null;
}
