import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import awsconfig from "../aws-exports";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { isNullOrUndefined } from "../IApiClient";
import { Environment } from "./interfaces/IBaseAPIClient";

Amplify.configure(awsconfig);

export enum HTTPMethod {
  Post = "POST",
}

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GRAPHQL_AUTH_MODE;
}

export interface SubscriptionValue<T> {
  value: {
    data: T;
    errors: Array<any> | null;
  };
}

export abstract class BaseAPIClient {
  protected endpoint: string;
  protected env: Environment;

  constructor(env: Environment) {
    this.env = env;
    switch (env) {
      case Environment.Testing:
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
        break;
      case Environment.Developing:
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
        break;
      case Environment.Staging:
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
        break;
    }
  }

  protected async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    return API.graphql(graphqlOperation(query, options)) as GraphQLResult<T>;
  }

  protected subscribeGraphQL<T>(
    subscription: any,
    callback: (value: T) => void
  ) {
    //@ts-ignore
    return API.graphql(subscription).subscribe({
      next: (response: SubscriptionValue<T>) => {
        if (!isNullOrUndefined(response.value.errors)) {
          console.error(response.value.errors);
        }
        callback(response.value.data);
      },
      error: (error: any) => console.error(error),
    });
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
}
export { Environment };