import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ITeam } from '@righton/networking';

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
  alignItems: 'center',
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
  marginBottom: '8px',
  maxWidth: '500px',
  boxSizing: 'border-box'
});


interface PlayersSelectedAnswerProps {
    data: {answerCount: number, answerCorrect: boolean, answerChoice: string, answerText: string, answerTeams: ITeam[]}[];
    graphClickInfo: any;
    numPlayers: number;
    statePosition: number;
    isShortAnswerEnabled: boolean;
}

export default function PlayersSelectedAnswer({
  data, 
  graphClickInfo, 
  numPlayers, 
  statePosition, 
  isShortAnswerEnabled
}: PlayersSelectedAnswerProps) {

  const answerCount = data[graphClickInfo.selectedIndex].answerCount;
  const percentage = (answerCount / numPlayers) * 100;
  const teamsWithSelectedAnswer = data[graphClickInfo.selectedIndex].answerTeams.map((team: ITeam) => team.name);

  return (
    <Box>
      <TextContainer>
        <TitleText>
          Players who picked this answer
        </TitleText>
        <NumberContainer>
          <CountText>
            {/* count from stateposition === 6 saved and displayed here for stateposition === 6 */}
            {answerCount}
          </CountText>
          <PercentageText>
            {/* percentage from  stateposition === 6saved and displayed here for stateposition === 6 */}
            ({Math.round(percentage)}%)
          </PercentageText>
        </NumberContainer>
      </TextContainer>
      {statePosition === 6 && (
        <TextContainer>
          <PhaseTwoTitleText>
            Players who think this is the trickest
            <br /> answer
          </PhaseTwoTitleText>
          <PhaseTwoNumberContainer>
            <PhaseTwoCountText>
              {answerCount}
            </PhaseTwoCountText>
            <PhaseTwoPercentageText>
              ({Math.round(percentage)}%)
            </PhaseTwoPercentageText>
          </PhaseTwoNumberContainer>
        </TextContainer>
      )}
      {teamsWithSelectedAnswer.map((teamChoice: any, index: number) => (
        <StyledRect key={index} >
          <NameText>
            {teamChoice}
          </NameText>
        </StyledRect>
      ))}
    </Box>
  );
}