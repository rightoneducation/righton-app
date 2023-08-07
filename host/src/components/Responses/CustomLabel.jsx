import React from 'react';
import { VictoryLabel } from 'victory';

const CustomLabel = (props) => {
  const { x, y, datum, barThickness, smallPadding, defaultVictoryPadding, noResponseLabel } = props;
  console.log("x"+x);
  return (
      <g>
        {datum.answerCount !== 0 && 
          <VictoryLabel 
            {...props}
            x={defaultVictoryPadding + 4} 
            y={y - 3}
            dx={0}
            dy={(-barThickness/2) - smallPadding/2}
            textAnchor="start"
            verticalAnchor="end"
            text={`${datum.answerText}`}
            style={{
              fontSize: 15,
              fill: 'white',
            }} 
          />
        }
        <VictoryLabel 
          {...props}
          x={x >= 70 ? x-4 : x+10 }
          y={y}
          textAnchor="end"
          verticalAnchor="middle"
          text={ datum.answerCount > 0 ? `${datum.answerCount}` : ''}
          style={{
            fontSize: 15,
            fill: datum.answerCount === 0 || datum.answerChoice === noResponseLabel ? '#FFF' : '#384466',
          }} 
        />
   </g>
    );
};

export default CustomLabel;