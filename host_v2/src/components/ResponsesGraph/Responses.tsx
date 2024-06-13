import React from 'react';
import { Box, Typography } from '@mui/material';
import {styled } from '@mui/material/styles';
import ResponsesGraph from './ResponsesGraph';

const ResponsesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '500px',
});

const TitleText = styled(Typography)({
  color: '#FFF',
  fontFamily: 'Poppins',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
  textTransform: 'none',
  textAlign: 'left',
})

interface ResponsesProps {
  data: any;
  numPlayers: number;
  totalAnswers: number;
  questionChoices: any;
  statePosition: number;
  graphClickInfo: any;
  isShortAnswerEnabled: boolean;
  handleGraphClick: (value: any) => void;
}

export default function Responses({
  data,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}: ResponsesProps) {
  
  return (
    <ResponsesContainer>
      <TitleText>
        Responses
      </TitleText>
      <ResponsesGraph
        data={data}
        numPlayers={numPlayers}
        totalAnswers={totalAnswers}
        questionChoices={questionChoices}
        statePosition={statePosition}
        graphClickInfo={graphClickInfo}
        isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
        handleGraphClick={handleGraphClick}
      />
    </ResponsesContainer>
  );
}

const useStyles = makeStyles({
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  titleStyle: {
    color: 'var(--teacher-element-foreground, #FFF)',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    textTransform: 'none',
    textAlign: 'left',
  },
});
