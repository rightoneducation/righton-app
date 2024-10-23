import React from 'react';
import { Box, Fade, Slide, Tabs, Tab, styled } from '@mui/material';
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

interface TabContainerProps {
  isTabsOpen: boolean;
  question: IQuestionTemplate;
  questions: IQuestionTemplate[];
}

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100dvh',
  width: '100dvw',
  background: 'rgba(0,0,0,0.25)',
  zIndex: 5,
  overflow: 'hidden'
}));

const ModalBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.25)',
  zIndex: 5
}));

const ContentFrame = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  paddingTop: '115px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
  height: '100%',
  width: '100%',
}));

const TabContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  zIndex: 6
}));

type StyledTabProps = {
  isSelected: boolean;
};

const StyledTab = styled(Tab)<StyledTabProps>(({ theme, isSelected }) => ({
  background: '#304B7F',
  color: 'rgba(255, 255, 255, 0.5)',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  '&.Mui-selected': {
    background: '#02215F',
    color: '#fff',
  },
}));

interface TabContainerProps {
  isTabsOpen: boolean;
  question: IQuestionTemplate;
  questions: IQuestionTemplate[];
}

export default function QuestionTabs({
  isTabsOpen,
  question,
  questions
} : TabContainerProps) 
{
  const theme = useTheme();
  const [openTab, setOpenTab] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };
  const tabMap: { [key: number]: string } = {
    0: 'Explore Questions',
    1: 'My Questions',
    2: 'Drafts',
    3: 'Favorites'
  };
  
  const tabIconMap: { [key: number]: string } = {
    0: tabExploreQuestionsIcon,
    1: tabMyQuestionsIcon,
    2: tabDraftsIcon,
    3: tabFavoritesIcon
  };

  return (
    <TabContainer>
      <Fade in={isTabsOpen} timeout={1000}>
        <ModalBackground/>
      </Fade>
      <ContentFrame>
        <Slide direction="up" in={isTabsOpen} timeout={1000}>
          <TabContent>
            <Tabs value={openTab} onChange={handleChange} TabIndicatorProps={{
              style: {
                display: 'none'
              }
            }}>
            {Object.entries(tabMap).map(([key, value], index) => {
              const numericKey = Number(key);
              return (
                <StyledTab
                  key={uuidv4()}
                  icon={<img src={tabIconMap[numericKey]} alt={value} style={{opacity: openTab === numericKey ?  1 : 0.5}}/>}
                  iconPosition='start'
                  label={value}
                  isSelected={openTab === numericKey}
                  style={{marginRight: '8px'}}
                />
              );
            })}
            </Tabs>
            <Box style={{
              position: 'relative', 
              flexGrow:1, 
              height: '100%', 
              width: '100%', 
              background: '#02215F', 
              zIndex: 6, 
              borderTopRightRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box style={{
                width: '100%',
                minHeight: '180px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: `${theme.sizing.mdPadding}px`,
                boxSizing: 'border-box'
              }}>
                <Box style={{display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px`}}>
                  <CentralButton buttonType={ButtonType.PREVIOUSQUESTION} isEnabled/>
                  <CentralButton buttonType={ButtonType.BACKTOEXPLORE} isEnabled/>
                </Box>
                <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`}}>
                  <CentralButton buttonType={ButtonType.FAVORITE} isEnabled/>
                  <CentralButton buttonType={ButtonType.CLONEANDEDIT} isEnabled/>
                  <CentralButton buttonType={ButtonType.NEXTQUESTION} isEnabled/>
                </Box>
              </Box>
              <Box style={{ width: '100%', maxWidth: '664px'}}>
                <DetailedQuestionCardBase question={question}/>
              </Box>
            </Box>
          </TabContent>
        </Slide>
      </ContentFrame>
    </TabContainer>
  );
}