import React, { useState, useEffect, useCallback, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ElementType,
  GalleryType,
  IQuestionTemplate,
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import useExploreQuestionsStateManager from '../hooks/useExploreQuestionsStateManager';
import CardGallery from '../components/cardgallery/CardGallery';
import Recommended from '../components/explore/Recommended';
import SearchBar from '../components/searchbar/SearchBar';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';

interface ExploreQuestionsProps {
  screenSize: ScreenSize;
}

export default function ExploreQuestions({
  screenSize
}:ExploreQuestionsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const {
    recommendedQuestions,
    mostPopularQuestions,
    searchedQuestions,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions,
  } = useExploreQuestionsStateManager();
  
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);

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
            isTabsOpen={isTabsOpen}
            handleBackToExplore={handleBackToExplore}
          />
          <QuestionTabs
            screenSize={screenSize}
            isTabsOpen={isTabsOpen}
            question={selectedQuestion}
            questions={questionSet}
            handleBackToExplore={handleBackToExplore}
            handlePrevQuestion={handlePrevQuestion}
            handleNextQuestion={handleNextQuestion}
          />
        </>
      )}
      {searchTerms.length > 0 ? (
        <>
          <SearchBar
            screenSize={screenSize}
            searchTerms={searchTerms}
            handleSearchChange={handleSearchChange}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
          />
          <CardGallery<IQuestionTemplate>
            screenSize={screenSize}
            grades={selectedGrades}
            galleryElements={searchedQuestions}
            isLoading={isLoading}
            elementType={ElementType.QUESTION}
            galleryType={GalleryType.SEARCH_RESULTS}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        </>
      ) : (
        <>
          <ExploreGamesUpperContainer screenSize={screenSize}>
            <img src={mathSymbolsBackground} alt="Math Symbol Background" style={{width: '100%', height: '100%', position: 'absolute', bottom: '0', zIndex: 0, objectFit: 'cover'}} />
            <SearchBar
              screenSize={screenSize}
              searchTerms={searchTerms}
              handleSearchChange={handleSearchChange}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
            />
            <Recommended<IQuestionTemplate>
              screenSize={screenSize}
              recommendedElements={recommendedQuestions}
              elementType={ElementType.QUESTION}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleView}
            />
          </ExploreGamesUpperContainer>
          <InfiniteScroll
            dataLength={mostPopularQuestions.length}
            next={loadMoreQuestions}
            hasMore={nextToken !== null}
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
              galleryElements={mostPopularQuestions}
              elementType={ElementType.QUESTION}
              galleryType={GalleryType.MOST_POPULAR}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleView}
              isLoading={isLoading}
            />
          </InfiniteScroll>
        </>
      )}
    </ExploreGamesMainContainer>
  );
}
