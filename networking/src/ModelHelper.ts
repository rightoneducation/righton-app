import { isNullOrUndefined } from "./IApiClient"
import { IGameSession, ITeam, ITeamAnswer } from "./Models"
import { IChoice, IQuestion } from './Models/IQuestion'
import { ITeamMember } from './Models/ITeamMember'
import { GameSessionState } from './AWSMobileApi'

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
    static getSelectedAnswer(team: ITeam, question: IQuestion, currentState: GameSessionState): ITeamAnswer | null {
        // step 1: get all answers from player
        let teamAnswers;
        if (team != null) {
            teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(
            team,
            question.id
            );
        }
        // step 2: get the answer the player selected this round
        const findSelectedAnswer = (answers: (ITeamAnswer | null)[]) => {
            const selectedAnswer = answers.find((teamAnswer: ITeamAnswer | null) => 
                currentState === GameSessionState.PHASE_1_RESULTS || currentState === GameSessionState.PHASE_1_DISCUSS
                    ? teamAnswer?.isChosen === true
                    : teamAnswer?.isTrickAnswer === true
            );
            return isNullOrUndefined(selectedAnswer) ? null : selectedAnswer;
        };

        if (team != null && !isNullOrUndefined(teamAnswers)) {
            return findSelectedAnswer(teamAnswers);
        }
        return null;
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
                answer.isTrickAnswer
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

            const answersToQuestion = teamMember.answers.find((answer) => {
                return !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer!.questionId) &&
                    answer.questionId === questionId &&
                    !answer.isTrickAnswer &&
                    answer!.text === answerText
            })

            return previousVal + (isNullOrUndefined(answersToQuestion) ? 0 : 1)
        }, 0)

        return Math.round(totalNoChosenAnswer / gameSession.teams.length * 100)
    }

    static calculateBasicModeScoreForQuestion(gameSession: IGameSession, question: IQuestion, team: ITeam) {
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
        const currentQuestion = gameSession?.questions[gameSession?.currentQuestionIndex ?? 0]
        let submittedTrickAnswer = answers.find(answer => answer?.isTrickAnswer && answer.questionId === currentQuestion.id)

        if (submittedTrickAnswer){
          return ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, submittedTrickAnswer.text ?? '', currentQuestion.id)
        }
        else if (answers.find(answer => answer?.isChosen && answer?.text === correctAnswer?.text && answer.questionId === currentQuestion.id && gameSession?.currentState === GameSessionState.PHASE_1_RESULTS)){
          return this.correctAnswerScore
        }
        else{
          return 0
        }
    }

    static findTeamInGameSession(gameSession: IGameSession, teamId: string): ITeam | null {
        if (isNullOrUndefined(teamId)) {
            return null
        }
        return gameSession.teams?.find(team => team.id === teamId) ?? null
    }

    static findTeamMemberInTeam(team: ITeam, teamMemberId: string): ITeamMember | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length === 0) {
            return null
        }
        return team.teamMembers.find(member =>
            !isNullOrUndefined(member) && member.id === teamMemberId) ?? null
    }
}