"use strict";
/**
 * appsync-config.ts — loads AppSync endpoint + API key from AWS Secrets Manager
 * and returns a ready-to-use GraphQL client function.
 *
 * Mirrors the loadSecret pattern used by the Lambda functions.
 *
 * Required env var:
 *   APPSYNC_SECRET_NAME — name of a Secrets Manager secret containing:
 *     { "endpoint": "https://....appsync-api.us-east-1.amazonaws.com/graphql",
 *       "apiKey":   "da2-..." }
 *
 * Optional env var:
 *   AWS_REGION — defaults to "us-east-1"
 *
 * Usage:
 *   const gql = await createGqlClient();
 *   const data = await gql(SOME_QUERY, { id: '...' });
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGqlClient = createGqlClient;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const https = __importStar(require("https"));
async function loadAppSyncConfig() {
    var _a;
    const secretName = process.env.APPSYNC_SECRET_NAME;
    if (!secretName) {
        throw new Error('APPSYNC_SECRET_NAME environment variable is not set.\n' +
            'Create an AWS Secrets Manager secret containing:\n' +
            '  { "endpoint": "<appsync-url>", "apiKey": "<api-key>" }\n' +
            'then export APPSYNC_SECRET_NAME=<secret-name> before running this script.');
    }
    const client = new client_secrets_manager_1.SecretsManagerClient({ region: (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : 'us-east-1' });
    const data = await client.send(new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretName }));
    if (!data.SecretString)
        throw new Error(`Secret "${secretName}" has no SecretString`);
    const secret = JSON.parse(data.SecretString);
    const { endpoint, apiKey } = secret;
    if (!endpoint || !apiKey) {
        throw new Error(`Secret "${secretName}" must contain "endpoint" and "apiKey" fields`);
    }
    return { endpoint, apiKey };
}
async function createGqlClient() {
    const { endpoint, apiKey } = await loadAppSyncConfig();
    const urlParts = new URL(endpoint);
    return function gql(query, variables = {}) {
        const body = JSON.stringify({ query, variables });
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: urlParts.hostname,
                path: urlParts.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'Content-Length': Buffer.byteLength(body),
                },
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    const json = JSON.parse(data);
                    if (json.errors) {
                        reject(new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`));
                    }
                    else {
                        resolve(json.data);
                    }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    };
}
