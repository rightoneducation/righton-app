import React from 'react';
import {
  Tabs
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
import tabMyQuestionsIcon from '../../images/tabMyQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import { ScreenSize } from '../../lib/CentralModels';
import { LibraryTab } from '../../lib/styledcomponents/MyLibraryStyledComponent';
import { 
  TabContainer, 
  ContentFrame, 
  TabContent, 
  ContentContainer, 
  CardContainer,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface TabContainerProps {
  screenSize: ScreenSize;
  questions: IQuestionTemplate[];
}

interface TabContainerProps {
  screenSize: ScreenSize;
  questions: IQuestionTemplate[];
}

export default function QuestionTabs({
  screenSize,
  questions,
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };
  const tabMap: { [key: number]: string } = {
    0: 'Public',
    1: 'Private',
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
                <LibraryTab
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
                  style={{ marginRight: '8px', textTransform: 'none' }}
                />
              );
            })}
          </Tabs>
          <ContentContainer>
            <CardContainer/>
          </ContentContainer>
        </TabContent>
      </ContentFrame>
    </TabContainer>
  );
}
