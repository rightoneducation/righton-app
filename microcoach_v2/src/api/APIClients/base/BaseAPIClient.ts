import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6, UnknownGraphQLResponse, GraphqlSubscriptionResult } from '@aws-amplify/api-graphql';
import { isNullOrUndefined } from "../../util/util";
import { Environment } from "../interfaces/IAPIClients";
import { IAuthAPIClient } from "../auth/interfaces/IAuthAPIClient";

export enum HTTPMethod {
  Post = "POST",
}

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GraphQLAuthMode;
}

export interface SubscriptionValue<T> {
  value: {
    data: T;
    errors: Array<any> | null;
  };
}

export const client = generateClient({});

export interface IQueryParameters { 
  limit?: number | null;
  nextToken: string | null;
  sortDirection?: string | null;
  [key: string]: any; // This line allows for additional properties like 'filter'
}

export abstract class BaseAPIClient {
  protected env: Environment;
  protected auth: IAuthAPIClient;

  constructor(env: Environment, auth: IAuthAPIClient) {
    this.env = env;
    this.auth = auth;
  }

  protected async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    const authMode = await this.auth.verifyAuth() ? "userPool" : "iam";
    const response = client.graphql({query: query, variables: options, authMode: authMode as GraphQLAuthMode}) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }

  protected isSubscription<T>(result: UnknownGraphQLResponse): result is GraphqlSubscriptionResult<T> {
    return (result as GraphqlSubscriptionResult<T>).subscribe !== undefined;
  }

  protected async mutateGraphQL<T>(
    mutation: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    const authMode = await this.auth.verifyAuth() ? "userPool" : "iam";
    const response = client.graphql({query: mutation, variables: options, authMode: authMode as GraphQLAuthMode}) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }

  protected async subscribeGraphQL<T>(
    subscription: any,
    callback: (value: T) => void
  ) {
    //@ts-ignore
    const authMode = await this.auth.verifyAuth() ? "userPool" : "iam";
    const result = client.graphql({
      query: subscription.query,
      variables: subscription.variables,
      authMode: authMode as GraphQLAuthMode
    });
    
    if (this.isSubscription<T>(result)) {
      return result.subscribe({
        next: ({data}) => callback(data),
        error: (error: any) => console.error(error),
      });
    } else {
      throw new Error("Expected a GraphQL subscription but got a different operation type.");
    }
  }

  protected async callGraphQLThrowOnError<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<T> {
    let result = await this.callGraphQL<T>(query, options);
    if (result.errors != null) {
      throw new Error(`${typeof query}: ${result.errors} ${result.extensions}`);
    }
    if (isNullOrUndefined(result.data)) {
      throw new Error(`${typeof query}: Failed to get data`);
    }
    return result.data;
  }
  protected async executeQuery(){}
}
export {Environment};