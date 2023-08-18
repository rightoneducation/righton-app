import React from 'react';
import { VictoryLabel } from 'victory';

const CustomLabel = (props) => {
  const { x, y, datum, barThickness,labelOffset, xSmallPadding, mediumLargePadding, defaultVictoryPadding } = props;
  return (
      <g>
        {datum.count !== 0 && 
          <VictoryLabel 
            {...props}
            x={defaultVictoryPadding + xSmallPadding} 
            y={y - labelOffset}
            dx={0}
            dy={(-barThickness/2) - xSmallPadding}
            textAnchor="start"
            verticalAnchor="end"
            text={`${datum.word}`}
            style={{
              fontSize: 15,
              fill: 'white',
            }} 
          />
        }
        <VictoryLabel 
          {...props}
          x={x > 70 ? x - labelOffset : x + mediumLargePadding }
          y={y}
          textAnchor="end"
          verticalAnchor="middle"
          text={ datum.count > 0 ? `${datum.count}` : ''}
          style={{
            fontSize: 15,
            fill:  x <= 70 ? '#FFF' : '#384466',
          }} 
        />
   </g>
    );
};

export default CustomLabel;