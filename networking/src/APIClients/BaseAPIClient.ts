import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { GraphQLResponseV6, UnknownGraphQLResponse, GraphqlSubscriptionResult } from '@aws-amplify/api-graphql';
import { isNullOrUndefined } from "../global";
import { Environment } from "./interfaces/IBaseAPIClient";
import { IGameTemplate, IQuestionTemplate} from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { QuestionTemplateParser } from "../Parsers/QuestionTemplateParser";
import { IAuthAPIClient } from "./auth";
// import { Auth } from "aws-amplify";

export enum HTTPMethod {
  Post = "POST",
}

export enum ElementType {
  GAME,
  QUESTION
}

export enum GalleryType {
  MOST_POPULAR,
  SEARCH_RESULTS
}

export enum GradeTarget {
  KINDERGARTEN = "K",
  GRADEONE = "1",
  GRADETWO = "2",
  GRADETHREE = "3",
  GRADEFOUR = "4",
  GRADEFIVE = "5",
  GRADESIX = "6",
  GRADESEVEN = "7",
  GRADEEIGHT = "8",
  HIGHSCHOOL = "H"
}
export enum SortType {
  listGameTemplates,
  listGameTemplatesByDate,
  listGameTemplatesByGrade,
  listGameTemplatesByQuestionCount,
  listQuestionTemplates,
  listQuestionTemplatesByDate,
  listQuestionTemplatesByGrade,
  listQuestionTemplatesByGameCount,
}

export enum EditType {
  CLONE,
  EDIT,
  DELETE
}
export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum PublicPrivateType {
  PUBLIC = "Public",
  PRIVATE = "Private",
  DRAFT = "Draft"
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

type QueryResult = 
    | { gameTemplates: IGameTemplate[]; nextToken: string | null }
    | { questionTemplates: IQuestionTemplate[]; nextToken: string | null };

// used in GameTemplateAPIClient and QuestionTemplateAPIClient to store query settings
export interface IQueryParameters { 
  limit?: number | null;
  nextToken: string | null;
  sortDirection?: string | null;
  [key: string]: any; // This line allows for additional properties like 'filter'
}

export abstract class BaseAPIClient {
  protected env: Environment;
  protected auth: IAuthAPIClient;
  protected endpoint: string;
  protected hintEndpoint: string;

  constructor(env: Environment, auth: IAuthAPIClient) {
    this.env = env;
    this.auth = auth;
    this.endpoint = `https://1y2kkd6x3e.execute-client.us-east-1.amazonaws.com/${env}/createGameSession`;
    this.hintEndpoint = `https://yh5ionr9rg.execute-client.us-east-1.amazonaws.com/groupHints/groupHints`;
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
  /* given that GameTemplate and QuestionTemplate are structured in the same way, 
  this function can be used to query both without duplicating a done of code */
  protected async executeQuery(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    awsType: string,
    queryName: string,
    query: any,
    type: PublicPrivateType,
    gradeTargets?: GradeTarget[] | null,
    favIds?: string[] | null
  ): Promise<QueryResult | null> {
    let queryParameters: IQueryParameters = { limit, nextToken, type: awsType };
    if (!queryParameters.filter) {
      queryParameters.filter = { and: [] };
    }
    if (favIds?.length) {
      queryParameters.filter.and.push({
        or: favIds.map(id => ({ id: { eq: id } }))
      });
    }
    if (filterString != null) {
      const lower = filterString.toLowerCase();
      const search: any = {
        or: [
          { lowerCaseTitle: { contains: lower } },
          { ccss: { contains: filterString } }
        ]
      };
      if (awsType === "PublicGameTemplate" || awsType === "PrivateGameTemplate") {
        search.or.push({ lowerCaseDescription: { contains: lower } });
      }
      queryParameters.filter.and.push(search);
    }
    if (gradeTargets?.length) {
      queryParameters.filter.and.push({
        or: gradeTargets.map(target => ({ gradeFilter: { eq: target } }))
      });
    }
    if (sortDirection != null) {
      queryParameters.sortDirection = sortDirection;
    }

    const authMode = await this.auth.verifyAuth() ? "userPool" : "iam";
    let raw;
    try{ 
      raw = await client.graphql({
        query,
        variables: queryParameters,
        authMode: authMode as GraphQLAuthMode
      }) as { data?: any; errors?: Array<{ message: string; path?: any[] }> };
    } catch (e) {
      raw = e as { data?: any; errors?: Array<{ message: string; path?: any[] }> };
    }

    const recoverable = (raw.errors || []).filter(err =>
      err.message.startsWith("Cannot return null for non-nullable type:")
    );
    const unrecoverable = (raw.errors || []).filter(err =>
      !err.message.startsWith("Cannot return null for non-nullable type:")
    );

    if (unrecoverable.length) {
      throw new Error(
        `GraphQL error${unrecoverable.length > 1 ? "s" : ""}: ` +
        unrecoverable.map(e => e.message).join("; ")
      );
    }

    if (recoverable.length) {
      console.warn(
        `Warning: ${queryName} had ${recoverable.length} nullable-field errors, dropping those fields & proceeding`,
        recoverable
      );
    }

    if (!raw.data || !raw.data[queryName]) {
      if (awsType.endsWith("GameTemplate")) {
        return { gameTemplates: [], nextToken: null };
      } else {
        return { questionTemplates: [], nextToken: null };
      }
    }
    
    const operation = raw.data[queryName];
    const parsedNextToken = operation.nextToken;

    if (awsType.endsWith("GameTemplate")) {
      const gameTemplates: IGameTemplate[] = [];
      for (const item of operation.items || []) {
        try {
          gameTemplates.push(
            GameTemplateParser.gameTemplateFromAWSGameTemplate(item, type)
          );
        } catch (e) {
          console.warn(`skipping broken GameTemplate ${item.id}`, e);
        }
      }
      return { gameTemplates, nextToken: parsedNextToken };
    } else {
      const questionTemplates: IQuestionTemplate[] = [];
      for (const item of operation.items || []) {
        try {
          questionTemplates.push(
            QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(item, type)
          );
        } catch (e) {
          console.warn(`skipping broken QuestionTemplate ${item.id}`, e);
        }
      }
      return { questionTemplates, nextToken: parsedNextToken };
    }
  }
}
export {Environment};