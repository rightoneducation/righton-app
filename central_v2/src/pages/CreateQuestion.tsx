import React, { useState } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled} from '@mui/material';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { ScreenSize } from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import CCSSTabsModalBackground from '../components/ccsstabs/CCSSTabsModalBackground';

type TitleTextProps = {
  screenSize: ScreenSize;
}

const TitleText = styled(Typography)<TitleTextProps>(({ theme, screenSize }) => ({
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize:
    screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
}));

const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const AISwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    background: theme.palette.primary.aiGradient,
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#111111",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
}));

const IncorrectAnswerPill = styled(Box)(({theme}) => ({
  width: 'fit-content',
  height: '22px',
  borderRadius: '20px',
  borderWidth: '2px',
  borderColor: theme.palette.primary.darkBlue,
  borderStyle: 'solid',
  minWidth: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

interface CreateQuestionProps {
  screenSize: ScreenSize;
}

export default function CreateQuestion({
  screenSize
}:CreateQuestionProps){
  const theme = useTheme();
  const [incorrectAnswers, setIncorrectAnswers] = useState(['','','']);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [ccss, setCCSS] = useState<string>('CCSS');
  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  };

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };

  const handleCCSSSubmit = (ccssString: string) => {
    setCCSS(ccssString);
    setIsCCSSVisible(false);
  };

  console.log(isCCSSVisible);
  return (
    <CreateQuestionMainContainer>
      <>
        <CCSSTabsModalBackground
          isTabsOpen={isCCSSVisible}
          handleBackToExplore={handleBackToExplore}
        />
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
      </>
      <TitleText screenSize={ScreenSize.LARGE}>Create Question</TitleText>
      <CreateQuestionGridContainer container >
        { screenSize === ScreenSize.SMALL &&
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride/>
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled smallScreenOverride/>
            </Box>
          }
        <Grid
          sm
          md
          item
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: '16px'}}
        >
          { screenSize !== ScreenSize.SMALL &&
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled/>
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled/>
            </Box>
          }
        </Grid>
        <Grid
          sm={12}
          item
          style={{
            width: '100%',
            maxWidth: '672px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
          }}
        >
          <CreateQuestionCardBase
            screenSize={screenSize}
            handleCCSSClick={handleCCSSClick}
            ccss={ccss}
          />
          <Grid
            container
            spacing={`${theme.sizing.smPadding}px`}
          >
            <SubCardGridItem 
              item
              sm={12}
              md={6}
            >
              <CorrectAnswerCard />
            </SubCardGridItem>
            <SubCardGridItem
              item
              sm={12}
              md={6}
            >
              <Box style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                <Typography style={{textAlign: 'right', fontWeight: 500}}>
                  Try our AI-Generated Wrong Answer Explanation Prototype
                </Typography>
                <AISwitch/>
              </Box>
              <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'}}>
                {incorrectAnswers && incorrectAnswers.map((_, index) => 
                    <IncorrectAnswerPill>  
                      {index}
                    </IncorrectAnswerPill>
                  )
                }
              </Box>
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}