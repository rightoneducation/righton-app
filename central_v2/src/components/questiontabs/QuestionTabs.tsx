import React from 'react';
import {
  Slide,
  Tabs,
  Modal,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { 
  IQuestionTemplate,
  IGameTemplate,
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection, 
} from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabPublic.svg';
import tabMyQuestionsIcon from '../../images/tabMyQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import { ScreenSize, LibraryTabEnum, GameQuestionType, UserStatusType } from '../../lib/CentralModels';
import {
  TabContainer,
  ContentFrame,
  TabContent,
  StyledTab,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';
import QuestionTabsSelectedQuestion from './QuestionTabsSelectedQuestion';
import LibraryTabsContent from '../librarytabs/LibraryTabsContent';

interface TabContainerProps {
  isTabsOpen: boolean;
  question: IQuestionTemplate | null;
  questions: IQuestionTemplate[];
}

interface TabContainerProps {
  screenSize: ScreenSize;
  isTabsOpen: boolean;
  question: IQuestionTemplate | null;
  questions: IQuestionTemplate[];
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  setSelectedQuestion: (question: IQuestionTemplate | null) => void;
  fetchElements: (libraryTab: LibraryTabEnum, searchTerms?: string) => void;
  handleBackToExplore: () => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleCloneButtonClick: () => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType ) => void;
  handleQuestionView: (element: IQuestionTemplate, elements: IQuestionTemplate[]) => void;
  handleCloseQuestionTabs: () => void;
}

export default function QuestionTabs({
  screenSize,
  isTabsOpen,
  question,
  questions,
  setIsTabsOpen,
  fetchElements,
  setSelectedQuestion,
  handleBackToExplore,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  handleQuestionView,
  handleCloseQuestionTabs
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(LibraryTabEnum.PUBLIC);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');
  const handleChange = (event: React.SyntheticEvent, newTab: LibraryTabEnum) => {
    centralDataDispatch({ type: 'SET_SELECTED_QUESTION', payload: null });
    setOpenTab(newTab);
    setSelectedQuestion(null);
    fetchElements(newTab, '');
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const isFavorite =  question
    ? (centralData.userProfile?.favoriteGameTemplateIds?.includes(question.id) ?? false)
    : false;

  const tabMap: { [key: number]: string } = {
    0: 'Explore Questions',
    1: 'My Questions',
    2: 'Drafts',
    3: 'Favorites',
  };

  const tabIconMap: { [key: number]: string } = {
    0: tabExploreQuestionsIcon,
    1: tabMyQuestionsIcon,
    2: tabDraftsIcon,
    3: tabFavoritesIcon,
  };
  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE) return value;
    if (screen === ScreenSize.MEDIUM && isSelected) return value;
    return '';
  };

  const handleFavoriteButtonClick = async () => {
    setIsLoading(true);
    if (!question) return;
    const response = await apiClients.centralDataManager?.favoriteQuestionTemplate(question.id, centralData.userProfile);
    if (response) {
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: response });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      disableAutoFocus
      open={isTabsOpen}
      onClose={handleCloseQuestionTabs}
      closeAfterTransition
      disableScrollLock
    >
    <Slide direction="up" in={isTabsOpen} timeout={1000} mountOnEnter unmountOnExit>
        <TabContainer>
          <ContentFrame>
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
                { centralData.userStatus === UserStatusType.LOGGEDIN ?
                Object.entries(tabMap).map(([key, value], index) => {
                  const numericKey = Number(key);
                  const isSelected = openTab === numericKey;
                  return (
                    <StyledTab
                      key={uuidv4()}
                      icon={
                        <img
                          src={tabIconMap[numericKey]}
                          alt={value}
                          style={{ opacity: openTab === numericKey ? 1 : 0.5, padding: 0 }}
                        />
                      }
                      iconPosition="start"
                      label={getLabel(screenSize, isSelected, value)}
                      isSelected={isSelected}
                      style={{ marginRight: '8px' }}
                    />
                  );
                })
                :  
                  <StyledTab
                      key={uuidv4()}
                      icon={
                        <img
                          src={tabIconMap[0]}
                          alt={tabMap[0]}
                          style={{padding: 0 }}
                        />
                      }
                      iconPosition="start"
                      label={getLabel(screenSize, true, tabMap[0])}
                      isSelected
                      style={{ marginRight: '8px' }}
                    />
                }
              </Tabs>
              { question 
                ? <QuestionTabsSelectedQuestion
                    screenSize={screenSize}
                    question={question}
                    isLoading={isLoading}
                    handleBackToExplore={handleBackToExplore}
                    handlePrevQuestion={handlePrevQuestion}
                    handleNextQuestion={handleNextQuestion}
                    handleCloneButtonClick={handleCloneButtonClick}
                    handleFavoriteButtonClick={handleFavoriteButtonClick}
                    isFavorite={isFavorite}
                  />
                : 
                <LibraryTabsContent
                  openTab={openTab}
                  gameQuestion={GameQuestionType.QUESTION}
                  screenSize={screenSize}
                  setIsTabsOpen={setIsTabsOpen}
                  handleChooseGrades={handleChooseGrades}
                  handleSortChange={handleSortChange}
                  handleSearchChange={handleSearchChange}
                  handleQuestionView={handleQuestionView}
                />
              }
            </TabContent>
          </ContentFrame>
        </TabContainer>
      </Slide>
    </Modal>
  );
}
