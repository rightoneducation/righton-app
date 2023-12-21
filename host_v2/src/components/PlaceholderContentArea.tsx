import React from 'react';
import { Grid } from '@mui/material';
import { BodyContentAreaDoubleColumnStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';

interface PlaceholderContentAreaProps { } // eslint-disable-line
// TODO: delete later <--------
// Question card
const sampleUrl = "https://images.unsplash.com/photo-1609188944094-394637c26769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";
const sampleText = "A pair of shoes were 10% off last week. This week, theres an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that youd get if you buy the shoes this week?";
// Answer card
const instructions = ['step 1', 'step 2', 'step 3', 'step 4'];
const answerReason = 'reasoning'
// TODO: delete later <--------

export default function PlaceholderContentArea({ }: PlaceholderContentAreaProps) {
  // eslint-disable-line
  return (
    <BodyContentAreaDoubleColumnStyled container style={{ paddingTop: '16px' }}>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        <QuestionCard questionText={sampleText} imageUrl={sampleUrl} />
        <Card />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        <AnswerCard isCorrectAnswer={false} instructions={instructions} answerReason={answerReason} />
        <Card />
      </Grid>
    </BodyContentAreaDoubleColumnStyled>
  );
}
