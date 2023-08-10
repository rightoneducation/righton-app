import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((selectedBarIndex, index) => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)' ,
    }
  }
}));

const CustomBar = (props) => {
  const {x, y, smallPadding, selectedWidth, selectedHeight, datum, index, selectedBarIndex, setSelectedBarIndex} = props;
  const offset = 14;
  const classes = useStyles();
  return (
      <g  style={{pointerEvents: 'bounding-box'}}>
        <Bar {...props} />
        {datum.answerCount > 0 && 
          <rect
              className={classes.highlight}
              x={0}
              y={y-smallPadding-16/2}
              width={selectedWidth}
              height={selectedHeight + offset}
              fill={selectedBarIndex === index ? "rgba(255, 255, 255, 0.2)" : "transparent"}
              stroke="transparent"
              rx={8}
              ry={8}
              onClick={() => setSelectedBarIndex(index)}
              style={{cursor: 'pointer'}}
            />
        }
    </g>
    );
};

export default CustomBar;