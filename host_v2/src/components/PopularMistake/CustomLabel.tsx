import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';

interface Team {
  name: string;
}

interface PopularMistakeOption {
  answerChoice: string;
  answerCorrect: boolean;
  answerCount: number;
  answerTeams: Team[];
  answerText: string;
}

interface LabelProps {
  x?: any;
  y?: number;
  datum?: any;
  barThickness: number;
  labelOffset: number;
  xSmallPadding: number;
  mediumLargePadding: number;
  defaultVictoryPadding: number;
  isShortAnswerEnabled: boolean;
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
    defaultVictoryPadding,
    isShortAnswerEnabled
  } = props;

  const theme = useTheme(); // eslint-disable-line
  // done to prevent embedding a nested ternary in the render function

  // TODO: if need be, apply this logic to the padding/update this function
  // const labelPadding = useCallback(() => {
  //   if (isShortAnswerEnabled) {
  //     if (datum !== undefined && datum.answerCorrect)
  //       return mediumLargePadding * 2;
  //     return mediumLargePadding;
  //   }
  //   return defaultVictoryPadding + xSmallPadding;
  // }, [isShortAnswerEnabled, datum.answerCorrect, mediumLargePadding, defaultVictoryPadding, xSmallPadding]);

  return (
    <g>
      {datum.answerCorrect && (
        // TODO: maybe add these dimensions in theme?
        <foreignObject x={2} y={y !== undefined ? y - barThickness / 2 : 0} width={16} height={16}>
          <span>
            <img src={check} alt="correct answer" />
          </span>
        </foreignObject>
      )}
      <VictoryLabel
        {...props}
        // TODO: clean this up
        x={theme.typography.h5.fontSize !== undefined &&
          x > theme.typography.h5.fontSize &&
          x <= theme.typography.h5.fontSize ?
          x - labelOffset : x + 12}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.answerCount > 0 ? `${Math.ceil(datum.answerCount)}` : ''}
        style={{
          fontSize: `${theme.typography.h5.fontSize}`,
          fill:
            datum.answerCount === 0 ||
              datum.answerChoice === '-' ||
              (theme.typography.h5.fontSize !== undefined && x <= theme.typography.h5.fontSize)
              ? `${theme.palette.primary.main}`
              : `${theme.palette.primary.darkBlue}`,
        }}
      />
    </g>
  );
}
