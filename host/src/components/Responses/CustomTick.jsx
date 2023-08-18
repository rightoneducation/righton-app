import React from 'react';
import { VictoryLabel } from 'victory';
import { Tooltip } from '@material-ui/core';

const CustomTick = ({ x, y,  text }) => {
  const commonStyle = {
    fill: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: '16px',
  };


  return (
    <g>
          <VictoryLabel x={x} y={y} text={text} style={commonStyle} />
    </g>
  );
};

export default CustomTick;
