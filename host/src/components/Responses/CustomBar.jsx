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
  const {
    x, 
    y, 
    xSmallPadding,
    mediumPadding, 
    xxxLargePadding, 
    selectedWidth, 
    selectedHeight, 
    datum, 
    index, 
    selectedBarIndex, 
    setSelectedBarIndex, 
    isOpenEnded,
    xxLargePadding,
    xxxxLargePadding
  } = props;
  const classes = useStyles();
  
  const isSelected = selectedBarIndex === index;

  const toggleSelection = () => {
    if (isSelected) {
      setSelectedBarIndex(null);
    } else {
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
              y={isOpenEnded ? y-xxLargePadding : y-mediumPadding}
              width={selectedWidth}
              height={isOpenEnded ? xxxxLargePadding : selectedHeight+mediumPadding-(xSmallPadding/2)}
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