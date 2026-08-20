import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, Box } from '@mui/material';
import {
  ElementType,
  GalleryType,
  SortDirection,
  SortType,
  IQuestionTemplate,
  PublicPrivateType,
  GradeTarget,
} from '@righton/networking';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import {
  ScreenSize,
  GameQuestionType,
  ISelectedGame,
  ISelectedQuestion,
  LibraryTabEnum
} from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import QuestionsLibraryGallery from '../components/cardgallery/QuestionsLibraryGallery';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';
import Recommended from '../components/explore/Recommended';
import SearchBar from '../components/searchbar/SearchBar';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';
import EditModal from '../components/modal/EditModal';
import ModalBackground from '../components/modal/ModalBackground';

interface ExploreQuestionsProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  viewQuestion: (
    question: IQuestionTemplate,
  ) => Promise<ISelectedQuestion>;
  fetchElements: () => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  loadMore: () => void;
  loadMoreLibrary: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
  ) => void;
  deleteQuestionTemplate: (
    questionId: string,
    type: PublicPrivateType,
  ) => Promise<void>;
}

export default function ExploreQuestions({
  screenSize,
  setIsTabsOpen,
  viewQuestion,
  fetchElements,
  handlePublicPrivateChange,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  loadMore,
  loadMoreLibrary,
  deleteQuestionTemplate,
}: ExploreQuestionsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // mirrors the isLibraryInit lifecycle in LibraryTabs -- see ExploreGames
  useEffect(() => {
    if (centralData.isExploreInit) {
      centralDataDispatch({ type: 'SET_IS_EXPLORE_INIT', payload: false });
      const needsFetch =
        centralData.recommendedQuestions.length === 0 ||
        centralData.mostPopularQuestions.length === 0;
      if (needsFetch) {
        centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
        fetchElements();
      }
    }
  }, [centralData.isExploreInit]); // eslint-disable-line react-hooks/exhaustive-deps

  const [openQuestionTab, setOpenQuestionTab] = React.useState<LibraryTabEnum>(
    LibraryTabEnum.PUBLIC,
  );

  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [originalSelectedQuestion, setOriginalSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const isSearchResults = centralData.searchTerms.length > 0;
  const galleryQuestions = isSearchResults
    ? centralData.searchedQuestions
    : centralData.mostPopularQuestions;
  const handleView = async (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    if (centralData.isTabsOpen === false)
      setOriginalSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen(true);
    const selectedQ = await viewQuestion(question);
    if ('question' in selectedQ && selectedQ && selectedQ.question) {
      setSelectedQuestion(selectedQ.question);
      if (centralData.isTabsOpen === false)
        setOriginalSelectedQuestion(selectedQ.question);
    }
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
    setSelectedQuestion(null);
  };

  const handleCloseQuestionTabs = () => {
    centralDataDispatch({
      type: 'SET_IS_TABS_OPEN',
      payload: false,
    });
  };

  const handleCloneButtonClick = () => {
    setIsTabsOpen(false);
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: selectedQuestion,
    });
    navigate(
      `/clone/question/${selectedQuestion?.publicPrivateType}/${selectedQuestion?.id}`,
    );
  };

  const handleEditQuestion = () => {
    setIsTabsOpen(false);
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: selectedQuestion,
    });
    navigate(
      `/edit/question/${selectedQuestion?.publicPrivateType}/${selectedQuestion?.id}`,
    );
  };

  const handleEditButtonClick = () => {
    if (selectedQuestion?.publicPrivateType === PublicPrivateType.PUBLIC) {
      setIsEditModalOpen(true);
    } else {
      handleEditQuestion();
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      if (selectedQuestion) {
        await deleteQuestionTemplate(
          selectedQuestion.id,
          selectedQuestion.publicPrivateType,
        );
        setIsDeleteModalOpen(false);
        setSelectedQuestion(null);
        centralDataDispatch({ type: 'SET_SELECTED_QUESTION', payload: null });
        centralDataDispatch({
          type: 'SET_IS_TABS_OPEN',
          payload: false,
        });
        centralDataDispatch({
          type: 'SET_SEARCH_TERMS',
          payload: '',
        });
        fetchElements();
        navigate('/questions');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (selectedQuestion?.publicPrivateType === PublicPrivateType.PUBLIC) {
      setIsDeleteModalOpen(true);
    } else {
      handleDeleteQuestion();
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      <ModalBackground
        isModalOpen={isEditModalOpen}
        handleCloseModal={handleCloseModal}
      />
      <EditModal
        isModalOpen={isEditModalOpen}
        gameQuestion={GameQuestionType.QUESTION}
        setIsModalOpen={setIsEditModalOpen}
        handleProceedToEdit={handleEditQuestion}
      />
      <EditModal
        isModalOpen={isDeleteModalOpen}
        gameQuestion={GameQuestionType.QUESTION}
        setIsModalOpen={setIsDeleteModalOpen}
        handleProceedToEdit={handleDeleteQuestion}
      />
      <>
        <QuestionTabsModalBackground
          isTabsOpen={centralData.isTabsOpen}
          handleBackToExplore={handleBackToExplore}
        />
        <QuestionTabs
          screenSize={screenSize}
          isTabsOpen={centralData.isTabsOpen}
          question={selectedQuestion}
          originalSelectedQuestion={originalSelectedQuestion}
          questions={questionSet}
          setQuestionSet={setQuestionSet}
          setIsTabsOpen={setIsTabsOpen}
          viewQuestion={viewQuestion}
          fetchElements={fetchElements}
          setSelectedQuestion={setSelectedQuestion}
          handleCloseQuestionTabs={handleCloseQuestionTabs}
          handleBackToExplore={handleBackToExplore}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
          handleCloneButtonClick={handleCloneButtonClick}
          handleEditButtonClick={handleEditButtonClick}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          handleQuestionView={handleView}
          loadMore={loadMore}
          openTab={openQuestionTab}
          setOpenTab={setOpenQuestionTab}
        />
      </>

      <ExploreGamesUpperContainer screenSize={screenSize}>
        {!isSearchResults && (
          <img
            src={mathSymbolsBackground}
            alt="Math Symbol Background"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              bottom: '0',
              zIndex: 0,
              objectFit: 'none',
              overflow: 'hidden',
            }}
          />
        )}
        <SearchBar
          isSearchResults={isSearchResults}
          screenSize={screenSize}
          searchTerms={centralData.searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
        {!isSearchResults && (
          <Recommended<IQuestionTemplate>
            screenSize={screenSize}
            recommendedElements={centralData.recommendedQuestions}
            elementType={ElementType.QUESTION}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        )}
      </ExploreGamesUpperContainer>
      <Box
        style={{
          width: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <QuestionsLibraryGallery
          screenSize={screenSize}
          galleryElements={galleryQuestions}
          handleView={handleView}
          // isLoading is global and viewQuestion flips it around its getUser
          // lookup, which would swap every card for a skeleton and back on each
          // View click. Only show skeletons when the grid is genuinely empty --
          // the same guard BrowseTemplates applies via pages.length === 0.
          // Searches still get them: debouncedSearch blanks the array first.
          isLoading={centralData.isLoading && galleryQuestions.length === 0}
          footer={
            <CentralButton
              buttonType={ButtonType.BROWSEALLQUESTIONS}
              isEnabled
              smallScreenOverride
              // matches the question card's button: card width less its 24px sides
              buttonWidthOverride={
                screenSize === ScreenSize.LARGE ? '336px' : '279px'
              }
              onClick={() => navigate('/browse/question')}
            />
          }
        />
      </Box>
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
