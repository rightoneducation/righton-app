import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswers, IHostTeamAnswersResponse } from '@righton/networking';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './ResponsesGraph/ResponsesGraph';

const ResponseContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '500px',
});

const TitleStyled = styled(Typography)({
  color: 'white',
  fontFamily: 'Poppins',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
  textTransform: 'none',
  textAlign: 'left',
})

interface ResponsesProps {
  localHostTeamAnswers: IHostTeamAnswers;
  numPlayers: number;
  totalAnswers: number;
  questionChoices: string[];
  statePosition: number;
  graphClickInfo: any;
  isShortAnswerEnabled: boolean;
  handleGraphClick: (event: any) => void;
}

export default function Responses({
  localHostTeamAnswers,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}: ResponsesProps) {
  console.log(localHostTeamAnswers.responses); // eslint-disable-line
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          Responses
        </TitleStyled>
        <ResponsesGraph
          data={localHostTeamAnswers.responses}
          numPlayers={numPlayers}
          totalAnswers={totalAnswers}
          questionChoices={questionChoices}
          statePosition={statePosition}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
          handleGraphClick={handleGraphClick}
        />
      </ResponseContainer>
    </HostDefaultCardStyled>
  );
}
