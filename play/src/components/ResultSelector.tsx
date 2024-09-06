import React, { MouseEventHandler } from 'react';
import { Container, Typography, Box, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import CorrectStars from '../img/CorrectStars.svg';
import CorrectStars_Mirrored from '../img/CorrectStars_Mirrored.svg';
import SelectedAnswer from '../img/SelectedAnswer.svg';
import PlayerCorrectImage from '../img/PlayerCorrectImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import { AnswerState } from '../lib/PlayModels';
import DACScoreIndicator from './DACScoreIndicator';

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
  percentageText?: string;
  currentState?: GameSessionState;
  isShortAnswerEnabled?: boolean;
  correctCard?: boolean;
  newPoints?: number;
}

export default function ResultSelector({
  answerStatus,
  index,
  answerText,
  percentageText,
  currentState,
  isShortAnswerEnabled,
  correctCard,
  newPoints
}: ResultSelectorProps) {
  const theme = useTheme();
  const letterCode = 'A'.charCodeAt(0) + index;

  const imageMap = {
    [AnswerState.DEFAULT]: '',
    [AnswerState.CORRECT]: CorrectAnswerImage,
    [AnswerState.PLAYER_SELECTED_CORRECT]: PlayerCorrectImage,
    [AnswerState.SELECTED]: SelectedAnswer,
    [AnswerState.PREVIOUS]: '',
  };

  // disables context menu when longclicking on image
  const handleContextMenu: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
  };
  const image = (
    <img
      src={imageMap[answerStatus]}
      style={{
        position: 'relative',
        width: `${theme.sizing.smallPadding}px`,
        height: `${theme.sizing.smallPadding}px`,
        paddingTop: '2px',
        // disable touch callout when longclicking on image
        WebkitTouchCallout: 'none',
      }}
      alt="SelectedAnswerImage"
      // disable context menu when longclicking on image
      onContextMenu={handleContextMenu}
    />
  );

  const resultContents = (
    <>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        {!(isShortAnswerEnabled && currentState === GameSessionState.PHASE_1_DISCUSS) && !(isShortAnswerEnabled && correctCard) && (
          <Typography
            variant="h5"
            sx={{
              paddingLeft: '1px',
              color: correctCard ? '#384466' : '#4700B2',
              fontWeight: '800',
              fontSize: '16px',
              lineHeight: '22px',
              opacity: correctCard ? '.5' : '1',
            }}
          >
            {String.fromCharCode(letterCode)}
          </Typography>
        )}
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
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        {currentState === GameSessionState.PHASE_2_DISCUSS && ( 
          <Typography
            variant="body2"
            sx={{
              paddingRight:
                answerStatus === AnswerState.CORRECT ||
                answerStatus === AnswerState.PREVIOUS ||
                answerStatus === AnswerState.SELECTED
                  ? `${theme.sizing.extraSmallPadding}px`
                  : `${theme.sizing.mediumPadding}px`,
            }}
          >
            {percentageText}
          </Typography>
        )}
        {answerStatus !== AnswerState.PREVIOUS &&
          answerStatus !== AnswerState.DEFAULT &&
          (answerStatus === AnswerState.SELECTED ? (
            <Tooltip
              title="Your Answer"
              placement="top"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={300}
            >
              {image}
            </Tooltip>
          ) : (
            image
          ))}
      </Box>
    </>
  );
  switch (answerStatus) {
    case AnswerState.CORRECT:
      return (
        <Box sx={{ width: '100%' }}>
          <ResultSelectorCorrect>{resultContents}</ResultSelectorCorrect>
        </Box>
      );
    case AnswerState.PLAYER_SELECTED_CORRECT:
      return (
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center'}}>
          <Box sx={{ width: '100%' }}>
            {currentState === GameSessionState.PHASE_1_DISCUSS && (
              <Box sx={{ position: 'relative', height: 0, width: '100%' }}>
                <CorrectStarsStyled
                  src={CorrectStars}
                  alt="Stars icon that denotes player is correct"
                  style={{ top: -5, left: 0 }}
                />
                <CorrectStarsStyled
                  src={CorrectStars}
                  alt="Stars icon that denotes player is correct"
                  style={{ top: -5, right: 10 }}
                />
                <CorrectStarsStyled
                  src={CorrectStars_Mirrored}
                  alt="Stars icon that denotes player is correct"
                  style={{ top: 30, right: 0 }}
                />
              </Box>
            )}
            <ResultSelectorCorrect>{resultContents}</ResultSelectorCorrect>
          </Box>
        </Box>
      );
    case AnswerState.SELECTED:
    case AnswerState.DEFAULT:
    default:
      return <ResultSelectorDefault>{resultContents}</ResultSelectorDefault>;
  }
}
