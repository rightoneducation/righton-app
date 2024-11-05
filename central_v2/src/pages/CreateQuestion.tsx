import React, { useState } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled} from '@mui/material';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { ScreenSize } from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';

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
  return (
    <CreateQuestionMainContainer>
      <TitleText screenSize={ScreenSize.LARGE}>Create Question</TitleText>
      <CreateQuestionGridContainer container >
        { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingBottom: '16px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride/>
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled smallScreenOverride/>
            </Box>
          }
        <Grid
          sm
          md
          item
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: '16px', paddingRight: '30px'}}
        >
          {  (screenSize !== ScreenSize.SMALL && screenSize !== ScreenSize.MEDIUM) &&
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`}}>
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