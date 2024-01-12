import React from 'react';
import { Bar } from 'victory';
import { useTheme, styled } from '@mui/material/styles';

// TODO: figure out what to do about keeping graph as 'confidence' instead of 
// current toggle functionality based on click behavior
interface GraphClickInfo {
  graph: string | null;
  selectedIndex: number | null;
}

interface BarProps {
  x?: number;
  selectedWidth: number;
  selectedHeight: number;
  index?: number;
  graphClickInfo: GraphClickInfo;
  handleGraphClick: ({ graph, selectedIndex }: { graph: string | null; selectedIndex: number | null; }) => void;
}

const StyledBar = styled(Bar)(({ theme }) => ({
  '-webkit-tap-highlight-color': `${theme.palette.primary.graphAccentColor} !important `,
  '-webkit-touch-callout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));


export default function CustomBar(props: BarProps) {
  const {
    x,
    selectedWidth,
    selectedHeight,
    index,
    graphClickInfo,
    handleGraphClick,
  } = props;

  const offset = selectedWidth / 2;
  const graphTitleOffset = 28;

  const theme = useTheme(); // eslint-disable-line

  return (
    <g style={{ pointerEvents: 'visible' }}>
      <StyledBar {...props} />
      <rect
        x={x !== undefined ? x - offset : - offset}
        y={graphTitleOffset}
        width={selectedWidth}
        height={selectedHeight - graphTitleOffset}
        fill={
          graphClickInfo.selectedIndex != null &&
            graphClickInfo.selectedIndex === index
            ? `${theme.palette.primary.graphAccentColor}`
            : 'transparent'
        }
        stroke="transparent"
        rx={8}
        ry={8}
        onClick={() => {
          if (index !== null && index !== undefined) {
            handleGraphClick({ graph: 'confidence', selectedIndex: index })
          }
        }
        }
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
}

// const useStyles = makeStyles((selectedBarValue: any, index: number) => ({
//   highlight: {
//     '&:hover': {
//       fill: 'rgba(255, 255, 255, 0.2)',
//     },
//   },
// }));
