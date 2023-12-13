import { GameTemplate } from '@righton/networking';

export const getGameById = (games: GameTemplate[], id:  string) => {
  return games.find((game) => game.id === id)
}