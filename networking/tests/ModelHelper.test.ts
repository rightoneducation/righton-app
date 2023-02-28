import { ModelHelper } from "../src"
import GameSessionHelper from "./Helpers/GameSessionHelper"
import QuestionHelper from "./Helpers/QuestionHelper"
import TeamAnswerHelper from "./Helpers/TeamAnswerHelper"
import TeamHelper from "./Helpers/TeamHelper"
import TeamMemberHelper from "./Helpers/TeamMemberHelper"
import { IQuestion, ITeam } from "../src/Models"

describe("Testing ModelHelper", () => {

    const createGameSession = (teamTotalCount: number) => {
        const gameSession = GameSessionHelper.gameSession()

        for (let i = 0; i < teamTotalCount; i++) {
            const team = TeamHelper.team(`Team ${i + 1}`,
                gameSession.id)
            const teamMember = TeamMemberHelper.teamMember(team.id)
            gameSession.questions!.forEach((question) => {
              const answer = TeamAnswerHelper.teamAnswer(teamMember.id,
                  question.id,
                  question.choices![i % question.choices!.length].text,
                  question.choices![i % question.choices!.length].isAnswer
                  )
              teamMember.answers!.push(answer)
            })

            team.teamMembers!.push(teamMember)
            gameSession.teams!.push(team)
        }

        return gameSession
    }

    const addTrickAnswer = (team: ITeam, teamIndex: number, question: IQuestion) => {
      const teamMember = team.teamMembers![0]

      return TeamAnswerHelper.teamAnswer(teamMember!.id,
          question.id,
          question.choices![(teamIndex + 1) % question.choices!.length].text,
          false,
          true)
  }

    test("Calculating trick answer score", () => {
        const question = QuestionHelper.simpleQuestion()
        const correctAnswer = ModelHelper.getCorrectAnswer(question)
        expect(correctAnswer?.text).toEqual("3")
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
            //CHOOSE_CORRECT_ANSWER
            team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, question, team)
            //user is entering trick answer
            team.teamMembers![0]?.answers!.push(addTrickAnswer(team, idx, question))
            //CHOOSE_TRICKIEST_ANSWER
            team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, question, team)
            expect(team.score).toEqual((idx === 2 || idx === 6) ? 35 : 25)
        })
    })

    test("Calculate total score for multiple question game session", () => {
      const gameSession = createGameSession(8)

      gameSession.teams!.forEach((team, idx) => {
        gameSession.questions!.forEach((question) => {
          //CHOOSE_CORRECT_ANSWER
          team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, question, team)
          //user is entering trick answer
          team.teamMembers![0]?.answers!.push(addTrickAnswer(team, idx, question))
          //CHOOSE_TRICKIEST_ANSWER
          team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, question, team)

          if (gameSession.currentQuestionIndex! === 0)
            gameSession.currentQuestionIndex!++
          else
            gameSession.currentQuestionIndex!--
        })
        expect(team.score).toEqual((idx === 2 || idx === 6) ? 70 : 50)
      })
  })
})