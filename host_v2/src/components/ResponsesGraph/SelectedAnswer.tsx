import React from 'react';
import { Typography, Box } from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { IHostTeamAnswersResponse } from '@righton/networking';
import { IGraphClickIndices } from '../../lib/HostModels';
import check from '../../img/Pickedcheck_white.svg';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

interface SelectedAnswerProps {
  data: IHostTeamAnswersResponse[];
  numPlayers: number;
  statePosition: number;
  graphClickInfo: IGraphClickIndices;
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
  color: 'rgba(255, 255, 255)',
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
  const theme = useTheme();
  const {
    data,
    numPlayers,
    statePosition,
    graphClickInfo,
    isShortAnswerEnabled,
    isPrevPhaseResponses
  } = props;
  const graphName = statePosition < 6 || isPrevPhaseResponses ? 'realtimephase1' : 'realtimephase2';
  const selectedIndex = graphClickInfo[graphName] ?? null;
  const showCustomTick = selectedIndex !== null && Boolean(data[selectedIndex]?.isCorrect);

  const noResponseIndex = data.findIndex((response) => response.multiChoiceCharacter === '…');
  return (
    <Box>
      {selectedIndex === null ? (
        <Typography variant='label' style={{opacity: 0.5}}>
          Tap an answer to see who chose it
        </Typography>
      ) : (
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px`}}>
          { selectedIndex !== noResponseIndex && (
            <RectStyle>
              { !isShortAnswerEnabled &&
              <ChoiceContainer>
                { (data[selectedIndex] && data[selectedIndex].multiChoiceCharacter)?
                data[selectedIndex].multiChoiceCharacter : '-'}
              </ChoiceContainer>
              }
              <TextContainer>
                {data[selectedIndex]?.rawAnswer ? data[selectedIndex].rawAnswer : null}
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
          )}
          <PlayersSelectedAnswer
            data={data}
            graphClickIndex={selectedIndex}
            noResponseIndex={noResponseIndex}
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
