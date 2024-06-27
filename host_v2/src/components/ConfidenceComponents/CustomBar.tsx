import React from 'react';
import { Bar } from 'victory';
import { useTheme } from '@mui/material/styles';
import { IGraphClickInfo } from '../../lib/HostModels';

interface BarProps {
  x?: number;
  selectedWidth: number;
  selectedHeight: number;
  index?: number;
  graphClickIndex: number | null;
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

export default function CustomBar(props: any) {
  const {
    x,
    selectedWidth,
    selectedHeight,
    index,
    graphClickIndex,
    handleGraphClick,
  } = props;

  const offset = selectedWidth / 2;
  const graphTitleOffset = 28;

  const theme = useTheme(); // eslint-disable-line

  return (
    <g style={{ pointerEvents: 'visible' }}>
      <Bar {...props} />
      <rect
        x={x !== undefined ? x - offset : -offset}
        y={graphTitleOffset}
        width={selectedWidth}
        height={selectedHeight - graphTitleOffset}
        fill={
          graphClickIndex != null && graphClickIndex === index
            ? `${theme.palette.primary.graphAccentColor}`
            : 'transparent'
        }
        stroke="transparent"
        rx={8}
        ry={8}
        onClick={() => {
          if (index !== null && index !== undefined) {
            handleGraphClick({graph: 'confidence', selectedIndex: index});
          }
        }}
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
}
