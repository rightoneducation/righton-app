import React from 'react';
import { useMediaQuery, CircularProgress, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IQuestionTemplate, GradeTarget, SortType, SortDirection } from '@righton/networking';
import QuestionTabsContent from './QuestionTabsContent';
import QuestionTabsSelectedQuestion from './QuestionTabsSelectedQuestion';
import {
  ScreenSize,
  UserStatusType,
  LibraryTabEnum,
  GameQuestionType,
} from '../../lib/CentralModels';
import {
  QTContentContainer,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import {
  useCentralDataState,
} from '../../hooks/context/useCentralDataContext';

interface TabContainerProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate | null;
  questions: IQuestionTemplate[];
  originalSelectedQuestion: IQuestionTemplate | null;
  openTab: LibraryTabEnum;
  isLoading: boolean;
  isFavorite: boolean;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleCloneButtonClick: () => void;
  handleEditButtonClick: () => void;
  handleFavoriteButtonClick: () => void;
  handleDeleteButtonClick: () => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handleQuestionView: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
  loadMore: () => void;
}

export default function QuestionTabsContentContainer({
  screenSize,
  question,
  questions,
  originalSelectedQuestion,
  openTab,
  isLoading,
  isFavorite,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick,
  handleEditButtonClick,
  handleFavoriteButtonClick,
  handleDeleteButtonClick,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handleQuestionView,
  loadMore,
}: TabContainerProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');
  const isEditEnabled =
    centralData.userStatus === UserStatusType.LOGGEDIN &&
    centralData.userProfile?.id === question?.userId;
  const tabContent = [ 
    (question || openTab === LibraryTabEnum.PUBLIC) ? (
        <QuestionTabsSelectedQuestion
          screenSize={screenSize}
          question={question}
          questions={questions}
          isLoading={isLoading}
          isFavorite={isFavorite}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
          handleCloneButtonClick={handleCloneButtonClick}
          handleEditButtonClick={handleEditButtonClick}
          handleFavoriteButtonClick={handleFavoriteButtonClick}
          handleDeleteButtonClick={handleDeleteButtonClick}
        />
      ) : (
          <QuestionTabsContent 
            screenSize={screenSize}
            openTab={openTab}
            setIsTabsOpen={()=> {}}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handleQuestionView={handleQuestionView}
            loadMore={loadMore}
          />
      )
  ]

  return (
    <QTContentContainer>
      { centralData.isLoading 
        ? 
          <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <CircularProgress style={{ color: '#FFF'}} />
          </Box>
        : tabContent
      }
    </QTContentContainer>
  );
}
