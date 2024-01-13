import React from 'react';
import { Bar } from 'victory';

interface BarProps {
  x?: any;
  y?: any;
  xSmallPadding?: any;
  mediumPadding?: any;
  defaultVictoryPadding?: any;
  selectedWidth?: any;
  selectedHeight?: any;
  datum?: any;
  index?: any;
  graphClickInfo?: any;
  handleGraphClick?: any;
  isShortAnswerEnabled?: any;
}

export default function CustomBar(props: BarProps) {
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
    handleGraphClick,
    isShortAnswerEnabled
  } = props;
  // const classes = useStyles();
  return (
    <g style={{ pointerEvents: 'auto' }}>
      <Bar {...props} />
      {datum.answerCount > 0 && (
        <rect
          // className={classes.highlight}
          x={isShortAnswerEnabled ? 0 : defaultVictoryPadding - xSmallPadding}
          y={y - mediumPadding}
          width={selectedWidth + defaultVictoryPadding}
          height={selectedHeight + mediumPadding - xSmallPadding / 2}
          fill={
            graphClickInfo.selectedIndex &&
              graphClickInfo.selectedIndex === index &&
              graphClickInfo.graph === 'realtime'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          onClick={() =>
            handleGraphClick({ graph: 'realtime', selectedIndex: index })
          }
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}

// const useStyles = makeStyles(() => ({
//   highlight: {
//     '&:hover': {
//       fill: 'rgba(255, 255, 255, 0.2)',
//     },
//   },
// }));
