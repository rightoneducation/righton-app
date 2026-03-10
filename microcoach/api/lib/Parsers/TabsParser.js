"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsParser = void 0;
const global_1 = require("./global");
// ── Parser ────────────────────────────────────────────────────────────────────
class TabsParser {
    /**
     * Parse a raw tabs value (object or JSON string) from pregeneratedNextSteps
     * or a DB AWSJSON field. Returns null if input is null/undefined.
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
        return {
            overview: this.parseOverview(obj.overview),
            activitySteps: this.parseActivitySteps(obj.activitySteps),
            materials: this.parseMaterials(obj.materials),
            studentGroupings: this.parseStudentGroupings(obj.studentGroupings),
        };
    }
    static parseOverview(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return null;
        const obj = raw;
        return {
            whatStudentsDo: this.parseBulletField(obj.whatStudentsDo),
            whatYouDo: this.parseBulletField(obj.whatYouDo),
            importance: typeof obj.importance === 'string' ? obj.importance : '',
        };
    }
    /**
     * whatStudentsDo / whatYouDo may be a plain String or an array of
     * {label, detail} objects depending on which LLM output path created them.
     */
    static parseBulletField(raw) {
        if (typeof raw === 'string')
            return raw;
        if (Array.isArray(raw)) {
            return raw
                .filter((item) => item && typeof item === 'object')
                .map((item) => {
                const o = item;
                return {
                    label: typeof o.label === 'string' ? o.label : '',
                    detail: typeof o.detail === 'string' ? o.detail : '',
                };
            });
        }
        return '';
    }
    static parseActivitySteps(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return null;
        const obj = raw;
        return {
            setup: this.parseStringArray(obj.setup),
            problem: typeof obj.problem === 'string' ? obj.problem : '',
            coreActivity: this.parseStringArray(obj.coreActivity),
            discussionQuestions: this.parseStringArray(obj.discussionQuestions),
            incorrectWorkedExamples: this.parseStringArray(obj.incorrectWorkedExamples),
        };
    }
    static parseMaterials(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return null;
        const obj = raw;
        return {
            required: this.parseStringArray(obj.required),
            optional: this.parseStringArray(obj.optional),
        };
    }
    static parseStudentGroupings(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return null;
        const obj = raw;
        return {
            groups: this.parseStudentGroups(obj.groups),
            highFlyers: this.parseHighFlyers(obj.highFlyers),
            aiRecommendation: typeof obj.aiRecommendation === 'string' ? obj.aiRecommendation : '',
        };
    }
    static parseStudentGroups(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
            const o = item;
            return {
                name: typeof o.name === 'string' ? o.name : '',
                description: typeof o.description === 'string' ? o.description : '',
                students: this.parseStringArray(o.students),
            };
        });
    }
    static parseHighFlyers(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return null;
        const obj = raw;
        return {
            students: this.parseStringArray(obj.students),
            description: typeof obj.description === 'string' ? obj.description : '',
        };
    }
    static parseStringArray(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw.filter((s) => typeof s === 'string');
    }
    /**
     * Serialize a tabs object to a JSON string for an AWSJSON field.
     * Ensures no undefined values slip through.
     */
    static toAwsJson(tabs) {
        if ((0, global_1.isNullOrUndefined)(tabs))
            return null;
        return JSON.stringify(tabs, (_, v) => (v === undefined ? null : v));
    }
}
exports.TabsParser = TabsParser;
