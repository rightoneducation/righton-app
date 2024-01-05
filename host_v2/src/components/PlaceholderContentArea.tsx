import React from 'react';
import { Grid } from '@mui/material';
import { BodyContentAreaDoubleColumnStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';

// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null;
  reason: string | null;
  content: string;
}

interface QuestionData {
  text: string;
  imageUrl: string | undefined;
}

interface PlaceholderContentAreaProps { questionData: QuestionData, answerOptions: AnswerOption[] } // eslint-disable-line

export default function PlaceholderContentArea({ questionData, answerOptions }: PlaceholderContentAreaProps) {
  // eslint-disable-line
  return (
    <BodyContentAreaDoubleColumnStyled container style={{ paddingTop: '16px' }}>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        <QuestionCard questionText={questionData.text} imageUrl={questionData.imageUrl} />
        <Card />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        {answerOptions.map((option, index) =>
          <AnswerCard
            isCorrectAnswer={option.reason === null}
            answerIndex={index}
            answerContent={option.content}
            instructions={option.instructions}
            answerReason={option.reason} />)}
        <Card />
      </Grid>
    </BodyContentAreaDoubleColumnStyled>
  );
}
