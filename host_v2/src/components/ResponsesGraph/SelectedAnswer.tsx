import React from 'react';
import { Typography, Box } from '@mui/material';
import styled from '@mui/material/styles/styled';
import Tooltip from '@mui/material/Tooltip';
import { ITeam } from '@righton/networking';
import check from '../../images/Pickedcheck.svg';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

interface SelectedAnswerProps {
  data: {answerCount: number, answerCorrect: boolean, answerChoice: string, answerText: string, answerTeams: ITeam[]}[];
  correctChoiceIndex: number;
  numPlayers: number;
  statePosition: number;
  graphClickInfo: any;
  isShortAnswerEnabled: boolean;
}

const Text = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.6)',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
});


const TitleText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingBottom: '10px',
});

const TextContainer = styled(Typography)({
  color: '#FFF',
  fontFamily: 'Rubik',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '22px',
})

const RectStyle = styled(Box)({
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontSize: '16px',
  padding: '10px',
  borderRadius: '22px',
  border: '1px solid #B1BACB',
  position: 'relative',
  maxWidth: '500px',
  boxSizing: 'border-box',
})

const ChoiceContainer = styled(Box)({
  color: 'rgba(255, 255, 255, 0.5)',
  fontFamily: 'Poppins',
  fontSize: '16px',
  fontWeight: '800',
  lineHeight: '20px',
  paddingRight: '8px',
})

const ToolTip = styled(Box)({
  whiteSpace: 'pre-line',
  textAlign: 'center',
})

const Icon = styled(Box)({
  position: 'absolute',
  top: '50%',
  right: '16px',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
})

export default function SelectedAnswer(props: SelectedAnswerProps) {
  const {
    data,
    correctChoiceIndex,
    numPlayers,
    statePosition,
    graphClickInfo,
    isShortAnswerEnabled
  } = props;
  const showCustomTick =
    graphClickInfo.selectedIndex === data.length - 1 - correctChoiceIndex;
  return (
    <Box>
      {graphClickInfo.selectedIndex === null ? (
        <Text>
          Tap on a response to see more details.
        </Text>
      ) : (
        <Box style={{ width: '100%' }}>
          <TitleText>
            Showing players who answered:
          </TitleText>
          <RectStyle>
            { !isShortAnswerEnabled &&
            <ChoiceContainer>
              {data[graphClickInfo.selectedIndex].answerChoice}
            </ChoiceContainer>
            }
            <TextContainer>
              {data[graphClickInfo.selectedIndex].answerText}
            </TextContainer>
            {showCustomTick && (
              <Tooltip
                title={
                  <ToolTip>
                    This is the {'\n'} correct answer
                  </ToolTip>
                }
                placement="bottom"
                arrow
              >
                <Icon>
                  <img src={check} alt="correct answer" />
                </Icon>
              </Tooltip>
            )}
          </RectStyle>
          <PlayersSelectedAnswer
            data={data}
            graphClickInfo={graphClickInfo}
            numPlayers={numPlayers}
            statePosition={statePosition}
            isShortAnswerEnabled={isShortAnswerEnabled}
          />
        </Box>
      )}
    </Box>
  );
}
