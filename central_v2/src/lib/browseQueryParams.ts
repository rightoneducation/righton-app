import { GradeTarget, SortType, SortDirection } from '@righton/networking';
import { GameQuestionType } from './CentralModels';

/**
 * URL codec for the Browse screen's query state.
 *
 * Browse treats its URL as the source of truth: it seeds from the URL on mount
 * and writes back as the user changes search/grades/sort. The temporary
 * front-page launcher bar (components/explorelauncher) encodes with the same
 * functions, so a launched URL and a Browse-authored URL are identical.
 */

export type BrowseQuery = {
  search: string;
  grades: GradeTarget[];
  sort: { field: SortType; direction: SortDirection | null };
};

/**
 * Sort travels as a semantic token rather than the raw SortType, which is a
 * numeric enum and would serialise as `sort=3`. Tokens are also type-agnostic,
 * so the same link resolves correctly whether it lands on games or questions.
 */
export type SortToken = 'popular' | 'date' | 'grade' | 'count';

const SORT_TOKENS: Record<
  SortToken,
  { game: SortType; question: SortType }
> = {
  popular: {
    game: SortType.listGameTemplates,
    question: SortType.listQuestionTemplates,
  },
  date: {
    game: SortType.listGameTemplatesByDate,
    question: SortType.listQuestionTemplatesByDate,
  },
  grade: {
    game: SortType.listGameTemplatesByGrade,
    question: SortType.listQuestionTemplatesByGrade,
  },
  count: {
    game: SortType.listGameTemplatesByQuestionCount,
    question: SortType.listQuestionTemplatesByGameCount,
  },
};

const SORT_TOKEN_LIST = Object.keys(SORT_TOKENS) as SortToken[];

const isQuestionType = (gameQuestion: GameQuestionType) =>
  gameQuestion === GameQuestionType.QUESTION;

export const defaultBrowseSort = (gameQuestion: GameQuestionType) => ({
  field: isQuestionType(gameQuestion)
    ? SortType.listQuestionTemplatesByDate
    : SortType.listGameTemplatesByDate,
  direction: SortDirection.DESC as SortDirection | null,
});

export const emptyBrowseQuery = (
  gameQuestion: GameQuestionType,
): BrowseQuery => ({
  search: '',
  grades: [],
  sort: defaultBrowseSort(gameQuestion),
});

/** Reverse lookup: a SortType from either side maps back to its token. */
export const sortTokenForField = (field: SortType): SortToken | null =>
  SORT_TOKEN_LIST.find(
    (token) =>
      SORT_TOKENS[token].game === field ||
      SORT_TOKENS[token].question === field,
  ) ?? null;

/**
 * SortSearchMenu's internal sortTypeMap contains GAME members only, so seeding
 * it with a question-side field would match no menu item and highlight nothing.
 */
export const gameSideField = (field: SortType): SortType => {
  const token = sortTokenForField(field);
  return token ? SORT_TOKENS[token].game : SortType.listGameTemplates;
};

/**
 * Grade selection implies grade ordering unless the user has said otherwise.
 * Server-side only: Browse pages by cursor, so sorting a page client-side would
 * restart the ordering on every page rather than running across the result set.
 *
 * Caveat: `grade` is a String sort key, so DynamoDB orders it lexicographically.
 * Numeric grades come out correctly (6, 7, 8), but K sorts after 8 and HS. A
 * true fix needs a sortable grade column on the schema plus a backfill.
 */
export const effectiveBrowseSort = (
  query: BrowseQuery,
  gameQuestion: GameQuestionType,
  hasUserPickedSort: boolean,
): BrowseQuery['sort'] => {
  if (query.grades.length === 0 || hasUserPickedSort) return query.sort;
  return {
    field: isQuestionType(gameQuestion)
      ? SortType.listQuestionTemplatesByGrade
      : SortType.listGameTemplatesByGrade,
    direction: SortDirection.ASC,
  };
};

const GRADE_VALUES = Object.values(GradeTarget) as string[];

export const decodeBrowseQuery = (
  params: URLSearchParams,
  gameQuestion: GameQuestionType,
): BrowseQuery => {
  const fallback = emptyBrowseQuery(gameQuestion);

  const search = params.get('search')?.trim() ?? '';

  // unknown grades are dropped rather than passed through, so a hand-edited URL
  // cannot inject junk into the query
  const grades = (params.get('grades') ?? '')
    .split(',')
    .map((raw) => raw.trim())
    .filter((raw) => GRADE_VALUES.includes(raw)) as GradeTarget[];

  const token = params.get('sort') as SortToken | null;
  const field =
    token && SORT_TOKENS[token]
      ? SORT_TOKENS[token][isQuestionType(gameQuestion) ? 'question' : 'game']
      : fallback.sort.field;

  const rawDir = params.get('dir');
  const direction =
    rawDir === SortDirection.ASC || rawDir === SortDirection.DESC
      ? (rawDir as SortDirection)
      : fallback.sort.direction;

  return { search, grades, sort: { field, direction } };
};

export const encodeBrowseQuery = (
  query: BrowseQuery,
  gameQuestion: GameQuestionType,
): URLSearchParams => {
  const params = new URLSearchParams();
  const fallback = emptyBrowseQuery(gameQuestion);

  // defaults and empties are omitted so an untouched Browse keeps a clean URL
  if (query.search.trim().length > 0) params.set('search', query.search.trim());
  if (query.grades.length > 0) params.set('grades', query.grades.join(','));

  const isDefaultSort =
    query.sort.field === fallback.sort.field &&
    query.sort.direction === fallback.sort.direction;
  if (!isDefaultSort) {
    const token = sortTokenForField(query.sort.field);
    if (token) params.set('sort', token);
    if (query.sort.direction) params.set('dir', query.sort.direction);
  }

  return params;
};
