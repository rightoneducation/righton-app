import React from 'react';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';
import noResponse from '../../images/noResponse.svg'
import { Tooltip } from '@material-ui/core';

export default function CustomTick ({ 
  x, 
  y, 
  index,
  text, 
  data, 
  correctChoiceIndex, 
  statePosition, 
  mediumPadding, 
  largePadding 
}) {
  const showCustomTick = index === data.length - 1 - correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const isNoResponse = index === data.length - 1;
  const commonStyle = {
    fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: '16px',
  };

  return (
    <g>
      {showCustomTick && (
        <foreignObject x={x - largePadding} y={y - largePadding / 2.5} width={16} height={18}>
          <Tooltip title="This is the correct answer" placement="top" >
            <span>
              <img src={check} alt="correct answer" />
            </span>
          </Tooltip>
        </foreignObject>
      )}
        {isNoResponse ? (
          <foreignObject x={x-1} y={y - mediumPadding} width={16} height={32}>
            <Tooltip title="Players who have not responded" placement="top">
              <span>
                <img src={noResponse} alt="no response"/>
              </span>
            </Tooltip>
          </foreignObject>
        ) : (
          <VictoryLabel x={x} y={y} text={text} style={commonStyle} />
        )}
    </g>
  );
};