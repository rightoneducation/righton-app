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
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';

interface LibraryTabsQuestionsProps<T extends IQuestionTemplate> {
  screenSize: ScreenSize;
  tabMap: { [key: number]: string };
  tabIconMap: { [key: number]: string };
  setIsTabsOpen: (isTabsOpen: boolean) => void;
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
  screenSize,
  tabMap,
  tabIconMap,
  setIsTabsOpen,
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
const centralData = useCentralDataState();
const centralDataDispatch = useCentralDataDispatch();
const isSearchResults = centralData.searchTerms.length > 0;
const [openTab, setOpenTab] = React.useState(0);
const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  if (newValue === 3) {
    getFav(centralData.userProfile);
  } else if (newValue === 2) {
    getDrafts();
  } else {
    handlePublicPrivateChange(newValue === 1 ? PublicPrivateType.PRIVATE : PublicPrivateType.PUBLIC);
  }
  setOpenTab(newValue);
};

const getElements = () => {
  if (centralData.favQuestions.length > 0 && openTab === 3){
    if (isSearchResults)
      return centralData.searchedQuestions.filter((question) => centralData.favQuestions.map((favQuestion) => favQuestion.id).includes(question.id));
    return centralData.favQuestions;
  }
  if (centralData.draftQuestions.length > 0 && openTab === 2){
    return centralData.draftQuestions;
  }
  if (isSearchResults)
    return centralData.searchedQuestions 
  return centralData.mostPopularQuestions;
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
        searchTerms={centralData.searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
      <CardGallery<IQuestionTemplate>
        screenSize={screenSize}
        searchTerm={isSearchResults ? centralData.searchTerms : undefined}
        grades={isSearchResults ? centralData.selectedGrades : undefined}
        galleryElements={getElements()} 
        elementType={ElementType.QUESTION}
        galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
        setIsTabsOpen={setIsTabsOpen}
        handleView={handleView}
        isLoading={centralData.isLoading}
        isMyLibrary
      />
    </ContentContainer>
  </TabContent>
);
}