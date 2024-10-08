import React from 'react';
import { Typography, Box } from '@mui/material';
import styled from '@mui/material/styles/styled';
import Tooltip from '@mui/material/Tooltip';
import { IHostTeamAnswersResponse } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import check from '../../img/Pickedcheck.svg';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

interface SelectedAnswerProps {
  data: IHostTeamAnswersResponse[];
  correctChoiceIndex: number;
  numPlayers: number;
  statePosition: number;
  graphClickInfo: IGraphClickInfo;
  isShortAnswerEnabled: boolean;
  isPrevPhaseResponses: boolean;
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
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontSize: '16px',
  padding: '8px',
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
    isShortAnswerEnabled,
    isPrevPhaseResponses
  } = props;
  const showCustomTick =
    graphClickInfo.selectedIndex === data.length - 1 - correctChoiceIndex;
  return (
    <Box>
      {graphClickInfo.selectedIndex === null 
        || (statePosition < 6 && graphClickInfo.graph !== 'realtimephase1')
        || (statePosition >= 6 && isPrevPhaseResponses && graphClickInfo.graph !== 'realtimephase1')
        || (statePosition >= 6 && !isPrevPhaseResponses && graphClickInfo.graph !== 'realtimephase2') 
      ? (
        <Text>
          Tap on a response to see more details.
        </Text>
      ) : (
        <Box style={{ width: '100%'}}>
          <TitleText>
            Showing players who answered:
          </TitleText>
          <RectStyle>
            { !isShortAnswerEnabled &&
            <ChoiceContainer>
              { (data[graphClickInfo.selectedIndex] && data[graphClickInfo.selectedIndex].multiChoiceCharacter)?
              data[graphClickInfo.selectedIndex].multiChoiceCharacter : '-'}
            </ChoiceContainer>
            }
            <TextContainer>
              {data[graphClickInfo.selectedIndex]?.rawAnswer ? data[graphClickInfo.selectedIndex].rawAnswer : null}
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
            graphClickIndex={graphClickInfo.selectedIndex}
            numPlayers={numPlayers}
            statePosition={statePosition}
            isShortAnswerEnabled={isShortAnswerEnabled}
            isPrevPhaseResponses={isPrevPhaseResponses}
          />
        </Box>
      )}
    </Box>
  );
}
