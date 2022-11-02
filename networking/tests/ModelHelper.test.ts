import { ModelHelper } from "../src"
import GameSessionHelper from "./Helpers/GameSessionHelper"
import QuestionHelper from "./Helpers/QuestionHelper"
import TeamAnswerHelper from "./Helpers/TeamAnswerHelper"
import TeamHelper from "./Helpers/TeamHelper"
import TeamMemberHelper from "./Helpers/TeamMemberHelper"

describe("Testing ModelHelper", () => {

    const createGameSession = (teamTotalCount: number) => {
        const gameSession = GameSessionHelper.gameSession()
        const question = gameSession.questions[0]
        for (let i = 0; i < teamTotalCount; i++) {
            const team = TeamHelper.team(`Team ${i + 1}`,
                gameSession.id)
            const teamMember = TeamMemberHelper.teamMember(team.id)
            const answer = TeamAnswerHelper.teamAnswer(teamMember.id,
                question.id,
                question.choices![i % question.choices!.length].text)
            teamMember.answers!.push(answer)

            const trickAnswerChoice = TeamAnswerHelper.teamAnswer(teamMember.id,
                question.id,
                question.choices![(i + 1) % question.choices!.length].text,
                true)
            teamMember.answers!.push(trickAnswerChoice)

            team.teamMembers!.push(teamMember)
            gameSession.teams!.push(team)
        }

        return gameSession
    }

    test("Calculating trick answer score", () => {
        const question = QuestionHelper.simpleQuestion()
        const correctAnswer = ModelHelper.getCorrectAnswer(question)
        expect(correctAnswer.text).toEqual("3")
    })

    test("Calculate trick answer score for one question game session", () => {

        const gameSession = createGameSession(8)
        const question = gameSession.questions[0]

        question.choices!.forEach((choice) => {
            const score = ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, choice.text, question.id)
            expect(score).toEqual(25)
        })
    })

    test("Calculate total score for one question game session", () => {
        const gameSession = createGameSession(8)
        const question = gameSession.questions[0]

        gameSession.teams!.forEach((team, idx) => {
            const totalScore = ModelHelper.calculateBasicModeTotalScoreForQuestion(gameSession, question, team)
            expect(totalScore).toEqual((idx === 2 || idx === 6) ? 35 : 25)
        })
    })
})