import { ICentralDataState, LibraryTabEnum, ScreenSize } from '../CentralModels';

export const getTabLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE)
      return value;
    if (screen === ScreenSize.MEDIUM && isSelected)
     return value;
    return '';
}

export const getGameElements = (openTab: LibraryTabEnum, isSearchResults: boolean, centralData: ICentralDataState) => {
  switch (openTab){
    case LibraryTabEnum.FAVORITES:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.favGames.map((favGame) => favGame.id).includes(game.id));
      return centralData.favGames;
    case LibraryTabEnum.DRAFTS:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.draftGames.map((draftGame) => draftGame.id).includes(game.id));
      return centralData.draftGames;
    case LibraryTabEnum.PRIVATE:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.privateGames.map((privateGame) => privateGame.id).includes(game.id));
      return centralData.privateGames;
    case LibraryTabEnum.PUBLIC:
    default:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.publicGames.map((publicGame) => publicGame.id).includes(game.id));
      return centralData.publicGames;
  }
}

export const getQuestionElements = (openTab: LibraryTabEnum, isSearchResults: boolean, centralData: ICentralDataState) => {
  switch (openTab){
    case LibraryTabEnum.FAVORITES:
      if (isSearchResults)
        return centralData.searchedQuestions.filter((question) => centralData.favQuestions.map((favQuestion) => favQuestion.id).includes(question.id));
      return centralData.favQuestions;
    case LibraryTabEnum.DRAFTS:
      if (isSearchResults)
        return centralData.searchedQuestions.filter((question) => centralData.draftQuestions.map((draftQuestion) => draftQuestion.id).includes(question.id));
      return centralData.draftQuestions;
    case LibraryTabEnum.PRIVATE:
      if (isSearchResults)
        return centralData.searchedQuestions.filter((question) => centralData.privateQuestions.map((privateQuestion) => privateQuestion.id).includes(question.id));
      return centralData.privateQuestions;
    case LibraryTabEnum.PUBLIC:
    default:
      if (isSearchResults)
        return centralData.searchedQuestions.filter((question) => centralData.publicQuestions.map((publicQuestion) => publicQuestion.id).includes(question.id));
      if (centralData.publicQuestions.length > 0)
        return centralData.publicQuestions;
      return centralData.recommendedQuestions;
  }
}