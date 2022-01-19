import { Game } from '../API'

export enum SORT_TYPES {
  ALPHABETICAL,
  UPDATED,
  OLDEST,
  REVERSEALPHABETICAL,
}
  
const sortByUpdated = (a: Game | null, b: Game | null) => {
  if (!a || a.updatedAt === null) return 1;
  if (!b || b.updatedAt === null) return -1;
  if (a.updatedAt > b.updatedAt) return -1;
  if (b.updatedAt > a.updatedAt) return 1;
  return 0;
};

const sortByOldest = (a: Game | null, b: Game | null) => {
  if (!a || a.updatedAt === null) return -1;
  if (!b || b.updatedAt === null) return 1;
  if (a.updatedAt > b.updatedAt) return 1;
  if (b.updatedAt > a.updatedAt) return -1;
  return 0;
};

const sortAlphabetically = (a: Game | null, b: Game | null) => {
  if (!a || !a.title) return 1;
  if (!b || !b.title) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  if (b.title.toUpperCase() > a.title.toUpperCase()) return -1;
  return 0;
};

const sortByReverseAlphabetical = (a: Game | null, b: Game | null) => {
  if (!a || !a.title) return -1;
  if (!b || !b.title) return 1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return -1;
  if (b.title.toUpperCase() > a.title.toUpperCase()) return 1;
  return 0;
};

const SORT_TYPE_TO_FUNCTION = {
  [SORT_TYPES.ALPHABETICAL]: sortAlphabetically,
  [SORT_TYPES.UPDATED]: sortByUpdated,
  [SORT_TYPES.OLDEST]: sortByOldest,
  [SORT_TYPES.REVERSEALPHABETICAL]: sortByReverseAlphabetical,
}

export const sortGamesBySortType = (games: Array<Game | null>, sortType: SORT_TYPES): Game[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as Game[]
}