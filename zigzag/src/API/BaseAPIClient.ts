import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6, UnknownGraphQLResponse, GraphqlSubscriptionResult } from '@aws-amplify/api-graphql';

export enum HTTPMethod {
  Post = "POST",
}

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GraphQLAuthMode;
}

export const client = generateClient({});

export abstract class BaseAPIClient {
  protected async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    // will add authMode in here when setting up auth
    const response = client.graphql({query: query, variables: options}) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }
}