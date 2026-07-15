"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisconceptionEvidenceParser = void 0;
const global_1 = require("./global");
// ── Parser ────────────────────────────────────────────────────────────────────
class MisconceptionEvidenceParser {
    /**
     * Parse a raw evidence object (from pregeneratedNextSteps JSON or a DB record).
     * All fields are optional — returns null if input is null/undefined.
     */
    static fromRaw(raw) {
        if ((0, global_1.isNullOrUndefined)(raw))
            return null;
        let obj;
        if (typeof raw === 'string') {
            try {
                obj = JSON.parse(raw);
            }
            catch {
                return null;
            }
        }
        else if (typeof raw === 'object' && !Array.isArray(raw)) {
            obj = raw;
        }
        else {
            return null;
        }
        const sampleStudentWork = Array.isArray(obj.sampleStudentWork)
            ? obj.sampleStudentWork
                .filter((s) => typeof s === 'string')
                .map((s) => s)
            : [];
        return {
            source: typeof obj.source === 'string' ? obj.source : '',
            mostCommonError: typeof obj.mostCommonError === 'string' ? obj.mostCommonError : '',
            sampleStudentWork,
            aiThinkingPattern: typeof obj.aiThinkingPattern === 'string' ? obj.aiThinkingPattern : '',
        };
    }
    /**
     * Serialize evidence to a JSON string suitable for an AWSJSON field.
     * Returns null if input is null/undefined.
     */
    static toAwsJson(evidence) {
        var _a, _b, _c, _d;
        if ((0, global_1.isNullOrUndefined)(evidence))
            return null;
        return JSON.stringify({
            source: (_a = evidence.source) !== null && _a !== void 0 ? _a : '',
            mostCommonError: (_b = evidence.mostCommonError) !== null && _b !== void 0 ? _b : '',
            sampleStudentWork: (_c = evidence.sampleStudentWork) !== null && _c !== void 0 ? _c : [],
            aiThinkingPattern: (_d = evidence.aiThinkingPattern) !== null && _d !== void 0 ? _d : '',
        });
    }
    static mapFromRawArray(items) {
        if (!Array.isArray(items))
            return [];
        return items.map((item) => this.fromRaw(item));
    }
}
exports.MisconceptionEvidenceParser = MisconceptionEvidenceParser;
