import React from 'react';
import { Grid } from '@mui/material';
import { BodyContentAreaDoubleColumnStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';
import ConfidenceCard from './ConfidenceCard';

// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null; // instructions to get the correct answer if this option is the correct option and null otherwise
  reason: string | null; // reason why answer option is incorrect if this option is incorrect and null otherwise
  content: string; // the answer option itself
}

interface QuestionData {
  text: string; // question text (i.e. the question itself)
  imageUrl: string | undefined; // the url of the image on the question card (if there is one)
}

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer 
  name: string; // this player's name
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly 
  incorrect: number; // number of players who selected tgis option and answered incorrectly 
  players: Player[]; // an array of the players that selected this option
}

// TODO: figure out what to do about keeping graph as 'confidence' instead of 
// current toggle functionality based on click behavior
interface GraphClickInfo {
  graph: string | null;
  selectedIndex: number | null;
}

interface PlaceholderContentAreaProps {
  // props for Question Card (see QuestionData interface above)
  questionData: QuestionData,
  // props for Answer Card (see AnswerOption interface above)
  answerOptions: AnswerOption[]
  // props for Confidence Card (see Team, Answer, Player, ConfidenceOption, and GraphClickInfo interfaces above)
  confidenceData: ConfidenceOption[],
  graphClickInfo: GraphClickInfo;
  handleGraphClick: ({ graph, selectedIndex }: { graph: string | null; selectedIndex: number | null; }) => void;
}// eslint-disable-line
export default function PlaceholderContentArea({
  questionData,
  answerOptions,
  confidenceData, graphClickInfo, handleGraphClick }: PlaceholderContentAreaProps) {
  // eslint-disable-line
  return (
    <BodyContentAreaDoubleColumnStyled container style={{ paddingTop: '16px' }}>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        <ConfidenceCard confidenceData={confidenceData} graphClickInfo={graphClickInfo} handleGraphClick={handleGraphClick} />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        <QuestionCard questionText={questionData.text} imageUrl={questionData.imageUrl} />
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
