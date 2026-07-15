export interface IMisconceptionEvidence {
    source: string;
    mostCommonError: string;
    sampleStudentWork: string[];
    aiThinkingPattern: string;
}
export declare class MisconceptionEvidenceParser {
    /**
     * Parse a raw evidence object (from pregeneratedNextSteps JSON or a DB record).
     * All fields are optional — returns null if input is null/undefined.
     */
    static fromRaw(raw: unknown): IMisconceptionEvidence | null;
    /**
     * Serialize evidence to a JSON string suitable for an AWSJSON field.
     * Returns null if input is null/undefined.
     */
    static toAwsJson(evidence: IMisconceptionEvidence | null | undefined): string | null;
    static mapFromRawArray(items: unknown[]): Array<IMisconceptionEvidence | null>;
}
