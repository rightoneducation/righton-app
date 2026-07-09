import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryLabel } from 'victory';
import { Box, Typography } from '@mui/material';
import check from '../../img/Pickedcheck.svg';

export default function CustomLabel(props: any) {
  const theme = useTheme();
  const { x, y, width, height, datum, ...rest } = props;
  const centerX = width / 2;
  const centerY = height / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const labelFactor = 0.5;
  const labelX = centerX + deltaX * labelFactor;
  const labelY = centerY + deltaY * labelFactor;
  const iconSize = 16;
  const labelDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const barCenterFactor = 0.82;
  const barCenterX = centerX + deltaX * barCenterFactor - (deltaX / labelDist) * (iconSize / 4);
  const barCenterY = centerY + deltaY * barCenterFactor - (deltaY / labelDist) * (iconSize / 4);
  return (
        <>
          {datum.letterCode !== ' ' && (
            <VictoryLabel
              {...props}
              x={labelX}
              y={labelY}
              text={`${datum.letterCode}`}
              style={{
                fontSize: 20,
                fill: `rgba(56, 68, 102, 0.5)`,
                fontWeight: 700
              }}
            />
          )}    
          <text x={x} y={y} style={{ fontFamily: theme.typography.smallLabel.fontFamily, fontWeight: theme.typography.smallLabel.fontWeight, fontSize: theme.typography.smallLabel.fontSize, fill: theme.palette.primary.darkBlue, textAnchor: 'middle', dominantBaseline: 'middle' }}>
            {datum.percentage} 
          </text>
          { datum.isCorrect &&
            <svg x={barCenterX-8} y={barCenterY-8} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7.5" stroke="white" strokeWidth={1}/>
              <path d="M3.78125 9.04018L6.49268 11.7516L12.6632 5.58105" stroke="white" strokeWidth={1} strokeLinecap="round"/>
            </svg>
          }
      </>
  );
}
