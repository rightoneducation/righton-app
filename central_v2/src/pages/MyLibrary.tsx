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
  IQuestionTemplate
} from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import { ScreenSize, GameQuestionType, LibraryTabEnum, UserStatusType } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import EditModal from '../components/modal/EditModal';
import ModalBackground from '../components/modal/ModalBackground';

interface MyLibraryProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType ) => void;
  fetchElements: (libraryTab?: LibraryTabEnum, searchTerms?: string, nextToken?: string | null,isFromLibrary?: boolean) => void;
  loadMoreLibrary: (libraryTab?: LibraryTabEnum, searchTerms?: string, nextToken?: string | null) => void;
}

export default function MyLibrary({ 
  gameQuestion,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  fetchElements,
  loadMoreLibrary
}: MyLibraryProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const centralData = useCentralDataState(); 
  const centralDataDispatch = useCentralDataDispatch();
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleQuestionView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen(true);
  };

  const handleGameView = (element: IGameTemplate | IQuestionTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: null });
    navigate(`/library/games/${element.id}`);
  };

  const handleBackToExplore = () => {
     setSelectedQuestion(null);
  };

  const handleCloseQuestionTabs = () => {
    centralDataDispatch({
      type: 'SET_IS_TABS_OPEN',
      payload: false,
    });
  }

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
    navigate(`/clone/question/${selectedQuestion?.id}`);
  };

 const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditQuestion = () => {
    setIsTabsOpen(false);
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: selectedQuestion,
    });
    navigate(`/edit/question/${selectedQuestion?.id}`);
  }

  const handleDeleteButtonClick = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteQuestion = async () => {
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }

  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
      <ModalBackground isModalOpen={isEditModalOpen} handleCloseModal={handleCloseModal}/>
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
          questions={questionSet}
          setIsTabsOpen={setIsTabsOpen}
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
        />
      </>
      {centralData.userStatus === UserStatusType.LOADING
        ? <CircularProgress style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',   color: theme.palette.primary.darkBlueCardColor, zIndex: 1}}/>
        : <LibraryTabsContainer 
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
      }
    </MyLibraryMainContainer>
  );
}
