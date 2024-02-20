import { IGameTemplate, isNullOrUndefined } from "@righton/networking";

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

const sortByUpdated = (a: IGameTemplate, b: IGameTemplate) => {
  if (isNullOrUndefined(a.updatedAt)) return 1;
  if (isNullOrUndefined(b.updatedAt)) return -1;
  return 1; //a.updatedAt - b.updatedAt;
};

const sortByOldest = (a: IGameTemplate, b: IGameTemplate) => {
  return 1; //sortByUpdated(a, b) * -1;
};

const sortAlphabetically = (a: IGameTemplate | null, b: IGameTemplate | null) => {
  if (!a || !a.title) return 1;
  if (!b || !b.title) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  if (b.title.toUpperCase() > a.title.toUpperCase()) return -1;
  return 0;
};

const sortByReverseAlphabetical = (a: IGameTemplate | null, b: IGameTemplate | null) => {
  return sortAlphabetically(a, b) * -1;
};

const sortByQuestionAscending = (a: IGameTemplate | null, b: IGameTemplate | null) => {
  // @ts-ignore: Object is possibly 'null'.
  if (!a || a.questionTemplates === null) return -1;
  if (!b || b.questionTemplates === null) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if (a.questions.length > b.questions.length) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if (b.questions.length > a.questions.length) return -1;
  return 0;
};

const sortByQuestionDescending = (a: IGameTemplate | null, b: IGameTemplate | null) => {
  return sortByQuestionAscending(a, b) * -1;
};

const sortByGradeAscending = (a: IGameTemplate | null, b: IGameTemplate | null) => {
  return 0;
};

const sortByGradeDescending = (a: IGameTemplate | null, b: IGameTemplate | null) => {
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
  games: Array<IGameTemplate>,
  sortType: SORT_TYPES
): IGameTemplate[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as IGameTemplate[];
};