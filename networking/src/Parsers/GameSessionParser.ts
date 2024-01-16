import { isNullOrUndefined } from "../IApiClient"
import { IGameSession, ITeam, IQuestion, IChoice } from "../Models"
import { AWSGameSession, AWSTeam, AWSQuestion } from "../Models/AWS"
import { 
  OnUpdateGameSessionSubscription, 
  UpdateGameSessionMutation, 
  OnGameSessionUpdatedByIdSubscription 
} from "../AWSMobileApi"
import { TeamMemberParser } from "./TeamMemberParser"

export class GameSessionParser {
  static gameSessionFromSubscription(
      subscription: OnUpdateGameSessionSubscription
  ): IGameSession {
      const updateGameSession = subscription.onUpdateGameSession
      if (isNullOrUndefined(updateGameSession)) {
          throw new Error("subscription.onUpdateGameSession can't be null.")
      }
      //@ts-ignore
      return this.gameSessionFromAWSGameSession(updateGameSession)
  }

  static gameSessionFromMutation(mutation: UpdateGameSessionMutation) {
      const updateGameSession = mutation.updateGameSession
      if (isNullOrUndefined(updateGameSession)) {
          throw new Error("mutation.updateGameSession can't be null.")
      }
      //@ts-ignore
      return this.gameSessionFromAWSGameSession(updateGameSession)
  }

  static gameSessionFromAWSGameSession(
      awsGameSession: AWSGameSession
  ): IGameSession {
      let teams: ITeam[] = [];
      if (!isNullOrUndefined(awsGameSession.teams) && !isNullOrUndefined(awsGameSession.teams.items)) {
        teams = GameSessionParser.mapTeams(awsGameSession.teams.items);    
      }
      let questions: IQuestion[] = [];
        if (!isNullOrUndefined(awsGameSession.questions) && !isNullOrUndefined(awsGameSession.questions.items)) {
            questions = GameSessionParser.mapQuestions(awsGameSession.questions.items);    
        }
      const {
          id,
          gameId,
          startTime = awsGameSession.startTime ?? '',
          phaseOneTime,
          phaseTwoTime,
          currentQuestionIndex = awsGameSession.currentQuestionIndex ?? 0,
          currentState,
          gameCode,
          currentTimer = awsGameSession.currentTimer ?? 120,
          updatedAt,
          createdAt,
          title = awsGameSession.title ?? '',
          isAdvancedMode,
      } = awsGameSession || {}
      if (
          isNullOrUndefined(id) ||
          isNullOrUndefined(gameId) ||
          isNullOrUndefined(phaseOneTime) ||
          isNullOrUndefined(phaseTwoTime) ||
          isNullOrUndefined(currentState) ||
          isNullOrUndefined(gameCode) ||
          isNullOrUndefined(updatedAt) ||
          isNullOrUndefined(createdAt) ||
          isNullOrUndefined(isAdvancedMode)
      ) {
          throw new Error(
              "GameSession has null field for the attributes that are not nullable"
          )
      }

      const gameSession: IGameSession = {
          id,
          gameId,
          startTime,
          phaseOneTime,
          phaseTwoTime,
          teams,
          currentQuestionIndex,
          currentState,
          gameCode,
          currentTimer,
          questions,
          isAdvancedMode,
          updatedAt,
          createdAt,
          title,
      } as IGameSession;
      return gameSession
  }

  static gameSessionFromSubscriptionById(
      subscription: OnGameSessionUpdatedByIdSubscription
  ): IGameSession {
      const updateGameSession = subscription.onGameSessionUpdatedById
      console.log(updateGameSession);
      if (isNullOrUndefined(updateGameSession)) {
          throw new Error("subscription.onUpdateGameSession can't be null.")
      }
      //@ts-ignore
      return this.gameSessionFromAWSGameSession(updateGameSession)
  }

  static mapTeams(
      awsTeams: AWSTeam[]
  ): Array<ITeam> {
      if (isNullOrUndefined(awsTeams)) {
          return []
      }
      return awsTeams.map((awsTeam) => {
          if (isNullOrUndefined(awsTeam)) {
              throw new Error("Team can't be null in the backend.")
          }

          const team: ITeam = {
              id: awsTeam.id,
              name: awsTeam.name,
              teamQuestionId: awsTeam.teamQuestionId ?? '',
              score: awsTeam.score ?? 0,
              selectedAvatarIndex: awsTeam.selectedAvatarIndex,
              createdAt: awsTeam.createdAt ?? '',
              updatedAt: awsTeam.updatedAt ?? '',
              gameSessionTeamsId: awsTeam.gameSessionTeamsId ?? '',
              teamQuestionGameSessionId: awsTeam.teamQuestionGameSessionId ?? '',
              teamMembers: TeamMemberParser.mapTeamMembers(
                  awsTeam.teamMembers?.items
              ),
          } as ITeam;
          return team
      })
  }

  private static parseServerArray<T>(input: any | T[]): Array<T> {
      if (input instanceof Array) {
          return input as T[]
      } else if (typeof input === "string") {
          return JSON.parse(input as string)
      }
      return []
  }

  private static mapQuestions(
      awsQuestions: Array<AWSQuestion | null>
  ): Array<IQuestion> {
      return awsQuestions
          .map((awsQuestion) => {
              if (isNullOrUndefined(awsQuestion)) {
                  throw new Error("Question cannot be null.")
              }
              const question: IQuestion = {
                  id: awsQuestion.id,
                  text: awsQuestion.text,
                  choices: isNullOrUndefined(awsQuestion.choices)
                      ? []
                      : this.parseServerArray<IChoice>(awsQuestion.choices),
                  responses: [],
                  imageUrl: awsQuestion.imageUrl,
                  instructions: isNullOrUndefined(awsQuestion.instructions)
                      ? []
                      : this.parseServerArray<string>(
                          awsQuestion.instructions
                      ),
                  standard: awsQuestion.standard ?? '',
                  cluster: awsQuestion.cluster ?? '',
                  domain: awsQuestion.domain ?? '',
                  grade: awsQuestion.grade ?? '',
                  gameSessionId: awsQuestion.gameSessionId,
                  order: awsQuestion.order ?? '',
                  isConfidenceEnabled: awsQuestion.isConfidenceEnabled,
                  isShortAnswerEnabled: awsQuestion.isShortAnswerEnabled,
                  isHintEnabled: awsQuestion.isHintEnabled
              }
              return question
          })
          .sort((lhs, rhs) => {
              return lhs.order - rhs.order
          })
  }
}