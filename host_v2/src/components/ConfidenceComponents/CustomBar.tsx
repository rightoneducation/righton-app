import React from 'react';
import { Bar } from 'victory';
// import { makeStyles } from '@mui/styles';

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
            graphClickInfo.selectedIndex === index &&
            graphClickInfo.graph === 'confidence'
            ? 'rgba(255, 255, 255, 0.2)'
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
