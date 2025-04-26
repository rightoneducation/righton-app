import React, { useState } from 'react';
import {
  Box,
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
import { getQuestionElements, getTabLabel } from '../../lib/helperfunctions/MyLibraryHelperFunctions';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import { ICentralDataState } from '../../lib/context/ICentralDataState';

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
  fetchElements: (libraryTab: LibraryTabEnum) => void;
  handleView: (element: T, elements: T[]) => void;
  loadMore: () => void;
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
  fetchElements,
  handleView,
  loadMore,
}: LibraryTabsQuestionsProps<IQuestionTemplate>) {
  const centralData = useCentralDataState();
  
  const isSearchResults = centralData.searchTerms.length > 0;
  const tabIndexToEnum: { [key: number]: LibraryTabEnum } = {
    0: LibraryTabEnum.PUBLIC,
    1: LibraryTabEnum.PRIVATE,
    2: LibraryTabEnum.FAVORITES,
  };
  
  const enumToTabIndex: { [key in LibraryTabEnum]?: number } = {
    [LibraryTabEnum.PUBLIC]: 0,
    [LibraryTabEnum.PRIVATE]: 1,
    [LibraryTabEnum.FAVORITES]: 2,
  };

  const tabs: LibraryTabEnum[] = [
    LibraryTabEnum.PUBLIC,
    LibraryTabEnum.PRIVATE,
    LibraryTabEnum.FAVORITES,
  ];

  const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(LibraryTabEnum.PUBLIC);
  const [hasInitialized, setHasInitialized] = useState(false);  
  if (!hasInitialized) {
    fetchElements(openTab); 
    setHasInitialized(true);
  }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      const newTabEnum = tabIndexToEnum[newValue];
      console.log("library enum", newTabEnum)
      setOpenTab(newTabEnum);
      fetchElements(newTabEnum);
    };
  
// const getElements = () => {
//   console.log('getElements', openTab);
//   console.log(centralData.favQuestions);
//   console.log('centralData: ', centralData);
  
//   if (centralData.favQuestions.length > 0 && openTab === LibraryTabEnum.FAVORITES){
//     if (isSearchResults)
//       return centralData.searchedQuestions.filter((question) => centralData.favQuestions.map((favQuestion) => favQuestion.id).includes(question.id));
//     return centralData.favQuestions;
//   }
//   // if (centralData.draftQuestions.length > 0 && openTab === 2){
//   //   return centralData.draftQuestions;
//   // }
//   // my example
//   if(centralData.privateQuestions && openTab === LibraryTabEnum.PRIVATE) {
//     if(isSearchResults) {
//       return centralData.searchedQuestions.filter(
//         (question) => centralData.privateQuestions.filter(
//           (privateQuestion) => privateQuestion.owner === centralData.userProfile.email).map(
//             (q) =>q.id).includes(question.id)
//           )
//     }
//     return centralData.privateQuestions.filter((question) => question.owner === centralData.userProfile.email)
//   }

//   if (isSearchResults)
//     return centralData.searchedQuestions 
//   return centralData.publicQuestions;
// }

const elements = getQuestionElements(openTab, isSearchResults, centralData)

console.log("elements", elements);
console.log("centralData: ", centralData)

return (
  <TabContent>
    <Tabs
      value={enumToTabIndex[openTab]}
      onChange={handleChange}
      TabIndicatorProps={{
        style: {
          display: 'none',
        },
      }}
    >
     {tabs.map((key) => {
             const value = tabMap[key];
             const isSelected = openTab === key;
             const label = getTabLabel(screenSize, isSelected, value);
             return (
               <LibraryTab
                 key={uuidv4()}
                 icon={
                   <img
                     src={tabIconMap[key]}
                     alt={value}
                     style={{ 
                       opacity: openTab === key ? 1 : 0.5, 
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
                 label={label}
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
        galleryElements={elements as IQuestionTemplate[]} 
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