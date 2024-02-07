import { GameTemplate, QuestionTemplate } from '@righton/networking';

export const getGameById = (games: GameTemplate[], id:  string) => {
  return games.find((game) => game.id === id)
}

export const getQuestionTemplateById = (questions: QuestionTemplate[], id: string) => {
  return questions.find((question) => question.id === id)
}