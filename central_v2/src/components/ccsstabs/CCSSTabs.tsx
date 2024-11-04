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
  CCSSPillContainer
} from '../../lib/styledcomponents/CCSSSTabsStyledComponents';
import { gradeMap, ccssMap, CCSSType } from '../../lib/CCSSModels';
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
  
  const getSelectedValue = (value: string) => {
    switch (value){
      case 'Domain':
        return domain;
      case 'Cluster':
        return cluster;
      case 'Standard':
        return standard;
      case 'Grade':
      default:
        return grade;
    }
  }

  const tabContentSwitch = useCallback(() => {
    switch (openTab) {
      case 3: {
        const gradeObject = ccssMap.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          const domainObject = gradeObject.domains.find((ccssDomain) => ccssDomain.key === domain);
          if (domainObject){
            const clusterObject = domainObject.clusters.find((ccssCluster) => ccssCluster.key === cluster);
            if (clusterObject){
              return (
                <CCSSPillContainer container rowSpacing={2} direction="column" style={{alignItems: 'flex-start'}}>
                  {clusterObject.standards?.map((ccssStandard) => (
                      <CCSSIndicatorPill key={ccssStandard.key} description={ccssStandard.desc} label={ccssStandard.key} onClick={()=> setStandard(ccssStandard.key)} type={CCSSType.STANDARD}/>
                    ))
                  }
                </CCSSPillContainer>
              )
            }
          }
        }
        return null;
      }
      case 2: {
        const gradeObject = ccssMap.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          const domainObject = gradeObject.domains.find((ccssDomain) => ccssDomain.key === domain);
          if (domainObject){
            return (
              <CCSSPillContainer container rowSpacing={2} direction="column" style={{alignItems: 'flex-start'}}>
                {domainObject.clusters.map((ccssCluster) => (
                    <CCSSIndicatorPill key={ccssCluster.key} description={ccssCluster.desc} label={ccssCluster.key} onClick={()=> setCluster(ccssCluster.key)} type={CCSSType.CLUSTER}/>
                  ))
                }
              </CCSSPillContainer>
            )
          }
        }
        return null;
      }
      case 1: {
        const gradeObject = ccssMap.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          return (
            <CCSSPillContainer container rowSpacing={2} direction="column" style={{alignItems: 'flex-start'}}>
              {gradeObject.domains.map((ccssDomain) => (
                  <CCSSIndicatorPill key={ccssDomain.key} description={ccssDomain.desc} label={ccssDomain.key} onClick={()=> setDomain(ccssDomain.key)} type={CCSSType.DOMAIN}/>
                ))
              }
            </CCSSPillContainer>
          )
        }
        return null;
      }
      case 0:
      default:
       return (
        <CCSSPillContainer container rowSpacing={2}>
          {ccssMap.map((ccssGrade) => (
            <CCSSIndicatorPill key={ccssGrade.key} description={ccssGrade.desc} onClick={()=> setGrade(ccssGrade.key)}  type={CCSSType.GRADE}/>
          ))}
        </CCSSPillContainer>
      )
    }
  },[openTab]); // eslint-disable-line 

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
                const selectedValue = getSelectedValue(value);
                console.log(selectedValue)
                return (
                  <StyledTab
                    key={uuidv4()}
                    icon={
                      <LabelCircle selectedValue={selectedValue} isSelected={isSelected}/>
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
               {tabContentSwitch()}
            </CCSSContentContainer>
          </TabContent>
        </CCSSContentFrame>
      </CCSSTabContainer>
    </Fade>
  );
}
