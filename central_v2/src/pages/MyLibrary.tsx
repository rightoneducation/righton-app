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
  IQuestionTemplate
} from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import { ScreenSize, GameQuestionType, LibraryTabEnum, UserStatusType } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';

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
  fetchElements: (libraryTab: LibraryTabEnum, searchTerms?: string) => void;
}

export default function MyLibrary({ 
  gameQuestion,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  fetchElements
}: MyLibraryProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const centralData = useCentralDataState(); 
  const centralDataDispatch = useCentralDataDispatch();
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);

  const handleQuestionView = (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen(true);
  };

  const handleBackToExplore = () => {
    setSelectedQuestion(null);
    setIsTabsOpen(false);
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

  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
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
                handleCloneButtonClick={handleCloneButtonClick}
              />
            </>
          )}
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
          />
      }
    </MyLibraryMainContainer>
  );
}
