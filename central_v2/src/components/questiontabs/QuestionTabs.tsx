import React from 'react';
import {
  Slide,
  Tabs,
  Modal,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabPublic.svg';
import tabMyQuestionsIcon from '../../images/tabMyQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import { ScreenSize, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  TabContainer, 
  ContentFrame, 
  TabContent, 
  StyledTab, 
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import QuestionTabsSelectedQuestion from './QuestionTabsSelectedQuestion';

interface TabContainerProps {
  isTabsOpen: boolean;
  question: IQuestionTemplate;
  questions: IQuestionTemplate[];
}

interface TabContainerProps {
  screenSize: ScreenSize;
  isTabsOpen: boolean;
  question: IQuestionTemplate;
  questions: IQuestionTemplate[];
  fetchElements: (libraryTab: LibraryTabEnum, searchTerms?: string) => void;
  handleBackToExplore: () => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleCloneButtonClick: () => void;
}

export default function QuestionTabs({
  screenSize,
  isTabsOpen,
  question,
  questions,
  fetchElements,
  handleBackToExplore,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
    fetchElements(newValue);
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const isFavorite = centralData.userProfile?.favoriteGameTemplateIds?.includes(question.id) ?? false;

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
    if (screen === ScreenSize.LARGE)
      return value;
    if (screen === ScreenSize.MEDIUM && isSelected)
     return value;
    return '';
  }

  const handleFavoriteButtonClick = async () => {
    setIsLoading(true);
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
      onClose={handleBackToExplore}
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
                {Object.entries(tabMap).map(([key, value], index) => {
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
                })}
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
                : <div style={{ padding: '20px', color: theme.palette.text.primary }}>No question selected</div>
              }
            </TabContent>
          </ContentFrame>
        </TabContainer>
      </Slide>
      </Modal>
  );
}
