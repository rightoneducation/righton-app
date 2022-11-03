import { isNullOrUndefined } from "./IApiClient"
import { IGameSession, ITeam, ITeamAnswer } from "./Models"
import { IChoice, IQuestion } from './Models/IQuestion'

export abstract class ModelHelper {
    private static correctAnswerScore = 10

    static getBasicTeamMemberAnswersToQuestionId(team: ITeam, questionId: number): Array<ITeamAnswer | null> | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length == 0) {
            console.error("Team members is null")
            throw new Error("No members available for the team")
        }

        const teamMember = team.teamMembers[0]!

        if (isNullOrUndefined(teamMember.answers) ||
            teamMember.answers.length === 0) {
            return null
        }

        return teamMember.answers.filter((answer) => {
            return !isNullOrUndefined(answer) &&
                !isNullOrUndefined(answer.questionId) &&
                answer.questionId === questionId
        })
    }

    static getCorrectAnswer(question: IQuestion): IChoice | null {
        return question.choices!.find((choice) => {
            return !isNullOrUndefined(choice.isAnswer) && choice.isAnswer
        }) ?? null
    }

    static getSelectedTrickAnswer(team: ITeam, questionId: number): ITeamAnswer | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length !== 1) {
            throw new Error("Given team has no members or more than one members")
        }

        const teamMember = team.teamMembers[0]
        const trickAnswer = teamMember!.answers?.find((answer) => {
            if (isNullOrUndefined(answer)) {
                return false
            }

            return answer.questionId === questionId &&
                !answer.isTrickAnswer
        })

        return trickAnswer ?? null
    }

    static calculateBasicModeWrongAnswerScore(gameSession: IGameSession, answerText: string, questionId: number): number {
        if (isNullOrUndefined(gameSession.teams)) {
            throw new Error("'teams' can't be null")
        }

        // Calculate how many teams have chosen the same answer as the passed team.
        const totalNoChosenAnswer = gameSession.teams.reduce((previousVal: number, team: ITeam) => {
            if (isNullOrUndefined(team.teamMembers) ||
                team.teamMembers.length !== 1) {
                console.error(`No team member available for ${team.name}`)
                return previousVal
            }

            const teamMember = team.teamMembers[0]!

            if (isNullOrUndefined(teamMember.answers) ||
                teamMember.answers.length === 0) {
                return previousVal
            }

            const answersToQuestion = teamMember.answers.filter((answer) => {
                return !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer!.questionId) &&
                    answer.questionId === questionId &&
                    !answer.isTrickAnswer &&
                    answer!.text === answerText
            })

            return previousVal + (answersToQuestion?.length ?? 0)
        }, 0)

        return Math.round(totalNoChosenAnswer / gameSession.teams.length * 100)
    }

    static calculateBasicModeTotalScoreForQuestion(gameSession: IGameSession, question: IQuestion, team: ITeam) {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length === 0) {
            console.error("No team member exists for the specified team")
            throw new Error("No team member exists for the specified team")
        }

        const answers = this.getBasicTeamMemberAnswersToQuestionId(team, question.id)
        if (isNullOrUndefined(answers) ||
            answers.length === 0) {
            return 0
        }

        const correctAnswer = this.getCorrectAnswer(question)

        if (isNullOrUndefined(correctAnswer)) {
            return 0
        }

        return answers!.reduce((score: number, answer: ITeamAnswer | null) => {
            if (isNullOrUndefined(answer)) {
                return score
            }

            if (answer.isTrickAnswer) {
                return score + this.calculateBasicModeWrongAnswerScore(gameSession, answer.text, question.id)
            } else {
                console.log(`${answer.text} === ${correctAnswer.text} = ${answer.text === correctAnswer.text}`)
                return score + (
                    answer.text === correctAnswer.text ? this.correctAnswerScore : 0)
            }
        }, 0)
    }
}