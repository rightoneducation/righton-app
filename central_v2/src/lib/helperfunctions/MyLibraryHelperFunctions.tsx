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
    case LibraryTabEnum.FAVORITES:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) =>
          centralData.userProfile?.favoriteGameTemplateIds?.includes(game.id),
        );
      return centralData.favGames;
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
    case LibraryTabEnum.FAVORITES:
      if (isSearchResults)
        return centralData.searchedQuestions.filter((question) =>
          centralData.userProfile?.favoriteQuestionTemplateIds?.includes(
            question.id,
          ),
        );
      return centralData.favQuestions;
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
