import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
// import ResponsesGraph from './ResponsesGraph';

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

export default function Responses({
  // data,
  // numPlayers,
  // totalAnswers,
  // questionChoices,
  // statePosition,
  // graphClickInfo,
  // isShortAnswerEnabled,
  // handleGraphClick,
}) {
  
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          Responses
        </TitleStyled>
        {/* <ResponsesGraph
          data={data}
          numPlayers={numPlayers}
          totalAnswers={totalAnswers}
          questionChoices={questionChoices}
          statePosition={statePosition}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
          handleGraphClick={handleGraphClick}
        /> */}
      </ResponseContainer>
    </HostDefaultCardStyled>
  );
}
