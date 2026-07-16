import { SortType, SortDirection } from '@righton/networking';
import {
  ICentralDataState,
  LibraryTabEnum,
  ScreenSize,
} from '../CentralModels';

// Favorites are a small client-side set (fetched by id in getFav) and are
// re-sorted here rather than via an API query. Date sorts use updatedAt; grade
// sorts fall back to a string compare of the grade field (game.grade /
// question.gradeFilter) - best-effort ordering, never hides items.
const sortFavorites = <T extends { updatedAt?: Date | null }>(
  items: T[],
  sortField: SortType,
  sortDirection: SortDirection | null,
  gradeSortField: SortType,
  gradeOf: (item: T) => string,
): T[] => {
  const dir = sortDirection === SortDirection.ASC ? 1 : -1;
  return [...items].sort((a, b) => {
    if (sortField === gradeSortField) {
      return dir * gradeOf(a).localeCompare(gradeOf(b));
    }
    return (
      dir *
      (new Date(a.updatedAt ?? 0).getTime() - new Date(b.updatedAt ?? 0).getTime())
    );
  });
};

export const getTabLabel = (
  screen: ScreenSize,
  isSelected: boolean,
  value: string,
) => {
  if (screen === ScreenSize.LARGE) return value;
  if (screen === ScreenSize.MEDIUM && isSelected) return value;
  return '';
};

export const getGameElements = (
  openTab: LibraryTabEnum,
  isSearchResults: boolean,
  centralData: ICentralDataState,
) => {
  switch (openTab) {
    case LibraryTabEnum.FAVORITES: {
      // Favorites are fetched in full by id (getFav); filter + sort that set
      // client-side rather than routing through searchedGames, which is a
      // bounded index scan that starves at scale.
      const favTerm = (centralData.searchTerms ?? '').trim().toLowerCase();
      const filtered = favTerm
        ? centralData.favGames.filter((game) =>
            (game.title ?? '').toLowerCase().includes(favTerm),
          )
        : centralData.favGames;
      return sortFavorites(
        filtered,
        centralData.sort.field,
        centralData.sort.direction,
        SortType.listGameTemplatesByGrade,
        (game) => game.grade ?? '',
      );
    }
    case LibraryTabEnum.DRAFTS:
      if (isSearchResults) return centralData.searchedGames;
      return centralData.draftGames;
    case LibraryTabEnum.PRIVATE:
      if (isSearchResults) return centralData.searchedGames;
      return centralData.privateGames;
    case LibraryTabEnum.PUBLIC:
    default:
      if (isSearchResults) return centralData.searchedGames;
      return centralData.publicGames;
  }
};

export const getQuestionElements = (
  openTab: LibraryTabEnum,
  isSearchResults: boolean,
  centralData: ICentralDataState,
) => {
  switch (openTab) {
    case LibraryTabEnum.FAVORITES: {
      // Favorites are fetched in full by id (getFav); filter + sort that set
      // client-side rather than routing through searchedQuestions, which
      // starves at scale.
      const favTerm = (centralData.searchTerms ?? '').trim().toLowerCase();
      const filtered = favTerm
        ? centralData.favQuestions.filter((question) =>
            (question.title ?? '').toLowerCase().includes(favTerm),
          )
        : centralData.favQuestions;
      return sortFavorites(
        filtered,
        centralData.sort.field,
        centralData.sort.direction,
        SortType.listQuestionTemplatesByGrade,
        (question) => question.gradeFilter ?? '',
      );
    }
    case LibraryTabEnum.DRAFTS:
      if (isSearchResults) return centralData.searchedQuestions;
      return centralData.draftQuestions;
    case LibraryTabEnum.PRIVATE:
      if (isSearchResults) return centralData.searchedQuestions;
      return centralData.privateQuestions;
    case LibraryTabEnum.PUBLIC:
    default:
      if (isSearchResults) return centralData.searchedQuestions;
        return centralData.publicQuestions;
      
  }
};
