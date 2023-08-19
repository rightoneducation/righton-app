import { IGame, isNullOrUndefined } from "@righton/networking";

export enum SORT_TYPES {
  ALPHABETICAL,
  QUESTIONASCENDING,
  QUESTIONDESCENDING,
  GRADEASCENDING,
  GRADEDESCENDING,
  OLDEST,
  REVERSEALPHABETICAL,
  UPDATED,
}

const sortByUpdated = (a: IGame, b: IGame) => {
  return a.updatedAt - b.updatedAt;
};

const sortByOldest = (a: IGame, b: IGame) => {
  return sortByUpdated(a, b) * -1;
};

const sortAlphabetically = (a: IGame | null, b: IGame | null) => {
  if (!a || !a.title) return 1;
  if (!b || !b.title) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  if (b.title.toUpperCase() > a.title.toUpperCase()) return -1;
  return 0;
};

const sortByReverseAlphabetical = (a: IGame | null, b: IGame | null) => {
  return sortAlphabetically(a, b) * -1;
};

const sortByQuestionAscending = (a: IGame | null, b: IGame | null) => {
  // @ts-ignore: Object is possibly 'null'.
  if (!a || a.questions === null) return -1;
  if (!b || b.questions === null) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if (a.questions.length > b.questions.length) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if (b.questions.length > a.questions.length) return -1;
  return 0;
};

const sortByQuestionDescending = (a: IGame | null, b: IGame | null) => {
  return sortByQuestionAscending(a, b) * -1;
};

const sortByGradeAscending = (a: IGame | null, b: IGame | null) => {
  return 0;
};

const sortByGradeDescending = (a: IGame | null, b: IGame | null) => {
  return sortByGradeAscending(a, b) * -1;
};

const SORT_TYPE_TO_FUNCTION = {
  [SORT_TYPES.ALPHABETICAL]: sortAlphabetically,
  [SORT_TYPES.UPDATED]: sortByUpdated,
  [SORT_TYPES.OLDEST]: sortByOldest,
  [SORT_TYPES.REVERSEALPHABETICAL]: sortByReverseAlphabetical,
  [SORT_TYPES.QUESTIONASCENDING]: sortByQuestionAscending,
  [SORT_TYPES.QUESTIONDESCENDING]: sortByQuestionDescending,
  [SORT_TYPES.GRADEASCENDING]: sortByGradeAscending,
  [SORT_TYPES.GRADEDESCENDING]: sortByGradeDescending,
};

export const sortGamesBySortType = (
  games: Array<IGame>,
  sortType: SORT_TYPES
): IGame[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as IGame[];
};
