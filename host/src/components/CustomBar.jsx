import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((selectedBarIndex, index) => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)',
    }
  }
}));



const CustomBar = (props) => {
  const { x, y, smallPadding, selectedWidth, selectedHeight, index, selectedBarIndex, setSelectedBarIndex } = props;
  const offset = selectedWidth / 2;
  const classes = useStyles();
  const testfun = (index) => {
    console.log("BAR TEST");
    setSelectedBarIndex(index)
  }

  return (
    <g style={{ pointerEvents: 'bounding-box' }}>
      <Bar {...props} />

      <rect
        className={classes.highlight}
        x={x - offset}
        y={y - smallPadding - offset / 2}
        width={selectedWidth}
        height={selectedHeight}
        fill={selectedBarIndex === index ? "rgba(255, 255, 255, 0.2)" : "transparent"}
        stroke="transparent"
        rx={8}
        ry={8}
        onClick={() => testfun(index)}
      />

    </g>
  );
};

export default CustomBar;