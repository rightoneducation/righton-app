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
export type GqlFn = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export declare function createGqlClient(): Promise<GqlFn>;
