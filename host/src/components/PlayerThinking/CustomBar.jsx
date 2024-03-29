import React from 'react';
import { Bar } from 'victory';
import { makeStyles } from '@material-ui/core';
import { isNullOrUndefined } from '@righton/networking';

export default function CustomBar(props) {
  const {
    y,
    xSmallPadding,
    mediumPadding,
    defaultVictoryPadding,
    selectedWidth,
    selectedHeight,
    datum,
    index,
    graphClickInfo,
    handleGraphClick
  } = props;
  const classes = useStyles();
  return (
    <g style={{ pointerEvents: 'bounding-box' }}>
      <Bar {...props} />
      {datum.teams.length > 0 && (
        <rect
          className={classes.highlight}
          x={0}
          y={y - mediumPadding}
          width={selectedWidth + defaultVictoryPadding}
          height={selectedHeight + mediumPadding - xSmallPadding / 2}
          fill={
            graphClickInfo.selectedIndex &&
            graphClickInfo.selectedIndex === index &&
            graphClickInfo.graph === 'hint'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          onClick={() =>
            handleGraphClick({ graph: 'hint', selectedIndex: index })
          }
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}

const useStyles = makeStyles(() => ({
  highlight: {
    '&:hover': {
      fill: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));
