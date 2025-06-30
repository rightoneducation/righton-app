import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import {
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection,
  IGameTemplate,
  IQuestionTemplate,
} from '@righton/networking';
import {
  useCentralDataDispatch,
  useCentralDataState,
} from '../hooks/context/useCentralDataContext';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import {
  ScreenSize,
  GameQuestionType,
  LibraryTabEnum,
  UserStatusType,
  ISelectedGame,
  ISelectedQuestion,
} from '../lib/CentralModels';
import {
  MyLibraryMainContainer,
  MyLibraryBackground,
} from '../lib/styledcomponents/MyLibraryStyledComponent';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import EditModal from '../components/modal/EditModal';
import ModalBackground from '../components/modal/ModalBackground';

interface MyLibraryProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType) => void;
  fetchElement: (
    type: GameQuestionType,
    id: string,
    isTabsOpen: boolean,
    isPrivateQuestion?: boolean,
  ) => Promise<ISelectedGame | ISelectedQuestion>;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
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

export default function MyLibrary({
  gameQuestion,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  fetchElement,
  fetchElements,
  loadMoreLibrary,
  deleteQuestionTemplate,
}: MyLibraryProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [originalSelectedQuestion, setOriginalSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openQuestionTab, setOpenQuestionTab] = React.useState<LibraryTabEnum>(
    LibraryTabEnum.PUBLIC,
  );
  const handleQuestionView = async (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    const isPrivate = question.publicPrivateType === PublicPrivateType.PRIVATE;
    setIsTabsOpen(true);
    const selectedQ = await fetchElement(
      GameQuestionType.QUESTION,
      question.id,
      isPrivate,
    );
    if ('question' in selectedQ && selectedQ && selectedQ.question) {
      setSelectedQuestion(selectedQ.question);
      setQuestionSet(questions);
      if (centralData.isTabsOpen === false)
        setOriginalSelectedQuestion(selectedQ.question);
    }
    
  };

  const handleGameView = (element: IGameTemplate | IQuestionTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: element });
    navigate(`/library/games/${element.publicPrivateType}/${element.id}`);
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
        navigate('/library');
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
    <MyLibraryMainContainer>
      <MyLibraryBackground />
      <ModalBackground
        isModalOpen={isEditModalOpen || isDeleteModalOpen}
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
          originalSelectedQuestion={
           originalSelectedQuestion
          }
          questions={questionSet}
          setQuestionSet={setQuestionSet}
          openTab={openQuestionTab}
          setOpenTab={setOpenQuestionTab}
          setIsTabsOpen={setIsTabsOpen}
          fetchElement={fetchElement}
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
          handleQuestionView={handleQuestionView}
          loadMore={loadMoreLibrary}
        />
      </>
      {centralData.userStatus === UserStatusType.LOADING ? (
        <CircularProgress
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.palette.primary.darkBlueCardColor,
            zIndex: 1,
          }}
        />
      ) : (
        <LibraryTabsContainer
          gameQuestion={gameQuestion}
          screenSize={screenSize}
          setIsTabsOpen={setIsTabsOpen}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          fetchElements={fetchElements}
          handleQuestionView={handleQuestionView}
          loadMoreLibrary={loadMoreLibrary}
        />
      )}
    </MyLibraryMainContainer>
  );
}
