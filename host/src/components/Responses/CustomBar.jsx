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
const isOpenEnded = true;

const CustomBar = (props) => {
  const {x, y, xSmallPadding, mediumPadding, xxxLargePadding, selectedWidth, selectedHeight, datum, index, selectedBarIndex, setSelectedBarIndex} = props;
  const classes = useStyles();
  
  const isSelected = selectedBarIndex === index;

  // Toggle the selected state when the bar is clicked
  const toggleSelection = () => {
    if (isSelected) {
      // If the bar is already selected, deselect it
      setSelectedBarIndex(null);
    } else {
      // If the bar is not selected, select it
      setSelectedBarIndex(index);
    }
  };

  return (
      <g  style={{pointerEvents: 'bounding-box'}}>
        <Bar {...props} />
        {datum.answerCount > 0 && 
          <rect
              className={classes.highlight}
              x={isOpenEnded ? 0 : xxxLargePadding}
              y={isOpenEnded ? y-40 : y-mediumPadding}
              width={selectedWidth}
              height={isOpenEnded ? 56 : selectedHeight+mediumPadding-(xSmallPadding/2)}
              fill={selectedBarIndex === index ? "rgba(255, 255, 255, 0.2)" : "transparent"}
              stroke="transparent"
              rx={8}
              ry={8}
              onClick={toggleSelection}
              style={{cursor: 'pointer'}}
            />
        }
    </g>
    );
};

export default CustomBar;