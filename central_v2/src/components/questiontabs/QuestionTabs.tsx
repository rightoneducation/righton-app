import React from 'react';
import {
  Box,
  Slide,
  Tabs,
  Grid,
  Modal
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
import { CardType, ScreenSize } from '../../lib/CentralModels';
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
  GridItem
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

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
}

export default function QuestionTabs({
  screenSize,
  isTabsOpen,
  question,
  questions,
  handleBackToExplore,
  handlePrevQuestion,
  handleNextQuestion,
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };
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
                <ButtonContainer>
                  <ButtonContainerLeft>
                    <CentralButton
                      buttonType={ButtonType.PREVIOUSQUESTION}
                      isEnabled
                      isOnQuestionTab
                      onClick={handlePrevQuestion}
                    />
                    <CentralButton
                      buttonType={ButtonType.BACKTOEXPLORE}
                      isEnabled
                      isOnQuestionTab
                      onClick={handleBackToExplore}
                    />
                  </ButtonContainerLeft>
                  <ButtonContainerRight>
                    <CentralButton 
                      buttonType={ButtonType.FAVORITE} 
                      isEnabled 
                      isOnQuestionTab
                    />
                    <CentralButton
                      buttonType={ButtonType.CLONEANDEDIT}
                      isEnabled
                      isOnQuestionTab
                    />
                    <CentralButton
                      buttonType={ButtonType.NEXTQUESTION}
                      isEnabled
                      isOnQuestionTab
                      onClick={handleNextQuestion}
                    />
                  </ButtonContainerRight>
                </ButtonContainer>
                <CardContainer style={{paddingBottom: '50px'}}>
                  {screenSize !== ScreenSize.LARGE &&
                    <OwnerTag screenSize={screenSize}/>
                  }
                  <DetailedQuestionContainer
                    container
                  >
                    <Grid
                      sm
                      md
                      item
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      {screenSize === ScreenSize.LARGE &&
                        <OwnerTag screenSize={screenSize}/>
                      }
                    </Grid>
                    <GridItem
                      sm={10}
                      md={12}
                      item
                      style={{
                        maxWidth: '672px',
                      }}
                    >
                      <DetailedQuestionCardBase screenSize={screenSize} question={question} />
                      <Grid
                        container
                        spacing={`${theme.sizing.smPadding}px`}
                      >
                        <SubCardGridItem 
                          item
                          sm={12}
                          md={6}
                        >
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
