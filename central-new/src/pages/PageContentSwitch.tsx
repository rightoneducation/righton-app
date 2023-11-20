import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiClient,
  Environment,
  IGameTemplate,
  IQuestionTemplate
} from '@righton/networking';
import {SidebarButtons} from '../lib/CentralModels';
import PageContent from '../lib/styledcomponents/layout/PageContent';

interface PageContentSwitchProps {
  pageType: SidebarButtons | null;
  gameTemplates: IGameTemplate[] | null;
  questionTemplates: IQuestionTemplate[] | null;
  nextToken: string | null;
  handleNextPageClick: (nextToken: string | null) => void;
}

function PageContentSwitch({
  pageType,
  gameTemplates,
  questionTemplates,
  nextToken,
  handleNextPageClick
}:PageContentSwitchProps) {

  switch(pageType){
    case SidebarButtons.GLOBAL_GAMES:
    default:
      return (
        <>
          <PageContent>
            {gameTemplates?.map((gameTemplate) => (
              <li key={gameTemplate.id} style={{padding: 16}}>
                {gameTemplate.title}
                {/* {gameTemplate.questions?.map((question) => (
                  <li key={question.id} style={{padding: 16}}>
                    {question.title} 
                  </li>
                ))} */}
              </li>
            )
            )}
            {nextToken && (
              <Button sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center',  width: '100%', padding: '10px', textTransform: 'none' }} 
                onClick={() => handleNextPageClick(nextToken)}
              >
                <Typography style={{color: '#2D2D2D'}}>
                  Next Page
                </Typography>
              </Button>
            )}
          </PageContent>
        </>
      )
    case SidebarButtons.GLOBAL_QUESTIONS:
      return (
        <>
          <PageContent>
          {questionTemplates?.map((questionTemplate) => (
              <li key={questionTemplate.id} style={{padding: 16}}>
                {questionTemplate.title}
              </li>
            )
            )}
            {nextToken && (
              <Button sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center',  width: '100%', padding: '10px', textTransform: 'none' }} 
                onClick={() => handleNextPageClick(nextToken)}
              >
                <Typography style={{color: '#2D2D2D'}}>
                  Next Page
                </Typography>
              </Button>
            )}
          </PageContent>
        </>
      )
  }
}

export default PageContentSwitch;
