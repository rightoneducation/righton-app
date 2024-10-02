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
  console.log(x, y);
  return (
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
          <text x={x} y={y} style={{ fontSize: '16px', fill: 'black', textAnchor: 'middle', dominantBaseline: 'middle' }}>
            {datum.count} 
          </text>
          { datum.fill === '#6F9E3C' &&
            <svg x={x-6} y={y+5} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7.5" stroke="rgba(111, 158, 60, 1)"/>
              <path d="M3.78125 9.04018L6.49268 11.7516L12.6632 5.58105" stroke="rgba(111, 158, 60, 1)" strokeLinecap="round"/>
            </svg>
          }
      </>
  );
}
