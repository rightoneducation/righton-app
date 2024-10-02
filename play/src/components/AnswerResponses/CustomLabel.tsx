import React from 'react';
import { VictoryLabel } from 'victory';
import { Box, Typography } from '@mui/material';
import check from '../../img/Pickedcheck.svg';

export default function CustomLabel(props: any) {
  const {x, y, width, height, datum} = props;
  const centerX = width / 2;
  const centerY = height / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const labelFactor = 0.5;
  const labelX = centerX + deltaX * labelFactor;
  const labelY = centerY + deltaY * labelFactor;

  return (
    <g style={{width}}>
      {datum.count !== 0 && (
        <>
          {datum.letterCode !== ' ' && (
            <VictoryLabel
              {...props}
              x={labelX}
              y={labelY}
              text={`${datum.letterCode}`}
              style={{
                fontSize: 24,
                fill: `${datum.fill}`,
                fontWeight: 700
              }}
            />
          )}
            <VictoryLabel
              {...props}
              x={x}
              y={y}
              text={`${datum.count}`}
              style={{
                fontSize: 16,
              }}
            />
          {/* foreignObject is placed based on top-left positioning, while VictoryLabel is center positioned */}
          <foreignObject x={x} y={y} width="60px" height="20px" style={{transform: `translate(-17px, 15px)`}}>
            <Box style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
              { datum.fill === '#6F9E3C' &&
                <img src={check} alt="check" />
              }
            </Box>
          </foreignObject>
      </>
      )}
    </g>
  );
}
