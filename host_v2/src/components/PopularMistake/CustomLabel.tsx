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

// TODO: try to type x, datum
interface LabelProps {
  x?: any;
  y?: number;
  datum?: any;
}

export default function CustomLabel(props: LabelProps) {
  const {
    x,
    y,
    datum
  } = props;

  const theme = useTheme(); // eslint-disable-line

  return (
    <g>
      {datum.answerCorrect && (
        <foreignObject x={5} y={y !== undefined ? y - theme.sizing.responseBarThickness / 2 : 0} width={16} height={16}>
          <span>
            <img src={check} alt="correct answer" />
          </span>
        </foreignObject>
      )}
      <VictoryLabel
        {...props}
        x={x - theme.sizing.countLabelPadding}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.answerCount > 0 ? `${Math.ceil(datum.answerCount)}` : ''}
        style={{
          fontSize: `${theme.typography.h5.fontSize}`,
          fill:
            datum.answerCount === 0 ||
              datum.answerChoice === '-'
              ? `${theme.palette.primary.main}`
              : `${theme.palette.primary.darkBlue}`,
        }}
      />
    </g>
  );
}
