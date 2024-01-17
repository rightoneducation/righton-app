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
  y?: number;
  dynamicWidth: number;
  datum?: PopularMistakeOption;
  index?: number;
  graphClickIndex: number | null;
  handleGraphClick: (selectedIndex: number | null) => void;
}

export default function CustomBar(props: BarProps) {
  const {
    y,
    dynamicWidth,
    datum,
    index,
    graphClickIndex,
    handleGraphClick
  } = props;
  const theme = useTheme(); // eslint-disable-line

  const highlightHeight = theme.sizing.responseBarThickness + theme.sizing.barHighlightPadding;

  return (
    <g style={{ pointerEvents: 'auto' }}>
      <Bar {...props} />
      {datum !== undefined && datum.answerCount > 0 && (
        <rect
          x={0}
          y={y !== undefined ? y - highlightHeight / 2 : 0}
          width={dynamicWidth + theme.sizing.defaultVictoryPadding}
          height={highlightHeight}
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

