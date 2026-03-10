"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedNextStepParser = void 0;
const global_1 = require("./global");
const MisconceptionEvidenceParser_1 = require("./MisconceptionEvidenceParser");
const TabsParser_1 = require("./TabsParser");
// ── Parser ────────────────────────────────────────────────────────────────────
class SavedNextStepParser {
    /**
     * Convert a raw DB/API record to the local UI shape.
     * Throws if required fields (id) are missing.
     */
    static dbToLocal(db) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        if ((0, global_1.isNullOrUndefined)(db)) {
            throw new Error('SavedNextStepParser.dbToLocal: input cannot be null');
        }
        if ((0, global_1.isNullOrUndefined)(db.id)) {
            throw new Error("SavedNextStep has null field for 'id' which is required");
        }
        const evidence = MisconceptionEvidenceParser_1.MisconceptionEvidenceParser.fromRaw(db.evidence);
        const tabs = TabsParser_1.TabsParser.fromRaw(db.tabs);
        const ccssStandards = db.targetObjectiveStandard
            ? {
                targetObjective: { standard: db.targetObjectiveStandard, description: '' },
                prerequisiteGaps: [],
                impactedObjectives: [],
            }
            : undefined;
        return {
            id: db.id,
            createdAt: db.createdAt ? new Date(db.createdAt).getTime() : Date.now(),
            completedAt: db.completedAt ? new Date(db.completedAt).getTime() : undefined,
            status: (db.status === 'completed' ? 'completed' : 'planned'),
            gapGroupId: (_a = db.misconceptionId) !== null && _a !== void 0 ? _a : '',
            gapGroupTitle: (_b = db.misconceptionTitle) !== null && _b !== void 0 ? _b : '',
            targetObjectiveStandard: (_c = db.targetObjectiveStandard) !== null && _c !== void 0 ? _c : undefined,
            priority: (_d = db.priority) !== null && _d !== void 0 ? _d : 'Low',
            studentCount: (_e = db.studentCount) !== null && _e !== void 0 ? _e : null,
            studentPercent: (_f = db.studentPercent) !== null && _f !== void 0 ? _f : null,
            occurrence: (_g = db.occurrence) !== null && _g !== void 0 ? _g : '',
            misconceptionSummary: (_h = db.misconceptionSummary) !== null && _h !== void 0 ? _h : '',
            successIndicators: Array.isArray(db.successIndicators) ? db.successIndicators : [],
            ccssStandards,
            gaps: db.targetObjectiveStandard ? [db.targetObjectiveStandard] : [],
            moveId: (_j = db.activityId) !== null && _j !== void 0 ? _j : '',
            moveTitle: (_k = db.activityTitle) !== null && _k !== void 0 ? _k : '',
            moveTime: (_l = db.activityTime) !== null && _l !== void 0 ? _l : '',
            moveFormat: (_m = db.activityFormat) !== null && _m !== void 0 ? _m : '',
            moveSummary: (_o = db.activitySummary) !== null && _o !== void 0 ? _o : '',
            aiReasoning: (_p = db.aiReasoning) !== null && _p !== void 0 ? _p : '',
            evidence,
            move: {
                id: (_q = db.activityId) !== null && _q !== void 0 ? _q : '',
                title: (_r = db.activityTitle) !== null && _r !== void 0 ? _r : '',
                time: (_s = db.activityTime) !== null && _s !== void 0 ? _s : '',
                format: (_t = db.activityFormat) !== null && _t !== void 0 ? _t : '',
                summary: (_u = db.activitySummary) !== null && _u !== void 0 ? _u : '',
                aiReasoning: (_v = db.aiReasoning) !== null && _v !== void 0 ? _v : '',
                tabs,
            },
        };
    }
    static mapDbToLocal(items) {
        if (!Array.isArray(items))
            return [];
        return items
            .map((item, i) => {
            try {
                return this.dbToLocal(item);
            }
            catch (err) {
                console.warn(`SavedNextStepParser: skipping item[${i}] — ${err}`);
                return null;
            }
        })
            .filter((x) => x !== null);
    }
    /**
     * Build the mutation input from a local item + a gap group move.
     * Serializes evidence and tabs to JSON strings for AWSJSON fields.
     */
    static toMutationInput(classroomId, local) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            id: local.id,
            classroomId,
            status: local.status,
            misconceptionId: local.gapGroupId,
            misconceptionTitle: local.gapGroupTitle,
            targetObjectiveStandard: local.targetObjectiveStandard,
            priority: (_a = local.priority) !== null && _a !== void 0 ? _a : 'Low',
            studentCount: (_b = local.studentCount) !== null && _b !== void 0 ? _b : null,
            studentPercent: (_c = local.studentPercent) !== null && _c !== void 0 ? _c : null,
            occurrence: (_d = local.occurrence) !== null && _d !== void 0 ? _d : '',
            misconceptionSummary: (_e = local.misconceptionSummary) !== null && _e !== void 0 ? _e : '',
            successIndicators: (_f = local.successIndicators) !== null && _f !== void 0 ? _f : [],
            activityId: local.moveId,
            activityTitle: local.moveTitle,
            activityTime: local.moveTime,
            activityFormat: local.moveFormat,
            activitySummary: local.moveSummary,
            aiReasoning: (_g = local.aiReasoning) !== null && _g !== void 0 ? _g : '',
            evidence: MisconceptionEvidenceParser_1.MisconceptionEvidenceParser.toAwsJson(local.evidence),
            tabs: TabsParser_1.TabsParser.toAwsJson((_j = (_h = local.move) === null || _h === void 0 ? void 0 : _h.tabs) !== null && _j !== void 0 ? _j : null),
        };
    }
}
exports.SavedNextStepParser = SavedNextStepParser;
