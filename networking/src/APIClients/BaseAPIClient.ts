import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { isNullOrUndefined } from "../global";
import { Environment } from "./interfaces/IBaseAPIClient";
import { IGameTemplate, IQuestionTemplate} from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { QuestionTemplateParser } from "../Parsers/QuestionTemplateParser";

export enum HTTPMethod {
  Post = "POST",
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
  protected env: Environment;
  protected endpoint: string;
  protected hintEndpoint: string

  constructor(env: Environment) {
    this.env = env;
    this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
    this.hintEndpoint = `https://yh5ionr9rg.execute-api.us-east-1.amazonaws.com/groupHints/groupHints`;
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
  /* given that GameTemplate and QuestionTemplate are structured in the same way, 
  this function can be used to query both without duplicating a done of code */
  protected async executeQuery <T extends "GameTemplate" | "QuestionTemplate">(
      limit: number | null, 
      nextToken: string | null, 
      sortDirection: string | null,
      filterString: string | null,
      type: T, 
      query: any,
      queryName: string,
      gradeTargets?: GradeTarget[] | null,
    ): Promise<QueryResult<T> | null> {
      let queryParameters: IQueryParameters = { limit, nextToken, type };
      if (filterString != null && gradeTargets) {
          const filters: any[] = [];
          const gradeFilters: any[] =[];
          filters.push({ title: { contains: filterString } });
          filters.push({ description: { contains: filterString } });
          filters.push({ ccss: { contains: filterString } });
          if (gradeTargets.length === 0) {
            gradeFilters.push({ gradeFilter: { eq: "K" } });
            gradeFilters.push({ gradeFilter: { eq: "1" } });
            gradeFilters.push({ gradeFilter: { eq: "2" } });
            gradeFilters.push({ gradeFilter: { eq: "3" } });
            gradeFilters.push({ gradeFilter: { eq: "4" } });
            gradeFilters.push({ gradeFilter: { eq: "5" } });
            gradeFilters.push({ gradeFilter: { eq: "6" } });
            gradeFilters.push({ gradeFilter: { eq: "7" } });
            gradeFilters.push({ gradeFilter: { eq: "8" } });
            gradeFilters.push({ gradeFilter: { eq: "H" } });
          } else {
            gradeTargets.forEach((target) => {
              if (target !== null) {
                gradeFilters.push({ gradeFilter: { eq: target } });
              }
            });
          }
          queryParameters.filter = {
            and: [
              { or: gradeFilters }, // Match one of the specified grades
              { or: filters }       // Match at least one of the filters (title, description, etc.)
            ]
          };
      }
      if (sortDirection != null) {
        queryParameters.sortDirection = sortDirection;
      }
      let result = (await API.graphql(
        graphqlOperation(query, queryParameters)
      )) as { data: any }
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