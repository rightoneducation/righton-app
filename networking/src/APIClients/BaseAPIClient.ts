import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6 } from '@aws-amplify/api-graphql';
import { isNullOrUndefined } from "../global";
import { Environment } from "./interfaces/IBaseAPIClient";
import { IGameTemplate, IQuestionTemplate} from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { QuestionTemplateParser } from "../Parsers/QuestionTemplateParser";
// import { Auth } from "aws-amplify";

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
  protected env: Environment;
  protected endpoint: string;
  protected hintEndpoint: string

  constructor(env: Environment) {
    this.env = env;
    this.endpoint = `https://1y2kkd6x3e.execute-client.us-east-1.amazonaws.com/${env}/createGameSession`;
    this.hintEndpoint = `https://yh5ionr9rg.execute-client.us-east-1.amazonaws.com/groupHints/groupHints`;
  }

  protected async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    const response = client.graphql({query: query, variables: options, authMode: "userPool" as GraphQLAuthMode}) as unknown;
    return response as GraphQLResponseV6<T> as Promise<GraphQLResult<T>>;
  }

  protected subscribeGraphQL<T>(
    subscription: any,
    callback: (value: T) => void
  ) {
    //@ts-ignore
    return client.graphql(subscription).subscribe({
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
  /* given that GameTemplate and QuestionTemplate are structured in the same way, 
  this function can be used to query both without duplicating a done of code */
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
      console.log("here");
      // const user = await Auth.currentAuthenticatedUser();
      // console.log("Current user: ", user);
      let result = (await client.graphql({query: query, variables: queryParameters, authMode: 'userPool' as GraphQLAuthMode})) as { data: any };
      console.log(result);
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