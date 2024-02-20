import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import awsconfig from "../aws-exports";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { isNullOrUndefined } from "../global";
import { Environment } from "./interfaces/IBaseAPIClient";
import { IGameTemplate, IQuestionTemplate} from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { QuestionTemplateParser } from "../Parsers/QuestionTemplateParser";

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

type QueryResult<T> = T extends "GameTemplate"
? { gameTemplates: IGameTemplate[]; nextToken: string }
: T extends "QuestionTemplate"
? { questionTemplates: IQuestionTemplate[]; nextToken: string }
: never;

// used in GameTemplateAPIClient and QuestionTemplateAPIClient to store query settings
export interface IQueryParameters { 
  limit?: number | null;
  nextToken: string | null;
  sortDirection?: string | null;
  type: string;
  [key: string]: any; // This line allows for additional properties like 'filter'
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

  protected async executeQuery <T extends "GameTemplate" | "QuestionTemplate">(
      limit: number | null, 
      nextToken: string | null, 
      sortDirection: string | null,
      filterString: string | null,
      type: T, 
      query: any,
      queryName: string
    ): Promise<QueryResult<T> | null> {
      let queryParameters: IQueryParameters = { limit, nextToken, type };
      if (filterString != null) {
        queryParameters.filter = { title: { contains: filterString } };
      }
      if (sortDirection != null) {
        queryParameters.sortDirection = sortDirection;
      }
      let result = (await API.graphql(
        graphqlOperation(query, queryParameters)
      )) as { data: any }
      const operationResult = result.data[queryName];
      const parsedNextToken = operationResult.nextToken;
      if (type === "GameTemplate") {
        const gameTemplates = operationResult.items.map(GameTemplateParser.gameTemplateFromAWSGameTemplate);
        return { gameTemplates, nextToken: parsedNextToken } as QueryResult<T>;
      } else {
        const questionTemplates = operationResult.items.map(QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate);
        return { questionTemplates, nextToken: parsedNextToken } as QueryResult<T>;
      }
  }
}
export { Environment };