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
  const {x, y, xSmallPadding, smallPadding, mediumPadding, defaultVictoryPadding, selectedWidth, selectedHeight, datum, index, selectedBarIndex, setSelectedBarIndex} = props;
  const classes = useStyles();
  return (
      <g  style={{pointerEvents: 'bounding-box'}}>
        <Bar {...props} />
        {datum.answerCount > 0 && 
          <rect
              className={classes.highlight}
              x={defaultVictoryPadding}
              y={y-mediumPadding}
              width={selectedWidth + smallPadding}
              height={selectedHeight + mediumPadding - (xSmallPadding/2)}
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