import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import CorrectStars from '../img/CorrectStars.svg';
import CorrectStars_Mirrored from '../img/CorrectStars_Mirrored.svg';
import SelectedAnswer from '../img/SelectedAnswer.svg';
import PlayerCorrectImage from '../img/PlayerCorrectImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import { AnswerState } from '../lib/PlayModels';

const ResultSelectorDefault = styled(Container)(({ theme }) => ({
  width: '100%',
  minHeight: '42px',
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  backgroundColor: theme.palette.primary.lightGrey,
  maxWidth: '100%', // overwrite MUI default maxWidth
  paddingLeft: `${theme.sizing.smallPadding}px`, // overwrite MUI default padding
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

const ResultSelectorCorrect = styled(ResultSelectorDefault)(({ theme }) => ({
  backgroundColor: theme.palette.primary.correctColor,
}));

const CorrectStarsStyled = styled('img')({
  position: 'absolute',
  width: '16px', 
  height: '16px',
});

interface ResultSelectorProps {
  answerStatus: AnswerState;
  index: number;
  answerText: string;
  percentageText: string;
  currentState: GameSessionState;
}

export default function ResultSelector({
  answerStatus,
  index,
  answerText,
  percentageText,
  currentState,
} : ResultSelectorProps) {
  const theme = useTheme();
  const letterCode = 'A'.charCodeAt(0) + index;
 
  const imageMap = {
    [AnswerState.DEFAULT]: '',
    [AnswerState.CORRECT]: CorrectAnswerImage,
    [AnswerState.PLAYER_CORRECT]: PlayerCorrectImage,
    [AnswerState.SELECTED]: SelectedAnswer,
    [AnswerState.PREVIOUS]: '',
  };

  const buttonContents = (
    <>
      <Box style={{display: 'flex', alignItems: 'center'}}>
        <Typography
          variant="h5"
          sx={{
            paddingLeft: '1px',
            paddingTop: '2px',
            opacity: 0.5,
          }}
        >
          {`${String.fromCharCode(letterCode)}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            paddingLeft: `${theme.sizing.extraSmallPadding}px`,
            paddingRight: `${theme.sizing.largePadding}px`,
          }}
        >
          {answerText}
        </Typography>
      </Box>
      <Box style={{display: 'flex', alignItems: 'center'}}>
        { currentState === GameSessionState.PHASE_2_RESULTS && (
        <Typography
          variant="body2"
          sx={{
            paddingRight: (answerStatus === AnswerState.CORRECT || answerStatus === AnswerState.PREVIOUS || answerStatus === AnswerState.SELECTED) ? `${theme.sizing.extraSmallPadding}px` : `${theme.sizing.mediumPadding}px`,
          }}
        >
          {percentageText}
        </Typography>
        )}
          {(answerStatus !== AnswerState.PREVIOUS && answerStatus !== AnswerState.DEFAULT) && (
          <img
            src={imageMap[answerStatus]}
            style={{
              position: 'relative',
              width: `${theme.sizing.smallPadding}px`,
              height: `${theme.sizing.smallPadding}px`,
              paddingTop: '2px',
            }}
            alt="SelectedAnswerImage"
          />
          )}
          
      </Box>
    </>
  );

  switch (answerStatus) {
    case AnswerState.CORRECT:
      return (
        <Box>
          <ResultSelectorCorrect>
            {buttonContents}
          </ResultSelectorCorrect>
        </Box>
      );
      case AnswerState.PLAYER_CORRECT:
        return (
          <Box>
              <Box sx={{position: 'relative', height: 0}}>
                <CorrectStarsStyled src={CorrectStars} alt="" style={{ top: -5, left: 0 }}/>
                <CorrectStarsStyled src={CorrectStars} alt="" style={{ top: -5, right: 10 }}/>
                <CorrectStarsStyled src={CorrectStars_Mirrored} alt="" style={{ top: 30, right: 0 }}/>
              </Box>
            <ResultSelectorCorrect>
              {buttonContents}
            </ResultSelectorCorrect>
          </Box>
        );
    case AnswerState.SELECTED:
    case AnswerState.DEFAULT:
    default:
      return (
        <ResultSelectorDefault
        >
          {buttonContents}
        </ResultSelectorDefault>
      );
  }
}
