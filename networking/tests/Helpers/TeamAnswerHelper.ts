import { randomUUID } from 'crypto'
import { ITeamAnswer } from '../../src'

class TeamAnswerHelper {
    static teamAnswer(teamMemberAnswersId: string,
        questionId: number,
        answerText: string,
        isChosen: boolean,
        isTrickAnswer: boolean = false): ITeamAnswer {
        return {
            id: randomUUID(),
            isChosen: isChosen,
            text: answerText,
            questionId: questionId,
            isTrickAnswer: isTrickAnswer,
            createdAt: Date().toString(),
            updatedAt: Date().toString(),
            teamMemberAnswersId: teamMemberAnswersId
        }
    }
}

export default TeamAnswerHelper