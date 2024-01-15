import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';

// TODO: proper types
interface LabelProps {
  x?: any;
  y?: any;
  datum?: any;
  barThickness?: any;
  labelOffset?: any;
  xSmallPadding?: any;
  mediumLargePadding?: any;
  xLargePadding?: any;
  defaultVictoryPadding?: any;
  noResponseLabel?: any;
  isShortAnswerEnabled?: any;
  questionChoices?: any;
}

export default function CustomLabel(props: LabelProps) {
  const {
    x,
    y,
    datum,
    barThickness,
    labelOffset,
    xSmallPadding,
    mediumLargePadding,
    xLargePadding,
    defaultVictoryPadding,
    noResponseLabel,
    isShortAnswerEnabled,
    questionChoices
  } = props;

  const theme = useTheme(); // eslint-disable-line
  // done to prevent embedding a nested ternary in the render function

  // TODO: if need be, apply this logic to the padding/update this function
  const labelPadding = useCallback(() => {
    if (isShortAnswerEnabled) {
      if (datum.answerCorrect)
        return mediumLargePadding * 2;
      return mediumLargePadding;
    }
    return defaultVictoryPadding + xSmallPadding;
  }, [isShortAnswerEnabled, datum.answerCorrect, mediumLargePadding, defaultVictoryPadding, xSmallPadding]);

  return (
    <g>
      {datum.answerCorrect && (
        // TODO: maybe add these dimensions in theme?
        <foreignObject x={0} y={y - barThickness / 2} width={16} height={16}>
          <span>
            <img src={check} alt="correct answer" />
          </span>
        </foreignObject>
      )}
      <VictoryLabel
        {...props}
        // TODO: clean this up
        x={x > 70 ? x - labelOffset : x + 12}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.answerCount > 0 ? `${Math.ceil(datum.answerCount)}` : ''}
        style={{
          fontSize: `${theme.typography.h5.fontSize}`,
          fill:
            datum.answerCount === 0 ||
              datum.answerChoice === '-' ||
              x <= 70
              ? `${theme.palette.primary.main}`
              : `${theme.palette.primary.darkBlue}`,
        }}
      />
    </g>
  );
}
