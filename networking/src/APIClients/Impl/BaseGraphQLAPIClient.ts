import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { isNullOrUndefined } from "../../IApiClient";
import { BaseAPIClient } from "./BaseAPIClient";

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  id?: string;
  authMode?: GRAPHQL_AUTH_MODE;
}

export interface SubscriptionValue<T> {
  value: {
    data: T;
    errors: Array<any> | null;
  };
}

export abstract class BaseGraphQLAPIClient extends BaseAPIClient {
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
    if (!isNullOrUndefined(result.errors)) {
      throw new Error(`${typeof query}: ${result.errors} ${result.extensions}`);
    }

    if (isNullOrUndefined(result.data)) {
      throw new Error(`${typeof query}: Failed to get data`);
    }

    return result.data;
  }
}
