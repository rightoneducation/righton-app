import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';

export default function CustomBar (props) {
  const {
    x, 
    y, 
    xSmallPadding, 
    mediumPadding, 
    defaultVictoryPadding, 
    selectedWidth, 
    selectedHeight, 
    datum, 
    index, 
    graphClickInfo, 
    setGraphClickInfo
  } = props;
  const classes = useStyles();
  return (
      <g  style={{pointerEvents: 'bounding-box'}}>
        <Bar {...props}/>
        {datum.answerCount > 0 && 
          <rect
              className={classes.highlight}
              x={defaultVictoryPadding - xSmallPadding}
              y={y-mediumPadding}
              width={selectedWidth + defaultVictoryPadding}
              height={selectedHeight + mediumPadding - (xSmallPadding/2)}
              fill={graphClickInfo.selectedIndex && graphClickInfo.selectedIndex === index && graphClickInfo.graph === 'realtime' ? "rgba(255, 255, 255, 0.2)" : "transparent"}
              stroke="transparent"
              rx={8}
              ry={8}
              onClick={() => setGraphClickInfo({graph: 'realtime', selectedIndex: index})}
              style={{cursor: 'pointer'}}
            />
        }
    </g>
    );
};

const useStyles = makeStyles(() => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)' ,
    }
  }
}));