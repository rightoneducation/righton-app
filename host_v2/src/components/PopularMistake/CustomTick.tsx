import React from 'react';
import { VictoryLabel } from 'victory';
import { Tooltip } from '@mui/material';
import check from '../../images/Pickedcheck.svg';
import noResponse from '../../images/noResponse.svg';


interface TickProps {
  x?: any;
  y?: any;
  index?: any;
  text?: any;
  data?: any;
  correctChoiceIndex?: any;
  statePosition?: any;
  mediumPadding?: any;
  largePadding?: any;
  isShortAnswerEnabled?: any;
}

export default function CustomTick({
  x,
  y,
  index,
  text,
  data,
  correctChoiceIndex,
  statePosition,
  mediumPadding,
  largePadding,
  isShortAnswerEnabled
}: TickProps) {
  // const classes = useStyles();
  const showCustomTick = index === correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const isNoResponse = index === 0;
  const commonStyle = {
    fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: '16px',
  };

  return (
    <g>
      {showCustomTick && (
        <foreignObject
          x={x - largePadding}
          y={y - largePadding / 2.5}
          width={16}
          height={18}
        >
          <Tooltip
            title={
              <div>
                {/* className={classes.tooltip}> */}
                This is the {'\n'} correct answer
              </div>
            }
            placement="bottom"
            arrow
          >
            <span>
              {/* <img src={check} alt="correct answer" /> */}
            </span>
          </Tooltip>
        </foreignObject>
      )}
      {isNoResponse ? (
        <foreignObject x={x - 1} y={y - mediumPadding} width={16} height={32}>
          <Tooltip
            title={
              <div>
                {/* className={classes.tooltip}> */}
                Players who {'\n'} have not responded
              </div>
            }
            placement="bottom"
            arrow
          >
            <span>
              {/* <img src={noResponse} alt="no response" /> */}
            </span>
          </Tooltip>
        </foreignObject>
      ) : (
        <VictoryLabel x={x} y={y} text={text} style={commonStyle} />
      )}
    </g>
  );
}

// const useStyles = makeStyles({
//   tooltip: {
//     whiteSpace: 'pre-line',
//     textAlign: 'center',
//   },
// });
