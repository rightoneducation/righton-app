import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswersResponse } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import ArrowIcon from '../../images/Arrow.svg';
import ArrowIconDark from '../../images/ArrowDark.svg';

const TitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'statePosition',
})<{ statePosition?: number }>(({statePosition}) => ({
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
})<{ statePosition?: number }>(({statePosition}) => ({
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
})<{ statePosition?: number }>(({statePosition}) => ({
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
    noResponseIndex: number;
    numPlayers: number;
    statePosition: number;
    isShortAnswerEnabled: boolean;
    isPrevPhaseResponses: boolean;
}

export default function PlayersSelectedAnswer({
  data, 
  graphClickIndex, 
  noResponseIndex,
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
  const [isExpanded, setIsExpanded] = useState(true);
  // matches the gradient background condition on the phase 2 card in ResponsesCard
  const headerTextColor = statePosition >= 6 && !isPrevPhaseResponses ? '#063772' : '#FFFFFF';
  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: theme.sizing.xSmPadding, paddingTop: '8px'}}>
      <TextContainer
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ height: '25px', cursor: 'pointer',alignItems: 'center', borderRadius: '8px', padding: '8px 12px', backgroundColor: statePosition >= 6 && !isPrevPhaseResponses ? '#FFFFFF80' : '#FFFFFF33' }}
      >
        <Typography sx={{ color: headerTextColor, textAlign: 'center', fontSize: '14px', fontWeight: 700, fontFamily: 'Rubik'}}>
          {graphClickIndex === noResponseIndex ? 'Not yet answered' : 'Selected by'}
        </Typography>
        <NumberContainer style={{ gap: '4px' }}>
          <CountText style={{ paddingTop: 0, color: headerTextColor }}>
            {count}
          </CountText>
          <PercentageText style={{ paddingTop: 0, color: headerTextColor }}>
            ({Math.round(percentage)}%)
          </PercentageText>
          <img src={statePosition >= 6 && !isPrevPhaseResponses ? ArrowIconDark : ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </NumberContainer>
      </TextContainer>
      {isExpanded && teamsWithSelectedAnswer.map((team: string) => (
        <StyledRect key={uuidv4()} >
          <NameText>
            {team}
          </NameText>
        </StyledRect>
      ))}
    </Box>
  );
}