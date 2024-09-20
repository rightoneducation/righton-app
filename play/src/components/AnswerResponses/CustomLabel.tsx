import React from 'react';
import { VictoryLabel } from 'victory';
import { useTheme } from '@mui/material/styles';

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
    <g style={{maxWidth: '100%'}}>
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
                fill: 'rgba(56,66,102,0.5)',
                fontWeight: 700
              }}
            />
          )}
          <VictoryLabel
          {...props}
          text={`${datum.count}`}
          style={{
            fontSize: 18,
            fill: "#384466"
          }}
        />
      </>
      )}
    </g>
  );
}
