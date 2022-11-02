import { randomUUID } from 'crypto'
import { IQuestion, ITeam } from "../../src"

class TeamHelper {
    static team(name: string = randomUUID().toString(),
        gameSessionId: string = randomUUID(),
        question: IQuestion | null = null): ITeam {
        return {
            id: randomUUID(),
            name: name,
            question: question,
            teamMembers: [],
            score: 0,
            createdAt: Date().toString(),
            updatedAt: Date().toString(),
            gameSessionTeamsId: gameSessionId,
            teamQuestionId: question?.id.toString(),
            teamQuestionGameSessionId: gameSessionId,
        }
    }
}

export default TeamHelper