import React from 'react';
import { VictoryLabel } from 'victory';

export default function CustomLabel(props) {
  const {
    x,
    y,
    datum,
    barThickness,
    labelOffset,
    xSmallPadding,
    mediumLargePadding,
    defaultVictoryPadding,
    noResponseLabel,
  } = props;
  return (
    <g>
      {datum.answerCount !== 0 && (
        <VictoryLabel
          {...props}
          x={defaultVictoryPadding + xSmallPadding}
          y={y - labelOffset}
          dx={0}
          dy={-barThickness / 2 - xSmallPadding}
          textAnchor="start"
          verticalAnchor="end"
          text={`${datum.answerText}`}
          style={{
            fontSize: 15,
            fill: 'white',
          }}
        />
      )}
      <VictoryLabel
        {...props}
        x={x > 70 ? x - labelOffset : x + mediumLargePadding}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.answerCount > 0 ? `${Math.ceil(datum.answerCount)}` : ''}
        style={{
          fontSize: 15,
          fill:
            datum.answerCount === 0 ||
            datum.answerChoice === noResponseLabel ||
            x <= 70
              ? '#FFF'
              : '#384466',
        }}
      />
    </g>
  );
}
