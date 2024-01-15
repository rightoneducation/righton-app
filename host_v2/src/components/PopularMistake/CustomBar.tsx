import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Bar } from 'victory';

// TODO: proper types
interface BarProps {
  x?: any;
  y?: any;
  xSmallPadding?: any;
  defaultVictoryPadding?: any;
  selectedWidth?: any;
  selectedHeight?: any;
  datum?: any;
  index?: any;
  graphClickInfo?: any;
  handleGraphClick?: any;
  isShortAnswerEnabled?: any;
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
    graphClickInfo,
    handleGraphClick,
    isShortAnswerEnabled
  } = props;
  const theme = useTheme(); // eslint-disable-line

  return (
    <g style={{ pointerEvents: 'auto' }}>
      <Bar {...props} />
      {datum.answerCount > 0 && (
        <rect
          x={isShortAnswerEnabled ? 0 : defaultVictoryPadding - xSmallPadding}
          y={y - theme.sizing.smallPadding}
          width={selectedWidth + defaultVictoryPadding}
          // TODO: clean this up
          height={selectedHeight + theme.sizing.smallPadding - xSmallPadding / 2}
          fill={
            graphClickInfo.selectedIndex !== null &&
              graphClickInfo.selectedIndex === index &&
              graphClickInfo.graph === 'realtime'
              ? `${theme.palette.primary.graphAccentColor}`
              : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          // TODO: changle handle graph click based on new definition 
          onClick={() =>
            handleGraphClick({ graph: 'realtime', selectedIndex: index })
          }
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}

