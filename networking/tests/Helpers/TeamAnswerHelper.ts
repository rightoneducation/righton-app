import { randomUUID } from 'crypto'
import { ITeamAnswer } from '../../src'

class TeamAnswerHelper {
    static teamAnswer(teamMemberId: string,
        questionId: number,
        answerText: string,
        isTrickAnswer: boolean = false): ITeamAnswer {
        return {
            id: randomUUID(),
            isChosen: false,
            text: answerText,
            questionId: questionId,
            isTrickAnswer: isTrickAnswer,
            createdAt: Date().toString(),
            updatedAt: Date().toString(),
            teamMemberAnswersId: teamMemberId
        }
    }
}

export default TeamAnswerHelper