import React, { useCallback } from 'react';
import {
  Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ScreenSize } from '../../lib/CentralModels';
import LabelCircle from './LabelCircle';
import { 
  TabContent, 
  StyledTab, 
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import {
  CCSSTabContainer,
  CCSSContentContainer,
  CCSSContentFrame,
  CCSSStyledTabs,
  CCSSPillContainer
} from '../../lib/styledcomponents/CCSSSTabsStyledComponents';
import { CCSSType } from '../../lib/CCSSModels';
import ccssDictionary from '../../lib/CCSSDictionary';
import CCSSIndicatorPill from './CCSSIndicatorPill';

interface TabContainerProps {
  screenSize: ScreenSize;
  isTabsOpen: boolean;
  handleCCSSSubmit: (ccss: string) => void;
}

export default function CCSSTabs({
  screenSize,
  isTabsOpen,
  handleCCSSSubmit
}: TabContainerProps) {
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
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

  const isTabTextValid = (value: string, tabType: CCSSType): boolean => {
    switch (tabType){
      case CCSSType.STANDARD: {
        let standardText = value;
        if (standardText.length > 1)
          standardText = standardText.charAt(0);
        const gradeObj = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        const domainObj = gradeObj?.domains.find((ccssDomain) => ccssDomain.key === domain);
        const clusterObj = domainObj?.clusters.find((ccssCluster) => ccssCluster.key === cluster);
        const testObj = clusterObj?.standards.find((ccssStandard) => ccssStandard.key === standardText);
        if (testObj?.subStandards && testObj.subStandards.length > 0){
          const subTestObj = testObj.subStandards.find((subStandard) => subStandard.key === value);
          return subTestObj !== undefined;
        }
        return testObj !== undefined
      }
      case CCSSType.CLUSTER:{
        const gradeObj = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        const domainObj = gradeObj?.domains.find((ccssDomain) => ccssDomain.key === domain);
        const testObj = domainObj?.clusters.find((ccssCluster) => ccssCluster.key === value);
        return testObj !== undefined;
      }
      case CCSSType.DOMAIN:{
        const gradeObj = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        const testObj = gradeObj?.domains.find((ccssDomain) => ccssDomain.key === value);
        return testObj !== undefined;
      }
      case CCSSType.GRADE:
      default:{
        const testObj = ccssDictionary.find((ccssGrade) => ccssGrade.key === value);
        console.log(testObj);
        return !(!testObj || testObj === undefined);
      }
    }
  };
  
  const handleTabTextChange = (tab: CCSSType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    switch (tab){
      case CCSSType.STANDARD:{
        const text = value.toLowerCase();
        setStandard(text);
        if (isTabTextValid(text, tab))
          handleCCSSSubmit(`${grade}.${domain}.${cluster}.${text}`);
        break;
      }
      case CCSSType.CLUSTER:{
        const text = value.toUpperCase();
        setCluster(text);
        if (isTabTextValid(text, tab)){
          setStandard('');
          setOpenTab(3);
        }
        break;
      }
      case CCSSType.DOMAIN:{
        const text = value.toUpperCase();
        setDomain(text);
        if (isTabTextValid(text, tab)){
          setCluster('');
          setOpenTab(2);
        }
        break;
      }
      case CCSSType.GRADE:
      default:{
        const text = value.toUpperCase();
        setGrade(text);
        if (isTabTextValid(text, tab)){
          setDomain('');
          setOpenTab(1);
        }
        break;
      }
    }
  }

  const handleTabClick = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
    switch (newValue){
      case 1:
        setCluster('');
        setStandard('');
        break;
      case 2:
        setStandard('');
        break;
      case 0:
      default:
        setDomain('');
        setCluster('');
        setStandard('');
        break;
    }
  };

  const handlePillClick = (value: string, type: CCSSType) => {
    switch (type){
      case CCSSType.DOMAIN:
        setDomain(value);
        setCluster('');
        setStandard('');
        setOpenTab(2);
        break;
      case CCSSType.CLUSTER:
        setCluster(value);
        setStandard('');
        setOpenTab(3);
        break;
      case CCSSType.STANDARD:
        setStandard(value);
        handleCCSSSubmit(`${grade}.${domain}.${cluster}.${value}`);
        break;
      case CCSSType.GRADE:
      default:
        setGrade(value);
        setDomain('');
        setCluster('');
        setStandard('');
        setOpenTab(1);
        break;
    }
  };
  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE)
      return value;
    if (screen === ScreenSize.MEDIUM)
     return value.charAt(0);
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
        const gradeObject = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          const domainObject = gradeObject.domains.find((ccssDomain) => ccssDomain.key === domain);
          if (domainObject){
            const clusterObject = domainObject.clusters.find((ccssCluster) => ccssCluster.key === cluster);
            if (clusterObject){
              return (
                <CCSSPillContainer container rowSpacing={2} direction="column" style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'nowrap'}}>
                  {clusterObject.standards?.map((ccssStandard) => (
                      ccssStandard.subStandards && ccssStandard.subStandards.length > 0 ? (
                          ccssStandard.subStandards.map((subStandard) => (
                            <CCSSIndicatorPill key={subStandard.key} description={subStandard.desc} label={subStandard.key} onClick={()=> handlePillClick(subStandard.key, CCSSType.STANDARD)} type={CCSSType.STANDARD}/>
                          ))
                      ) : (
                      <CCSSIndicatorPill key={ccssStandard.key} description={ccssStandard.desc} label={ccssStandard.key} onClick={()=> handlePillClick(ccssStandard.key, CCSSType.STANDARD)} type={CCSSType.STANDARD}/>
                    )))
                  }
                </CCSSPillContainer>
              )
            }
          }
        }
        return null;
      }
      case 2: {
        const gradeObject = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          const domainObject = gradeObject.domains.find((ccssDomain) => ccssDomain.key === domain);
          if (domainObject){
            return (
              <CCSSPillContainer container rowSpacing={2} direction="column" style={{alignItems: 'flex-start'}}>
                {domainObject.clusters.map((ccssCluster) => (
                    <CCSSIndicatorPill key={ccssCluster.key} description={ccssCluster.desc} label={ccssCluster.key} onClick={()=> handlePillClick(ccssCluster.key, CCSSType.CLUSTER)} type={CCSSType.CLUSTER}/>
                  ))
                }
              </CCSSPillContainer>
            )
          }
        }
        return null;
      }
      case 1: {
        const gradeObject = ccssDictionary.find((ccssGrade) => ccssGrade.key === grade);
        if (gradeObject){
          return (
            <CCSSPillContainer container rowSpacing={2} direction="column" style={{alignItems: 'flex-start'}}>
              {gradeObject.domains.map((ccssDomain) => (
                  <CCSSIndicatorPill key={ccssDomain.key} description={ccssDomain.desc} label={ccssDomain.key} onClick={()=> handlePillClick(ccssDomain.key, CCSSType.DOMAIN)} type={CCSSType.DOMAIN}/>
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
          {ccssDictionary.map((ccssGrade) => (
            <CCSSIndicatorPill key={ccssGrade.key} description={ccssGrade.desc} onClick={()=> handlePillClick(ccssGrade.key, CCSSType.GRADE)}  type={CCSSType.GRADE}/>
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
              onChange={handleTabClick}
            >
              {Object.entries(tabMap).map(([key, value], index) => {
                const numericKey = Number(key);
                const isSelected = openTab === numericKey;
                const selectedValue = getSelectedValue(value);
                const tabType = value as CCSSType; 

                return (
                  <StyledTab
                    key={numericKey}
                    icon={
                      <LabelCircle key={`label-circle-${numericKey}-${isSelected}`} selectedValue={selectedValue} isSelected={isSelected} handleOnChange={handleTabTextChange(tabType)} autoFocus={isSelected}/>
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
