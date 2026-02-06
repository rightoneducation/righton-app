import { GraphQLResult } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
export interface GraphQLOptions {
    input?: object;
    variables?: object;
    authMode?: GraphQLAuthMode;
}
export declare class APIClient {
    private client;
    constructor();
    protected callGraphQL<T>(query: any, options?: GraphQLOptions): Promise<GraphQLResult<T>>;
    configAmplify(awsconfig: any): void;
    getClassroom(className: string): Promise<any>;
    getLearningScienceDataByCCSS(ccss: string): Promise<any>;
}
