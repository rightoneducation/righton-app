import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((selectedBarValue, index) => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)',
    }
  }
}));

// TODO: adjust height/y of highlight
const CustomBar = (props) => {
  const { x, y, smallPadding, selectedWidth, selectedHeight, datum, index, selectedBarValue, setSelectedBarValue } = props;
  const offset = selectedWidth / 2;
  const classes = useStyles();
  return (
    <g style={{ pointerEvents: 'bounding-box' }}>
      <Bar {...props} />
      <rect
        className={classes.highlight}
        x={x - offset}
        y={y - smallPadding - offset / 2}
        width={selectedWidth}
        height={selectedHeight}
        fill={selectedBarValue === index ? "rgba(255, 255, 255, 0.2)" : "transparent"}
        stroke="transparent"
        rx={8}
        ry={8}
        onClick={() => setSelectedBarValue(datum.value)}
      />
    </g>
  );
};

export default CustomBar;