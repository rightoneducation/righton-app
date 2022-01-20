import { setOriginalNode } from 'typescript';
import { Game } from '../API'

export enum SORT_TYPES {
  ALPHABETICAL,
  ASCENDING,
  DESCENDING,
  OLDEST,
  REVERSEALPHABETICAL,
  UPDATED,
};
  
const sortByUpdated = (a: Game | null, b: Game | null) => {
  if (!a || a.updatedAt === null) return 1;
  if (!b || b.updatedAt === null) return -1;
  if (a.updatedAt > b.updatedAt) return -1;
  if (b.updatedAt > a.updatedAt) return 1;
  return 0;
};

const sortByOldest = (a: Game | null, b: Game | null) => {
  return sortByUpdated(a, b) * -1;
};

const sortAlphabetically = (a: Game | null, b: Game | null) => {
  if (!a || !a.title) return 1;
  if (!b || !b.title) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  if (b.title.toUpperCase() > a.title.toUpperCase()) return -1;
  return 0;
};

const sortByReverseAlphabetical = (a: Game | null, b: Game | null) => {
  return sortAlphabetically(a, b) * -1;
};

const sortByAscending = (a: Game | null, b: Game | null) => {  
  // @ts-ignore: Object is possibly 'null'.
  if(!a || a.questions === null) return -1;
  if(!b || b.questions === null) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(a.questions.length > b.questions.length) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(b.questions.length > a.questions.length) return -1;
  return 0;
};

const sortByDescending = (a: Game | null, b: Game | null) => {
  return sortByAscending(a, b) * -1;
};

const SORT_TYPE_TO_FUNCTION = {
  [SORT_TYPES.ALPHABETICAL]: sortAlphabetically,
  [SORT_TYPES.UPDATED]: sortByUpdated,
  [SORT_TYPES.OLDEST]: sortByOldest,
  [SORT_TYPES.REVERSEALPHABETICAL]: sortByReverseAlphabetical,
  [SORT_TYPES.ASCENDING]: sortByAscending,
  [SORT_TYPES.DESCENDING]: sortByDescending,
};

export const sortGamesBySortType = (games: Array<Game | null>, sortType: SORT_TYPES): Game[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as Game[];
};