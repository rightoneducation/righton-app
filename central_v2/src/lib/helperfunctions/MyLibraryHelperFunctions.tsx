import {
  ICentralDataState,
  LibraryTabEnum,
  ScreenSize,
} from '../CentralModels';

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
      // Favorites are fetched in full by id (getFav); filter that set
      // client-side by search term rather than routing through searchedGames,
      // which is a bounded index scan that starves at scale.
      const favTerm = (centralData.searchTerms ?? '').trim().toLowerCase();
      return favTerm
        ? centralData.favGames.filter((game) =>
            (game.title ?? '').toLowerCase().includes(favTerm),
          )
        : centralData.favGames;
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
      // Favorites are fetched in full by id (getFav); filter that set
      // client-side by search term rather than routing through
      // searchedQuestions, which starves at scale.
      const favTerm = (centralData.searchTerms ?? '').trim().toLowerCase();
      return favTerm
        ? centralData.favQuestions.filter((question) =>
            (question.title ?? '').toLowerCase().includes(favTerm),
          )
        : centralData.favQuestions;
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
