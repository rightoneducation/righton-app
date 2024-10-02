import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswersResponse } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';

const TitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'statePosition',
})(({statePosition}) => ({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingTop: '16px',
  opacity: statePosition === 6 ? 0.5 : 1,
}));

const PercentageText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'statePosition',
})(({statePosition}) => ({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingTop: '16px',
  paddingLeft: '4px',
  opacity: statePosition === 6 ? 0.5 : 1,
}));

const CountText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'statePosition',
})(({statePosition}) => ({
  color: '#FFF',
  textAlign: 'right',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '700',
  paddingTop: '16px',
  opacity: statePosition === 6 ? 0.5 : 1,
}));

const NameText = styled(Typography)({
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  color: 'white'
});

const PhaseTwoTitleText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
});

const PhaseTwoPercentageText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingLeft: '4px',
});

const PhaseTwoCountText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingLeft: '4px',
});

const TextContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '8px',
});

const NumberContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const PhaseTwoNumberContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginTop: '-20px',
});

const StyledRect = styled(Box)({
  width: '100%',
  height: '40px',
  color: 'white',
  backgroundColor: '#063772',
  fontSize: '16px',
  padding: '10px 16px',
  borderRadius: '8px',
  maxWidth: '500px',
  boxSizing: 'border-box'
});


interface PlayersSelectedAnswerProps {
    data: IHostTeamAnswersResponse[];
    graphClickIndex: number;
    numPlayers: number;
    statePosition: number;
    isShortAnswerEnabled: boolean;
    isPrevPhaseResponses: boolean;
}

export default function PlayersSelectedAnswer({
  data, 
  graphClickIndex, 
  numPlayers, 
  statePosition, 
  isShortAnswerEnabled,
  isPrevPhaseResponses
}: PlayersSelectedAnswerProps) {
  const theme = useTheme();
  const { count } = data[graphClickIndex];
  const percentage = (count / numPlayers) * 100;
  console.log(data);
  const teamsWithSelectedAnswer = data[graphClickIndex].teams.map((team: string) => team);
  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: theme.sizing.xSmPadding}}>
      <TextContainer>
        <TitleText>
        { (statePosition < 6 || isPrevPhaseResponses) ? `Players who picked this answer` : `Players who think this is the trickiest answer`}
        </TitleText>
        <NumberContainer>
          <CountText>
            {count}
          </CountText>
          <PercentageText>
            ({Math.round(percentage)}%)
          </PercentageText>
        </NumberContainer>
      </TextContainer>
      {teamsWithSelectedAnswer.map((team: string) => (
        <StyledRect key={uuidv4()} >
          <NameText>
            {team}
          </NameText>
        </StyledRect>
      ))}
    </Box>
  );
}