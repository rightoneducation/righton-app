import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Slide,
  Tabs,
  Grid,
  Modal,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabPublic.svg';
import tabMyQuestionsIcon from '../../images/tabMyQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import DetailedQuestionCardBase from '../cards/detailedquestion/DetailedQuestionCardBase';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import { CardType, ScreenSize, UserStatusType } from '../../lib/CentralModels';
import OwnerTag from '../profile/OwnerTag';
import {
  TabContainer,
  ContentFrame,
  TabContent,
  StyledTab,
  DetailedQuestionContainer,
  ContentContainer,
  ButtonContainer,
  ButtonContainerLeft,
  ButtonContainerRight,
  CardContainer,
  SubCardGridItem,
  GridItem,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';

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
  handleBackToExplore,
  handlePrevQuestion,
  handleNextQuestion,
  handleCloneButtonClick,
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const isScreenLgst = useMediaQuery('(min-width: 1200px)');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const isFavorite =
    centralData.userProfile?.favoriteGameTemplateIds?.includes(question.id) ??
    false;

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
    const response = await apiClients.centralDataManager?.favoriteGameTemplate(
      question.id,
      centralData.userProfile,
    );
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
              <ContentContainer>
                {screenSize !== ScreenSize.SMALL && (
                  <ButtonContainer>
                    <ButtonContainerLeft>
                      <CentralButton
                        buttonType={ButtonType.PREVIOUSQUESTION}
                        isEnabled
                        isOnQuestionTab
                        iconOnlyOverride={!isScreenLgst}
                        onClick={handlePrevQuestion}
                      />
                      <CentralButton
                        buttonType={ButtonType.BACKTOEXPLORE}
                        isEnabled
                        isOnQuestionTab
                        iconOnlyOverride={!isScreenLgst}
                        onClick={handleBackToExplore}
                      />
                    </ButtonContainerLeft>
                    <ButtonContainerLeft>
                      <ButtonContainerRight>
                        {centralData.userStatus === UserStatusType.LOGGEDIN && (
                          <Box>
                            {!isLoading ? (
                              <CentralButton
                                buttonType={
                                  !isFavorite
                                    ? ButtonType.FAVORITE
                                    : ButtonType.UNFAVORITE
                                }
                                isEnabled
                                isOnQuestionTab
                                iconOnlyOverride={!isScreenLgst}
                                onClick={handleFavoriteButtonClick}
                              />
                            ) : (
                              <Box>
                                <CircularProgress style={{ color: '#FFF' }} />
                              </Box>
                            )}
                          </Box>
                        )}
                        <Box>
                          <CentralButton
                            buttonType={ButtonType.CLONEANDEDIT}
                            isEnabled
                            isOnQuestionTab
                            iconOnlyOverride={!isScreenLgst}
                            onClick={handleCloneButtonClick}
                          />
                        </Box>
                        <CentralButton
                          buttonType={ButtonType.NEXTQUESTION}
                          isEnabled
                          isOnQuestionTab
                          iconOnlyOverride={!isScreenLgst}
                          onClick={handleNextQuestion}
                        />
                      </ButtonContainerRight>
                    </ButtonContainerLeft>
                  </ButtonContainer>
                )}
                <CardContainer
                  style={{ paddingBottom: '60px' }}
                >
                  <DetailedQuestionContainer
                    container
                    sx={{ gap: screenSize === ScreenSize.SMALL ? "0px" : `${theme.sizing.mdPadding}`}}
                  >
                    <Grid
                      sm
                      md
                      item
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      {screenSize === ScreenSize.LARGE && (
                        <OwnerTag screenSize={screenSize} />
                      )}
                    </Grid>
                    <GridItem
                      screenSize={screenSize}
                      sm={10}
                      md={12}
                      item
                      style={{
                        maxWidth: '672px',
                      }}
                    >
                      {screenSize === ScreenSize.SMALL && (
                        <>
                          <ButtonContainer sx={{ paddingTop: 0 }}>
                            <ButtonContainerLeft>
                              <CentralButton
                                buttonType={ButtonType.PREVIOUSQUESTION}
                                isEnabled
                                isOnQuestionTab
                                iconOnlyOverride={!isScreenLgst}
                                onClick={handlePrevQuestion}
                              />
                              <CentralButton
                                buttonType={ButtonType.BACKTOEXPLORE}
                                isEnabled
                                isOnQuestionTab
                                iconOnlyOverride={!isScreenLgst}
                                onClick={handleBackToExplore}
                              />
                            </ButtonContainerLeft>
                            <ButtonContainerLeft>
                              <ButtonContainerRight>
                                <CentralButton
                                  buttonType={ButtonType.NEXTQUESTION}
                                  isEnabled
                                  isOnQuestionTab
                                  iconOnlyOverride={!isScreenLgst}
                                  onClick={handleNextQuestion}
                                />
                              </ButtonContainerRight>
                              <ButtonContainerRight>
                                {centralData.userStatus ===
                                  UserStatusType.LOGGEDIN && (
                                  <Box>
                                    {!isLoading ? (
                                      <CentralButton
                                        buttonType={
                                          !isFavorite
                                            ? ButtonType.FAVORITE
                                            : ButtonType.UNFAVORITE
                                        }
                                        isEnabled
                                        isOnQuestionTab
                                        iconOnlyOverride={!isScreenLgst}
                                        onClick={handleFavoriteButtonClick}
                                      />
                                    ) : (
                                      <Box>
                                        <CircularProgress
                                          style={{ color: '#FFF' }}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                )}
                                <Box>
                                  <CentralButton
                                    buttonType={ButtonType.CLONEANDEDIT}
                                    isEnabled
                                    isOnQuestionTab
                                    iconOnlyOverride={!isScreenLgst}
                                    onClick={handleCloneButtonClick}
                                  />
                                </Box>
                              </ButtonContainerRight>
                            </ButtonContainerLeft>
                          </ButtonContainer>
                          <OwnerTag screenSize={screenSize} />
                        </>
                      )}

                      <DetailedQuestionCardBase
                        screenSize={screenSize}
                        question={question}
                      />
                      <Grid container spacing={`${theme.sizing.smPadding}px`}>
                        <SubCardGridItem item sm={12} md={6}>
                          <DetailedQuestionSubCard
                            cardType={CardType.CORRECT}
                            answer={
                              question?.choices?.find((answer) => answer.isAnswer)
                                ?.text ?? ''
                            }
                            instructions={question?.instructions ?? []}
                          />
                        </SubCardGridItem>
                        <SubCardGridItem
                          item
                          sm={12}
                          md={6}
                        >
                          {question &&
                            question.choices
                              ?.filter((choice) => !choice.isAnswer)
                              .map((choice, index) => (
                                <DetailedQuestionSubCard
                                  key={uuidv4()}
                                  cardType={CardType.INCORRECT}
                                  answer={choice.text}
                                  answerReason={choice.reason}
                                />
                              ))}
                        </SubCardGridItem>
                      </Grid>
                    </GridItem>
                    <Grid sm md item />
                  </DetailedQuestionContainer>
                </CardContainer>
              </ContentContainer>
            </TabContent>
          </ContentFrame>
        </TabContainer>
      </Slide>
    </Modal>
  );
}
