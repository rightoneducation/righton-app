import React from 'react';
import {
  Tabs
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  ElementType,
  GalleryType,
  IQuestionTemplate,
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection
} from '@righton/networking';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import useExploreQuestionsStateManager from '../../hooks/useExploreQuestionsStateManager';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';

interface LibraryTabsQuestionsProps<T extends IQuestionTemplate> {
  gameQuestion: GameQuestionType;
  isTabsOpen: boolean;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  userProfile: IUserProfile;
  screenSize: ScreenSize;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
  recommendedQuestions: IQuestionTemplate[];
  mostPopularQuestions: IQuestionTemplate[];
  searchedQuestions: IQuestionTemplate[];
  draftQuestions: IQuestionTemplate[];
  favQuestions: IQuestionTemplate[];
  nextToken: string | null;
  isLoading: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  tabMap: { [key: number]: string };
  tabIconMap: { [key: number]: string };
  getLabel: (screen: ScreenSize, isSelected: boolean, value: string) => string;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType ) => void;
  getFav: (user: IUserProfile) => void;
  getDrafts: () => void;
  loadMore: () => void;
  handleView: (element: T, elements: T[]) => void;
}

export default function LibraryTabsQuestions({
  gameQuestion,
  isTabsOpen,
  setIsTabsOpen,
  userProfile,
  screenSize,
  setIsUserLoggedIn,
  recommendedQuestions,
  mostPopularQuestions,
  searchedQuestions,
  draftQuestions,
  favQuestions,
  nextToken,
  isLoading,
  searchTerms,
  selectedGrades,
  isFavTabOpen,
  publicPrivate,
  tabMap,
  tabIconMap,
  getLabel,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  getFav,
  getDrafts,
  loadMore,
  handleView
}: LibraryTabsQuestionsProps<IQuestionTemplate>) {
const isSearchResults = searchTerms.length > 0;
const [openTab, setOpenTab] = React.useState(0);
const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  if (newValue === 3) {
    getFav(userProfile);
  } else {
    handlePublicPrivateChange(newValue === 1 ? PublicPrivateType.PRIVATE : PublicPrivateType.PUBLIC);
  }
  setOpenTab(newValue);
};

const getElements = () => {
  if (favQuestions.length > 0 && openTab === 3){
    if (isSearchResults)
      return searchedQuestions.filter((question) => favQuestions.map((favQuestion) => favQuestion.id).includes(question.id));
    return favQuestions;
  }
  if (isSearchResults)
    return searchedQuestions 
  return mostPopularQuestions;
}

return (
  <TabContent>
    <Tabs
      value={openTab}
      onChange={handleChange}
      TabIndicatorProps={{
        style: {
          display: 'none',
        },
      }}
    >
      {Object.entries(tabMap).map(([key, value], index) => {
        const numericKey = Number(key);
        const isSelected = openTab === numericKey;
        return (
          <LibraryTab
            key={uuidv4()}
            icon={
              <img
                src={tabIconMap[numericKey]}
                alt={value}
                style={{ 
                  opacity: openTab === numericKey ? 1 : 0.5, 
                  paddingTop: 0,
                  paddingLeft: 0,
                  paddingRight: '12px',
                  paddingBottom: 0,
                  height: '30px',
                  width: '30px',
                  margin: 0
                }}
              />
            }
            iconPosition="start"
            label={getLabel(screenSize, isSelected, value)}
            isSelected={isSelected}
            style={{ display: 'flex', alignItems: 'center', marginRight: '12px', textTransform: 'none', fontFamily: 'Karla', fontSize: 20, fontWeight: 600, padding: '16px', boxSizing: 'border-box' }}
          />
        );
      })}
    </Tabs>
    <ContentContainer>
      <SearchBar
        screenSize={screenSize}
        searchTerms={searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
      <CardGallery<IQuestionTemplate>
        screenSize={screenSize}
        searchTerm={isSearchResults ? searchTerms : undefined}
        grades={isSearchResults ? selectedGrades : undefined}
        galleryElements={getElements()} 
        elementType={ElementType.QUESTION}
        galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
        setIsTabsOpen={setIsTabsOpen}
        handleView={handleView}
        isLoading={isLoading}
        isMyLibrary
      />
    </ContentContainer>
  </TabContent>
);
}