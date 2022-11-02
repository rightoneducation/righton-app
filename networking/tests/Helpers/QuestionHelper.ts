import { randomInt, randomUUID } from "crypto"
import { IQuestion } from "../../src"

class QuestionHelper {
    public static simpleQuestion(gameSessionId: string = randomUUID()): IQuestion {
        return {
            id: Math.abs(randomInt(Math.pow(2, 31))),
            gameSessionId: gameSessionId,
            text: "Question text",
            instructions: [
                "hint 1",
                "hint 2",
                "hint 3"
            ],
            standard: "standard",
            cluster: "cluster",
            domain: "domain",
            grade: "grade",
            order: 1,
            choices: [
                {
                    text: "1",
                    isAnswer: false,
                },
                {
                    text: "2",
                    isAnswer: false,
                },
                {
                    text: "3",
                    isAnswer: true,
                },
                {
                    text: "4",
                    isAnswer: false,
                }
            ]
        } as IQuestion
    }
}

export default QuestionHelper