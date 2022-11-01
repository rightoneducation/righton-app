import { isNullOrUndefined } from "./IApiClient"
import { IGameSession, ITeam, ITeamAnswer } from "./Models"
import { IChoice, IQuestion } from './Models/IQuestion'

export abstract class ModelHelper {
    static getBasicTeamMemberAnswersToQuestionId(team: ITeam, questionId: number): Array<ITeamAnswer | null> | undefined {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length == 0) {
            console.error("Team members is null")
            throw new Error("No members available for the team")
        }

        return team.teamMembers[0]?.answers?.filter((answer) => {
            return !isNullOrUndefined(answer) &&
                !isNullOrUndefined(answer.questionId) &&
                answer.questionId === questionId &&
                answer.isTrickAnswer
        })
    }

    static getCorrectAnswer(question: IQuestion): IChoice {
        return question.choices!.filter((choice) => {
            return !isNullOrUndefined(choice.isAnswer) && choice.isAnswer
        })[0]
    }

    static getSelectedTrickAnswer(team: ITeam, questionId: number): ITeamAnswer | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length !== 1) {
            throw new Error("Given team has no members or more than one members")
        }

        const teamMember = team.teamMembers[0]
        const trickAnswers = teamMember!.answers?.filter((answer) => {
            if (isNullOrUndefined(answer)) {
                return false
            }

            return answer.questionId === questionId &&
                !answer.isTrickAnswer
        })

        return trickAnswers?.length === 1 ? trickAnswers[0] : null
    }

    static calculateBasicModeWrongAnswerScore(gameSession: IGameSession, choice: IChoice, questionId: number): number {
        if (isNullOrUndefined(gameSession.teams)) {
            throw new Error("'teams' can't be null")
        }

        // Calculate how many teams have chosen the same answer as the passed team.
        const totalNoChosenAnswer = gameSession.teams.reduce((previousVal: number, team: ITeam) => {
            if (isNullOrUndefined(team.teamMembers) ||
                team.teamMembers.length < 1) {
                console.error(`No team member available for ${team.name}`)
                return previousVal
            }

            const answersToQuestion = team.teamMembers[0]?.answers?.filter((answer) => {
                return !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer!.questionId) &&
                    answer.questionId === questionId &&
                    !answer.isTrickAnswer &&
                    answer!.text === choice.text
            })

            return previousVal + (answersToQuestion?.length ?? 0)
        }, 0)

        return Math.round(totalNoChosenAnswer / gameSession.teams.length * 100)
    }
}