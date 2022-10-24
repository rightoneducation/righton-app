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

        if (isNullOrUndefined(team.teamMembers[0]?.answers) ||
            team.teamMembers[0]?.answers.length == 0) {
            console.error("No answer is available")
            throw new Error("No answer is available")
        }

        return team.teamMembers[0]?.answers?.filter((answer) => {
            return !isNullOrUndefined(answer) &&
                !isNullOrUndefined(answer.questionId) &&
                answer.questionId === questionId
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

            return answer.questionId === questionId && team.trickiestAnswerIDs?.includes(answer.id)
        })

        return trickAnswers?.length === 1 ? trickAnswers[0] : null
    }

    static calculateBasicModeWrongAnswerScore(gameSession: IGameSession, team: ITeam, questionId: number): number {
        if (isNullOrUndefined(gameSession.teams)) {
            throw new Error("'teams' can't be null")
        }

        const teamAnswers = this.getBasicTeamMemberAnswersToQuestionId(team, questionId)

        if (isNullOrUndefined(teamAnswers) ||
            teamAnswers.length != 1) {
            return 0
        }

        // Calculate how many teams have chosen the same answer as the passed team.
        const totalNoChosenAnswer = gameSession.teams.reduce((previousVal: number, otherTeam: ITeam) => {
            if (isNullOrUndefined(otherTeam.teamMembers) ||
                otherTeam.teamMembers.length < 1) {
                return previousVal
            }

            const answersToQuestion = otherTeam.teamMembers[0]?.answers?.filter((answer) => {
                !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer?.questionId) &&
                    answer.questionId === questionId &&
                    answer.text === teamAnswers[0]!.questionId
            })

            return previousVal + (answersToQuestion?.length ?? 0)
        }, 1)

        return Math.ceil(totalNoChosenAnswer / gameSession.teams.length) * 100
    }
}