import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {
  ConfidenceLevel,
  CreateTeamAnswerInput,
  CreateTeamAnswerMutation,
  CreateTeamAnswerMutationVariables,
  CreateTeamInput,
  CreateTeamMemberInput,
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  OnCreateTeamAnswerSubscription,
  OnCreateTeamSubscription,
  OnDeleteTeamSubscription,
  OnGameSessionUpdatedByIdSubscription,
  OnUpdateTeamMemberSubscription,
  UpdateGameSessionInput,
  UpdateGameSessionMutation,
  UpdateGameSessionMutationVariables,
  UpdateTeamAnswerInput,
  UpdateTeamInput,
  UpdateTeamAnswerMutation,
  UpdateTeamAnswerMutationVariables,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from "./GraphQLAPI";
import {
  gameSessionByCode,
  getGameSession,
  getTeam,
  onCreateTeam,
  onCreateTeamAnswer,
  onDeleteTeam,
  onGameSessionUpdatedById,
  onUpdateTeamMember,
} from "./graphql";
import {
  createTeam,
  createTeamAnswer,
  createTeamMember,
  updateGameSession,
  updateTeamAnswer,
  updateTeam,
} from "./graphql/mutations";
import { IApiClient, isNullOrUndefined } from "./IApiClient";
import { AWSTeam, AWSTeamMember, ITeamAnswer, ITeamMember } from "./Models";
import { IGameSession } from "./Models/IGameSession";
import { ITeam } from "./Models/ITeam";
import {
  GameSessionParser,
  TeamAnswerParser,
  TeamMemberParser,
  TeamParser,
} from "./Parsers";
import { Environment } from "./APIClients";

Amplify.configure(awsconfig);

enum HTTPMethod {
  Post = "POST",
}

interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GRAPHQL_AUTH_MODE;
}

interface SubscriptionValue<T> {
  value: {
    data: T;
    errors: Array<any> | null;
  };
}

export class ApiClient implements IApiClient {
  private endpoint: string;

  constructor(env: Environment) {
    this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
  }

  createGameSession(
    gameId: number,
    isAdvancedMode: Boolean
  ): Promise<IGameSession> {
    return fetch(this.endpoint, {
      method: HTTPMethod.Post,
      headers: {
        "content-type": "application/json",
        connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        gameId: gameId,
        isAdvancedMode: isAdvancedMode,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        return GameSessionParser.gameSessionFromAWSGameSession(response);
      });
  }

  async getGameSession(id: string): Promise<IGameSession> {
    let result = (await API.graphql(
      graphqlOperation(getGameSession, { id })
    )) as { data: any };
    return GameSessionParser.gameSessionFromAWSGameSession(
      result.data.getGameSession
    );
  }

  async getTeam(id: string): Promise<ITeam> {
    let result = (await API.graphql(graphqlOperation(getTeam, { id }))) as {
      data: any;
    };
    return TeamParser.teamFromAWSTeam(result.data.getTeam);
  }

  async updateGameSession(
    awsGameSessionInput: UpdateGameSessionInput
  ): Promise<IGameSession> {
    let updateGameSessionInput: UpdateGameSessionInput = awsGameSessionInput;
    let variables: UpdateGameSessionMutationVariables = {
      input: updateGameSessionInput,
    };
    let result = await this.callGraphQL<UpdateGameSessionMutation>(
      updateGameSession,
      variables
    );
    if (result.errors != null) {
      throw new Error(`failed to update game session: ${result.errors}`);
    }

    if (result.data == null) {
      throw new Error("Failed to update the game session");
    }

    return this.mapUpdateGameSessionMutation(result.data);
  }

  subscribeUpdateGameSession(
    id: string,
    callback: (result: IGameSession) => void
  ) {
    return this.subscribeGraphQL<OnGameSessionUpdatedByIdSubscription>(
      {
        query: onGameSessionUpdatedById,
        variables: {
          id: id,
        },
      },
      (value: OnGameSessionUpdatedByIdSubscription) => {
        let gameSession = this.mapOnGameSessionUpdatedByIdSubscription(value);
        callback(gameSession);
      }
    );
  }

  subscribeUpdateTeamMember(
    id: string,
    callback: (result: ITeamMember) => void
  ) {
    return this.subscribeGraphQL<OnUpdateTeamMemberSubscription>(
      {
        query: onUpdateTeamMember,
        variables: {
          id: id,
        },
      },
      (value: OnUpdateTeamMemberSubscription) => {
        let teamMember = this.mapOnUpdateTeamMemberSubscription(value);
        callback(teamMember);
      }
    );
  }

  subscribeCreateTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnCreateTeamSubscription>(
      {
        query: onCreateTeam,
        variables: {
          id: id,
        },
      },
      (value: OnCreateTeamSubscription) => {
        let team = this.mapOnCreateTeamSubscription(value);
        callback(team);
      }
    );
  }

  subscribeDeleteTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnDeleteTeamSubscription>(
      {
        query: onDeleteTeam,
        variables: {
          id: id,
        },
      },
      (value: OnDeleteTeamSubscription) => {
        let team = this.mapOnDeleteTeamSubscription(value);
        callback(team);
      }
    );
  }

  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: ITeamAnswer) => void
  ) {
    return this.subscribeGraphQL<OnCreateTeamAnswerSubscription>(
      {
        query: onCreateTeamAnswer,
        variables: {
          id: id,
        },
      },
      (value: OnCreateTeamAnswerSubscription) => {
        let teamAnswer = this.mapOnCreateTeamAnswerSubscription(value);
        callback(teamAnswer);
      }
    );
  }

  async getGameSessionByCode(gameCode: number): Promise<IGameSession | null> {
    let result = (await API.graphql(
      graphqlOperation(gameSessionByCode, { gameCode })
    )) as { data: any };
    if (
      isNullOrUndefined(result.data) ||
      isNullOrUndefined(result.data.gameSessionByCode) ||
      isNullOrUndefined(result.data.gameSessionByCode.items) ||
      result.data.gameSessionByCode.items.length == 0
    ) {
      return null;
    }
    if (result.data.gameSessionByCode.items.length > 1) {
      throw new Error(`Multiple game sessions exist for ${gameCode}`);
    }
    return GameSessionParser.gameSessionFromAWSGameSession(
      result.data.gameSessionByCode.items[0]
    );
  }

  async addTeamToGameSessionId(
    gameSessionId: string,
    name: string,
    questionId: string | null
  ): Promise<ITeam> {
    const input: CreateTeamInput = {
      name,
      score: 0,
      selectedAvatarIndex: 0,
      teamQuestionId: questionId,
      gameSessionTeamsId: gameSessionId,
      teamQuestionGameSessionId: gameSessionId,
    };
    const variables: CreateTeamMutationVariables = { input };
    const team = await this.callGraphQL<CreateTeamMutation>(
      createTeam,
      variables
    );
    if (
      isNullOrUndefined(team.data) ||
      isNullOrUndefined(team.data.createTeam)
    ) {
      throw new Error(`Failed to create team`);
    }
    return TeamParser.teamFromAWSTeam(team.data.createTeam as AWSTeam);
  }

  async addTeamMemberToTeam(
    teamId: string,
    isFacilitator: boolean = false,
    deviceId: string
  ): Promise<ITeamMember> {
    const input: CreateTeamMemberInput = {
      isFacilitator,
      deviceId,
      teamTeamMembersId: teamId,
    };
    const variables: CreateTeamMemberMutationVariables = { input };
    const member = await this.callGraphQL<CreateTeamMemberMutation>(
      createTeamMember,
      variables
    );
    if (
      isNullOrUndefined(member.data) ||
      isNullOrUndefined(member.data.createTeamMember)
    ) {
      throw new Error(`Failed to create team member`);
    }
    return TeamMemberParser.teamMemberFromAWSTeamMember(
      member.data.createTeamMember as AWSTeamMember
    );
  }

  async addTeamAnswer(
    teamMemberId: string,
    questionId: string,
    text: string,
    isChosen: boolean = false,
    isTrickAnswer: boolean = false
  ): Promise<ITeamAnswer> {
    const input: CreateTeamAnswerInput = {
      questionId,
      isChosen,
      isTrickAnswer,
      text,
      teamMemberAnswersId: teamMemberId,
      confidenceLevel: ConfidenceLevel.NOT_RATED,
    };
    const variables: CreateTeamAnswerMutationVariables = { input };
    const answer = await this.callGraphQL<CreateTeamAnswerMutation>(
      createTeamAnswer,
      variables
    );
    if (
      isNullOrUndefined(answer.data) ||
      isNullOrUndefined(answer.data.createTeamAnswer)
    ) {
      throw new Error(`Failed to create team answer`);
    }
    return answer.data.createTeamAnswer as ITeamAnswer;
  }

  async updateTeamAnswer(
    teamAnswerId: string,
    isChosen: boolean | null = null
  ): Promise<ITeamAnswer> {
    const input: UpdateTeamAnswerInput = {
      id: teamAnswerId,
      isChosen,
    };
    const variables: UpdateTeamAnswerMutationVariables = { input };
    const answer = await this.callGraphQL<UpdateTeamAnswerMutation>(
      updateTeamAnswer,
      variables
    );
    if (
      isNullOrUndefined(answer.data) ||
      isNullOrUndefined(answer.data.updateTeamAnswer)
    ) {
      throw new Error(`Failed to update team answer`);
    }
    return answer.data.updateTeamAnswer as ITeamAnswer;
  }

  async updateTeam(teamInput: UpdateTeamInput): Promise<ITeam> {
    const input: UpdateTeamInput = teamInput;
    const variables: UpdateTeamMutationVariables = { input };
    const team = await this.callGraphQL<UpdateTeamMutation>(
      updateTeam,
      variables
    );
    if (
      isNullOrUndefined(team.data) ||
      isNullOrUndefined(team.data.updateTeam)
    ) {
      throw new Error(`Failed to update team`);
    }
    return team.data.updateTeam as ITeam;
  }

  // Private methods
  private subscribeGraphQL<T>(subscription: any, callback: (value: T) => void) {
    //@ts-ignore
    return API.graphql(subscription).subscribe({
      next: (response: SubscriptionValue<T>) => {
        if (!isNullOrUndefined(response.value.errors)) {
          console.error(response.value.errors);
        }
        callback(response.value.data);
      },
      error: (error: any) => console.warn(error),
    });
  }

  private async callGraphQL<T>(
    query: any,
    options?: GraphQLOptions
  ): Promise<GraphQLResult<T>> {
    return (await API.graphql(
      graphqlOperation(query, options)
    )) as GraphQLResult<T>;
  }

  private mapUpdateGameSessionMutation(
    updateGameSession: UpdateGameSessionMutation
  ): IGameSession {
    return GameSessionParser.gameSessionFromMutation(updateGameSession);
  }

  private mapOnGameSessionUpdatedByIdSubscription(
    subscription: OnGameSessionUpdatedByIdSubscription
  ): IGameSession {
    return GameSessionParser.gameSessionFromSubscriptionById(subscription);
  }

  private mapOnCreateTeamSubscription(
    subscription: OnCreateTeamSubscription
  ): ITeam {
    return TeamParser.teamFromCreateTeamSubscription(subscription);
  }

  private mapOnDeleteTeamSubscription(
    subscription: OnDeleteTeamSubscription
  ): ITeam {
    return TeamParser.teamFromDeleteTeamSubscription(subscription);
  }

  private mapOnUpdateTeamMemberSubscription(
    subscription: OnUpdateTeamMemberSubscription
  ): ITeamMember {
    return TeamMemberParser.teamMemberFromTeamMemberSubscription(subscription);
  }

  private mapOnCreateTeamAnswerSubscription(
    subscription: OnCreateTeamAnswerSubscription
  ): ITeamAnswer {
    return TeamAnswerParser.teamAnswerFromTeamAnswerSubscription(subscription);
  }
}
