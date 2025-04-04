import React, { useState, useEffect, useCallback, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ElementType,
  GalleryType,
  SortDirection,
  SortType,
  IQuestionTemplate,
  IUserProfile,
  PublicPrivateType,
  GradeTarget
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { ScreenSize } from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import CardGallery from '../components/cardgallery/CardGallery';
import Recommended from '../components/explore/Recommended';
import SearchBar from '../components/searchbar/SearchBar';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';

interface ExploreQuestionsProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: () => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  loadMore: () => void;
}

export default function ExploreQuestions({
  screenSize,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  loadMore,
}:ExploreQuestionsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const centralData = useCentralDataState();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  if (!hasInitialized) {
    const needsFetch = centralData.recommendedQuestions.length === 0 || centralData.mostPopularQuestions.length === 0; 
    if (needsFetch) {
      fetchElements(); 
    }
    setHasInitialized(true);
  }
 
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const isSearchResults = centralData.searchTerms.length > 0;
  const handleView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen(true);
  };

  const handlePrevQuestion = () => {
    const index = questionSet.findIndex(
      (question) => question.id === selectedQuestion?.id,
    );
    if (index > 0) {
      setSelectedQuestion(questionSet[index - 1]);
    } else {
      setSelectedQuestion(questionSet[questionSet.length - 1]);
    }
  };

  const handleNextQuestion = () => {
    const index = questionSet.findIndex(
      (question) => question.id === selectedQuestion?.id,
    );
    if (index < questionSet.length - 1) {
      setSelectedQuestion(questionSet[index + 1]);
    } else {
      setSelectedQuestion(questionSet[0]);
    }
  };

  const handleBackToExplore = () => {
    setIsTabsOpen(false);
  };

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      {selectedQuestion && (
        <>
          <QuestionTabsModalBackground
            isTabsOpen={centralData.isTabsOpen}
            handleBackToExplore={handleBackToExplore}
          />
          <QuestionTabs
            screenSize={screenSize}
            isTabsOpen={centralData.isTabsOpen}
            question={selectedQuestion}
            questions={questionSet}
            handleBackToExplore={handleBackToExplore}
            handlePrevQuestion={handlePrevQuestion}
            handleNextQuestion={handleNextQuestion}
          />
        </>
      )}
      <ExploreGamesUpperContainer screenSize={screenSize}>
        {!isSearchResults && 
          <img src={mathSymbolsBackground} alt="Math Symbol Background" style={{width: '100%', height: '100%', position: 'absolute', bottom: '0', zIndex: 0, objectFit: 'none', overflow: 'hidden'}} />
        }
        <SearchBar
          screenSize={screenSize}
          searchTerms={centralData.searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
        {!isSearchResults && 
          <Recommended<IQuestionTemplate>
            screenSize={screenSize}
            recommendedElements={centralData.recommendedQuestions}
            elementType={ElementType.QUESTION}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        }
      </ExploreGamesUpperContainer>
      <InfiniteScroll
        dataLength={centralData.mostPopularQuestions.length}
        next={loadMore}
        hasMore={centralData.nextToken !== null}
        loader=<h4>loading...</h4>
        scrollableTarget="scrollableDiv"
        style={{
          width: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <CardGallery<IQuestionTemplate>
          screenSize={screenSize}
          searchTerm={isSearchResults ? centralData.searchTerms : undefined}
          grades={isSearchResults ? centralData.selectedGrades : undefined}
          galleryElements={isSearchResults ? centralData.searchedQuestions : centralData.mostPopularQuestions}
          elementType={ElementType.QUESTION}
           galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
          setIsTabsOpen={setIsTabsOpen}
          handleView={handleView}
          isLoading={centralData.isLoading}
        />
      </InfiniteScroll>
      <Box 
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexGrow: 1,
          backgroundColor: theme.palette.primary.creamBackgroundColor,
        }}
      />
    </ExploreGamesMainContainer>
  );
}
