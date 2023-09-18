import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';

export default function CustomBar(props) {
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
  const classes = useStyles();
  return (
    <g style={{ pointerEvents: 'bounding-box' }}>
      <Bar {...props} />
      <rect
        className={classes.highlight}
        x={x - offset}
        y={graphTitleOffset}
        width={selectedWidth}
        height={selectedHeight - graphTitleOffset}
        fill={
          graphClickInfo.selectedIndex &&
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

const useStyles = makeStyles((selectedBarValue, index) => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));
