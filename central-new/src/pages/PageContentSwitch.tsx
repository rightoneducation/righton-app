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
  handleAddQuestionClick: (questionTemplateId: string, gameTemplateId: string) => void;
}

function PageContentSwitch({
  pageType,
  gameTemplates,
  questionTemplates,
  nextToken,
  handleNextPageClick,
  handleAddQuestionClick
}:PageContentSwitchProps) {
  const [questionTemplateId, setQuestionTemplateId] = useState<string>("");
  const [gameTemplateId, setGameTemplateId] = useState<string>("");
  console.log(gameTemplates);
  console.log(questionTemplates);
  switch(pageType){
    case SidebarButtons.GLOBAL_GAMES:
    default:
      return (
        <>
          <PageContent>
            {gameTemplates?.map((gameTemplate) => (
              <li key={gameTemplate.id} style={{padding: 16}}>
                {JSON.stringify(gameTemplate)}
                {gameTemplate.questionTemplates?.map((question) => (
                  <li key={question.id} style={{padding: 16}}>
                    {JSON.stringify(question)} 
                  </li>
                ))}
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
    case SidebarButtons.ADD_QUESTION_TO_GAME:
      return (
        <PageContent>
          <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box style={{display: 'flex', padding: 16, gap: 16 }}>
              <Typography style={{color: '#2D2D2D'}}>
                  Question ID:
              </Typography>
              <input type="text" value={questionTemplateId} onChange={(event) => setQuestionTemplateId(event.target.value)} /> 
              <Typography style={{color: '#2D2D2D'}}>
                  Game ID:
              </Typography>
              <input type="text" value={gameTemplateId} onChange={(event) => setGameTemplateId(event.target.value)} /> 
            </Box>
            <Button type="button" onClick={()=>handleAddQuestionClick(questionTemplateId, gameTemplateId)}>Add Question</Button>
          </Box>
        </PageContent>
      )
  }
}

export default PageContentSwitch;
