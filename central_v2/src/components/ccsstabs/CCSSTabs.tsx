import React from 'react';
import {
  Box,
  Fade,
  Tabs,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
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
  SubCardGridItem
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface TabContainerProps {
  screenSize: ScreenSize;
  isTabsOpen: boolean;
}

export default function CCSSTabs({
  screenSize,
  isTabsOpen,
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
    <Fade
      in={isTabsOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
    >
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
              <CardContainer>
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
                  <Grid
                    sm={10}
                    md={12}
                    item
                    style={{
                      width: '100%',
                      maxWidth: '672px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: `${theme.sizing.smPadding}px`,
                    }}
                  >
                    
                    <Grid
                      container
                      spacing={`${theme.sizing.smPadding}px`}
                    >
                      <SubCardGridItem 
                        item
                        sm={12}
                        md={6}
                      />
                      <SubCardGridItem
                        item
                        sm={12}
                        md={6}
                      />
                    </Grid>
                  </Grid>
                  <Grid sm md item />
                </DetailedQuestionContainer>
              </CardContainer>
            </ContentContainer>
          </TabContent>
        </ContentFrame>
      </TabContainer>
    </Fade>
  );
}
