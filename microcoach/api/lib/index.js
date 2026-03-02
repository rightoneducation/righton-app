"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const aws_amplify_1 = require("aws-amplify");
const api_1 = require("@aws-amplify/api");
const queries_1 = require("./graphql/queries");
const mutations_1 = require("./graphql/mutations");
const aws_exports_1 = __importDefault(require("./aws-exports"));
class APIClient {
    constructor() {
        this.configAmplify(aws_exports_1.default);
        this.client = (0, api_1.generateClient)({});
    }
    async callGraphQL(query, variables) {
        const response = this.client.graphql({ query, variables });
        return response;
    }
    configAmplify(awsconfig) {
        aws_amplify_1.Amplify.configure(awsconfig);
    }
    // ── Classroom ──────────────────────────────────────────────────────────────
    async listClassrooms() {
        var _a, _b, _c;
        const result = await this.callGraphQL(queries_1.listClassrooms);
        return (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.listClassrooms) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    }
    async getClassroom(classId) {
        var _a;
        const classroom = await this.callGraphQL(queries_1.getClassroom, { id: classId });
        return (_a = classroom.data) === null || _a === void 0 ? void 0 : _a.getClassroom;
    }
    // ── Session ────────────────────────────────────────────────────────────────
    async listSessions(classroomId) {
        var _a, _b, _c;
        const result = await this.callGraphQL(queries_1.sessionsByClassroomId, { classroomId });
        return (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.sessionsByClassroomId) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    }
    async getSession(sessionId) {
        var _a, _b;
        const result = await this.callGraphQL(queries_1.getSession, { id: sessionId });
        return (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.getSession) !== null && _b !== void 0 ? _b : null;
    }
    // ── Misconception ──────────────────────────────────────────────────────────
    async createMisconception(sessionId, item) {
        var _a;
        const result = await this.callGraphQL(mutations_1.createMisconception, {
            input: { ...item, sessionId },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.createMisconception;
    }
    async updateMisconception(id, updates) {
        var _a;
        const result = await this.callGraphQL(mutations_1.updateMisconception, {
            input: { id, ...updates },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.updateMisconception;
    }
    // ── Activity ───────────────────────────────────────────────────────────────
    async listActivities(misconceptionId) {
        var _a, _b, _c;
        const result = await this.callGraphQL(queries_1.activitiesByMisconceptionId, { misconceptionId });
        return (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.activitiesByMisconceptionId) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    }
    async createActivity(misconceptionId, item) {
        var _a;
        const result = await this.callGraphQL(mutations_1.createActivity, {
            input: {
                ...item,
                misconceptionId,
                misconceptionActivitiesId: misconceptionId,
            },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.createActivity;
    }
    async updateActivity(id, updates) {
        var _a;
        const result = await this.callGraphQL(mutations_1.updateActivity, {
            input: { id, ...updates },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.updateActivity;
    }
    // ── Learning Science / Analytics ───────────────────────────────────────────
    async getLearningScienceDataByCCSS(ccss) {
        var _a;
        const learningScienceData = await this.callGraphQL(mutations_1.getLearningScience, {
            input: { ccss },
        });
        return (_a = learningScienceData.data) === null || _a === void 0 ? void 0 : _a.getLearningScience;
    }
    async getAnalysis(classroomData, learningScienceData) {
        var _a;
        const result = await this.callGraphQL(mutations_1.getAnalysis, {
            input: {
                classroomData: typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData),
                learningScienceData: typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData),
            },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.getAnalysis;
    }
    async listNextStepExamples() {
        var _a, _b, _c;
        const result = await this.callGraphQL(queries_1.listContextData, {
            filter: { type: { eq: 'NEXT_STEP_LESSON' } },
            limit: 20,
        });
        return (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.listContextData) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    }
    async generateNextStep(misconception, learningScienceData, classroomContext, contextData) {
        var _a;
        const result = await this.callGraphQL(mutations_1.generateNextStep, {
            input: {
                misconception: typeof misconception === 'string' ? misconception : JSON.stringify(misconception),
                learningScienceData: typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData),
                ...(classroomContext != null && {
                    classroomContext: typeof classroomContext === 'string' ? classroomContext : JSON.stringify(classroomContext),
                }),
                ...(contextData != null && contextData.length > 0 && {
                    contextData: JSON.stringify(contextData),
                }),
            },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.generateNextStep;
    }
    async getAnalytics(classroomData, learningScienceData) {
        var _a;
        const analytics = await this.callGraphQL(mutations_1.getAnalytics, {
            input: {
                classroomData: typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData),
                learningScienceData: typeof learningScienceData === 'string'
                    ? learningScienceData
                    : JSON.stringify(learningScienceData),
            },
        });
        return (_a = analytics.data) === null || _a === void 0 ? void 0 : _a.getAnalytics;
    }
    async updateClassroom(classroomData, analytics) {
        var _a;
        const input = {
            id: classroomData.id,
            analytics,
        };
        if (classroomData.userName != null)
            input.userName = classroomData.userName;
        const classroom = await this.callGraphQL(mutations_1.updateClassroom, { input });
        return (_a = classroom.data) === null || _a === void 0 ? void 0 : _a.updateClassroom;
    }
    // ── SavedNextStep ──────────────────────────────────────────────────────────
    async createSavedNextStep(classroomId, item) {
        var _a;
        const result = await this.callGraphQL(mutations_1.createSavedNextStep, {
            input: { ...item, classroomId },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.createSavedNextStep;
    }
    async updateSavedNextStep(id, updates) {
        var _a;
        const result = await this.callGraphQL(mutations_1.updateSavedNextStep, {
            input: { id, ...updates },
        });
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.updateSavedNextStep;
    }
    async deleteSavedNextStep(id) {
        await this.callGraphQL(mutations_1.deleteSavedNextStep, { input: { id } });
    }
    async listSavedNextSteps(classroomId) {
        var _a, _b, _c;
        const result = await this.callGraphQL(queries_1.savedNextStepsByClassroomId, { classroomId });
        return (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.savedNextStepsByClassroomId) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    }
}
exports.APIClient = APIClient;
