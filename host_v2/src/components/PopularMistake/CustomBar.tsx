import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Bar } from 'victory';

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

interface BarProps {
  x?: number;
  y?: number;
  xSmallPadding: number;
  defaultVictoryPadding: number;
  selectedWidth: number;
  selectedHeight: number;
  datum?: PopularMistakeOption;
  index?: number;
  graphClickIndex: number | null;
  handleGraphClick: (selectedIndex: number | null) => void;
  isShortAnswerEnabled: boolean;
}

export default function CustomBar(props: BarProps) {
  const {
    x,
    y,
    xSmallPadding,
    defaultVictoryPadding,
    selectedWidth,
    selectedHeight,
    datum,
    index,
    graphClickIndex,
    handleGraphClick,
    isShortAnswerEnabled
  } = props;
  const theme = useTheme(); // eslint-disable-line

  return (
    <g style={{ pointerEvents: 'auto' }}>
      <Bar {...props} />
      {datum !== undefined && datum.answerCount > 0 && (
        <rect
          x={isShortAnswerEnabled ? 0 : defaultVictoryPadding - xSmallPadding}
          y={y !== undefined ? y - theme.sizing.smallPadding : - theme.sizing.smallPadding}
          width={selectedWidth + defaultVictoryPadding}
          // TODO: clean this up
          height={selectedHeight + theme.sizing.smallPadding - xSmallPadding / 2}
          fill={
            graphClickIndex !== null &&
              graphClickIndex === index
              ? `${theme.palette.primary.graphAccentColor}`
              : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          onClick={() => {
            if (index !== undefined) {
              handleGraphClick(index)
            }
          }
          }
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}

