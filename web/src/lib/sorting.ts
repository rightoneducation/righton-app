import { Game } from '../API'

export enum SORT_TYPES {
  ALPHABETICAL,
<<<<<<< HEAD
  QUESTIONASCENDING,
  QUESTIONDESCENDING,
  GRADEASCENDING,
  GRADEDESCENDING,
  OLDEST,
  REVERSEALPHABETICAL,
  UPDATED,
};
=======
  UPDATED,
}
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  
const sortByUpdated = (a: Game | null, b: Game | null) => {
  if (!a || a.updatedAt === null) return 1;
  if (!b || b.updatedAt === null) return -1;
  if (a.updatedAt > b.updatedAt) return -1;
  if (b.updatedAt > a.updatedAt) return 1;
  return 0;
};

<<<<<<< HEAD
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

const sortByQuestionAscending = (a: Game | null, b: Game | null) => {  
  // @ts-ignore: Object is possibly 'null'.
  if(!a || a.questions === null) return -1;
  if(!b || b.questions === null) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(a.questions.length > b.questions.length) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(b.questions.length > a.questions.length) return -1;
  return 0;
};

const sortByQuestionDescending = (a: Game | null, b: Game | null) => {
  return sortByQuestionAscending(a, b) * -1;
};

const sortByGradeAscending = (a: Game | null, b: Game | null) => {
  if(!a || a.grade === null) return -1;
  if(!b || b.grade === null) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(a.grade > b.grade) return 1;
  // @ts-ignore: Object is possibly 'undefined'.
  if(b.grade > a.grade) return -1;
  return 0;
};

const sortByGradeDescending = (a: Game | null, b: Game | null) => {
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

export const sortGamesBySortType = (games: Array<Game | null>, sortType: SORT_TYPES): Game[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as Game[];
};
=======
const sortAlphabetically = (a: Game | null, b: Game | null) => {
  if (!a || !a.title) return 1;
  if (!b || !b.title) return -1;
  if (a.title > b.title) return 1;
  if (b.title > a.title) return -1;
  return 0;
};

const SORT_TYPE_TO_FUNCTION = {
  [SORT_TYPES.ALPHABETICAL]: sortAlphabetically,
  [SORT_TYPES.UPDATED]: sortByUpdated,
}

export const sortGamesBySortType = (games: Array<Game | null>, sortType: SORT_TYPES): Game[] => {
  return [...games].sort(SORT_TYPE_TO_FUNCTION[sortType]) as Game[]
}
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
