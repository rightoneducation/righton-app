import React from 'react';
import { Bar } from 'victory';
import { Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

interface BarProps {
  // TODO: change these to their correct types (and make them non-optional)
  x?: any;
  selectedWidth?: any;
  selectedHeight?: any;
  index?: any;
  graphClickInfo?: any;
  handleGraphClick: any;
}

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

  // const classes = useStyles();
  return (
    <g style={{ pointerEvents: 'visible' }}>
      <Bar {...props} />
      <rect
        // className={classes.highlight}
        x={x - offset}
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
        onClick={() =>
          handleGraphClick({ graph: 'confidence', selectedIndex: index })
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