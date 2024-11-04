import React, { useCallback } from 'react';
import {
  Box,
  Fade,
  Tabs,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
import tabMyQuestionsIcon from '../../images/tabMyQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import { ScreenSize } from '../../lib/CentralModels';
import OwnerTag from '../profile/OwnerTag';
import LabelCircle from './LabelCircle';
import { 
  TabContainer,  
  TabContent, 
  StyledTab, 
  DetailedQuestionContainer, 
  ContentContainer, 
  CardContainer,
  SubCardGridItem
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import {
  CCSSTabContainer,
  CCSSContentContainer,
  CCSSContentFrame,
  CCSSStyledTabs,
  CCSSGradeContainer
} from '../../lib/styledcomponents/CCSSSTabsStyledComponents';
import { gradeMap, ccssMap } from '../../lib/CCSSModels';
import CCSSIndicatorPill from './CCSSIndicatorPill';

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
    0: 'Grade',
    1: 'Domain',
    2: 'Cluster',
    3: 'Standard',
  };
  const [grade, setGrade] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [cluster, setCluster] = React.useState('');
  const [standard, setStandard] = React.useState('');

  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE)
      return value;
    if (screen === ScreenSize.MEDIUM && isSelected)
     return value;
    return '';
  }

  const tabContentSwitch = useCallback(() => {
    switch (openTab) {
      case 0:
      default:
        return (
          gradeMap.map((grade, index) => {
            return (
              <CCSSIndicatorPill label={ grade.long} />
            )
          })
        );
      // case 2:
      //   return ();
      // case 3:
      //   return <ComponentForTab4 />;
      // case 0:
      // default:
      //   return <ComponentForTab1 />;
    }
    },[openTab]);

  return (
    <Fade
      in={isTabsOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
    >
      <CCSSTabContainer>
        <CCSSContentFrame screenSize={screenSize}>
          <TabContent>
            <CCSSStyledTabs
              screenSize={screenSize}
              value={openTab}
              onChange={handleChange}
            >
              {Object.entries(tabMap).map(([key, value], index) => {
                const numericKey = Number(key);
                const isSelected = openTab === numericKey;
                return (
                  <StyledTab
                    key={uuidv4()}
                    icon={
                      <LabelCircle selectedValue='A' isSelected={isSelected}/>
                    }
                    iconPosition="end"
                    label={getLabel(screenSize, isSelected, value)}
                    isSelected={isSelected}
                    style={{ fontSize: '20px',  textTransform: 'none', gap: '8px' }}
                  />
                );
              })}
            </CCSSStyledTabs>
            <CCSSContentContainer screenSize={screenSize}>
              <CCSSGradeContainer container rowSpacing={2}>
               {tabContentSwitch()}
              </CCSSGradeContainer>
            </CCSSContentContainer>
          </TabContent>
        </CCSSContentFrame>
      </CCSSTabContainer>
    </Fade>
  );
}
