"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GapGroupParser = void 0;
const global_1 = require("./global");
const MisconceptionEvidenceParser_1 = require("./MisconceptionEvidenceParser");
const TabsParser_1 = require("./TabsParser");
// ── Parser ────────────────────────────────────────────────────────────────────
class GapGroupParser {
    /**
     * Parse one gap group entry from a pregeneratedNextSteps array element.
     * Throws if the required `id` or `title` fields are missing.
     */
    static fromRaw(raw) {
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw)) {
            throw new Error('GapGroupParser.fromRaw: input must be a non-null object');
        }
        const obj = raw;
        if ((0, global_1.isNullOrUndefined)(obj.id)) {
            throw new Error("GapGroup has null field for 'id' which is required");
        }
        const id = obj.id;
        const title = typeof obj.title === 'string' ? obj.title : '';
        return {
            id,
            title,
            frequency: typeof obj.frequency === 'string' ? obj.frequency : null,
            isCore: typeof obj.isCore === 'boolean' ? obj.isCore : false,
            occurrence: typeof obj.occurrence === 'string' ? obj.occurrence : '',
            example: typeof obj.example === 'string' ? obj.example : null,
            misconceptionSummary: typeof obj.misconceptionSummary === 'string' ? obj.misconceptionSummary : '',
            aiReasoning: typeof obj.aiReasoning === 'string' ? obj.aiReasoning : null,
            successIndicators: this.parseStringArray(obj.successIndicators),
            ccssStandards: this.parseCCSSStandards(obj.ccssStandards),
            evidence: MisconceptionEvidenceParser_1.MisconceptionEvidenceParser.fromRaw(obj.evidence),
            questionErrorRates: this.parseQuestionErrorRates(obj.questionErrorRates),
            ppqQuestions: Array.isArray(obj.ppqQuestions) ? obj.ppqQuestions : [],
            studentGroups: this.parseStudentGroups(obj.studentGroups),
            wrongAnswerExplanations: this.parseWrongAnswerExplanations(obj.wrongAnswerExplanations),
            correctAnswerSolution: this.parseStringArray(obj.correctAnswerSolution),
            priority: typeof obj.priority === 'string' ? obj.priority : 'Low',
            studentCount: typeof obj.studentCount === 'number' ? obj.studentCount : null,
            studentPercent: typeof obj.studentPercent === 'number' ? obj.studentPercent : null,
            moveOptions: this.parseMoveOptions(obj.moveOptions, obj.move),
        };
    }
    /**
     * Parse a pregeneratedNextSteps JSON string or array.
     * Returns an empty array if parsing fails.
     */
    static fromPregeneratedJson(raw) {
        let arr;
        if (typeof raw === 'string') {
            try {
                arr = JSON.parse(raw);
            }
            catch {
                return [];
            }
        }
        else if (Array.isArray(raw)) {
            arr = raw;
        }
        else {
            return [];
        }
        return arr
            .map((item, i) => {
            try {
                return this.fromRaw(item);
            }
            catch (err) {
                console.warn(`GapGroupParser: skipping item[${i}] — ${err}`);
                return null;
            }
        })
            .filter((g) => g !== null);
    }
    // ── Private helpers ─────────────────────────────────────────────────────────
    static parseCCSSStandards(raw) {
        const empty = {
            targetObjective: { standard: '', description: '' },
            prerequisiteGaps: [],
            impactedObjectives: [],
        };
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return empty;
        const obj = raw;
        const parseStandard = (s) => {
            if ((0, global_1.isNullOrUndefined)(s) || typeof s !== 'object' || Array.isArray(s)) {
                return { standard: '', description: '' };
            }
            const o = s;
            return {
                standard: typeof o.standard === 'string' ? o.standard : '',
                description: typeof o.description === 'string' ? o.description : '',
            };
        };
        const parseStandardArray = (a) => Array.isArray(a) ? a.map(parseStandard) : [];
        return {
            targetObjective: parseStandard(obj.targetObjective),
            prerequisiteGaps: parseStandardArray(obj.prerequisiteGaps),
            impactedObjectives: parseStandardArray(obj.impactedObjectives),
        };
    }
    static parseQuestionErrorRates(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
            const o = item;
            return {
                label: typeof o.label === 'string' ? o.label : '',
                errorRate: typeof o.errorRate === 'number' ? o.errorRate : 0,
            };
        });
    }
    static parseStudentGroups(raw) {
        const empty = { buildingUnderstanding: [], understoodConcept: [] };
        if ((0, global_1.isNullOrUndefined)(raw) || typeof raw !== 'object' || Array.isArray(raw))
            return empty;
        const obj = raw;
        return {
            buildingUnderstanding: this.parseStringArray(obj.buildingUnderstanding),
            understoodConcept: this.parseStringArray(obj.understoodConcept),
        };
    }
    static parseWrongAnswerExplanations(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
            const o = item;
            return {
                answer: typeof o.answer === 'string' ? o.answer : '',
                explanation: typeof o.explanation === 'string' ? o.explanation : '',
            };
        });
    }
    /**
     * moveOptions is the primary field; legacy data may use a single `move` field.
     */
    static parseMoveOptions(moveOptionsRaw, moveFallbackRaw) {
        const source = Array.isArray(moveOptionsRaw) && moveOptionsRaw.length > 0
            ? moveOptionsRaw
            : (!(0, global_1.isNullOrUndefined)(moveFallbackRaw) ? [moveFallbackRaw] : []);
        return source
            .filter((item) => item && typeof item === 'object')
            .map((item) => this.parseActivityMove(item));
    }
    static parseActivityMove(obj) {
        return {
            id: typeof obj.id === 'string' ? obj.id : '',
            title: typeof obj.title === 'string' ? obj.title : '',
            time: typeof obj.time === 'string' ? obj.time : '',
            format: typeof obj.format === 'string' ? obj.format : '',
            summary: typeof obj.summary === 'string' ? obj.summary : '',
            targets: typeof obj.targets === 'string' ? obj.targets : null,
            instructionalMove: typeof obj.instructionalMove === 'string' ? obj.instructionalMove : null,
            strategyTag: typeof obj.strategyTag === 'string' ? obj.strategyTag : null,
            aiReasoning: typeof obj.aiReasoning === 'string' ? obj.aiReasoning : '',
            tabs: TabsParser_1.TabsParser.fromRaw(obj.tabs),
        };
    }
    static parseStringArray(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw.filter((s) => typeof s === 'string');
    }
}
exports.GapGroupParser = GapGroupParser;
