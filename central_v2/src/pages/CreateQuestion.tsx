import React from 'react';
import {Grid, useTheme} from '@mui/material';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { ScreenSize } from '../lib/CentralModels';

export default function CreateQuestion(){
  const theme = useTheme();
  return (
    <CreateQuestionMainContainer>
      <CreateQuestionGridContainer container >
        <Grid
          sm
          md
          item
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        />
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
          <CreateQuestionCardBase
            screenSize={ScreenSize.LARGE}
          />
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}