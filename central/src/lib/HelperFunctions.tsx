import { PublicGameTemplate, PrivateGameTemplate, PrivateQuestionTemplate, PublicQuestionTemplate } from '@righton/networking';

type GameTemplate = PublicGameTemplate | PrivateGameTemplate;

export const getGameById = (games: GameTemplate[], id:  string) => {
  return games.find((game: PublicGameTemplate | PrivateGameTemplate) => game.id === id)
}

type QuestionTemplate = PublicQuestionTemplate | PrivateQuestionTemplate;

export const getQuestionTemplateById = (questions: QuestionTemplate[] | PrivateQuestionTemplate[], id: string) => {
  return questions.find((question: PublicQuestionTemplate | PrivateQuestionTemplate) => question.id === id)
}