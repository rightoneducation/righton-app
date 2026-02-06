"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const aws_amplify_1 = require("aws-amplify");
const api_1 = require("@aws-amplify/api");
// @ts-ignore - generated JS without type declarations
const queries_1 = require("./graphql/queries");
// @ts-ignore - generated JS without type declarations
const mutations_1 = require("./graphql/mutations");
// @ts-ignore - Amplify aws-exports generated at build time
const aws_exports_1 = __importDefault(require("./aws-exports"));
class APIClient {
    constructor() {
        this.configAmplify(aws_exports_1.default);
        this.client = (0, api_1.generateClient)({});
    }
    async callGraphQL(query, options) {
        const authMode = "iam";
        const response = this.client.graphql({ query: query, variables: options, authMode: authMode });
        return response;
    }
    configAmplify(awsconfig) {
        aws_amplify_1.Amplify.configure(awsconfig);
    }
    async getClassroom(className) {
        var _a;
        const classroom = await this.callGraphQL(queries_1.getClassroom, {
            input: {
                className: className
            }
        });
        return (_a = classroom.data) === null || _a === void 0 ? void 0 : _a.getClassroom;
    }
    async getLearningScienceDataByCCSS(ccss) {
        var _a;
        const learningScienceData = await this.callGraphQL(mutations_1.getLearningScience, {
            input: {
                ccss: ccss
            }
        });
        return (_a = learningScienceData.data) === null || _a === void 0 ? void 0 : _a.getLearningScience;
    }
}
exports.APIClient = APIClient;
