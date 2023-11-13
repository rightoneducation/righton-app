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
    noResponseLabel
  } = props;

  return (
    <g>
      {datum.hintCount !== 0 && (
        <VictoryLabel
          {...props}
          x={mediumLargePadding}
          y={y- labelOffset}
          dx={0}
          dy={-barThickness / 2 - xSmallPadding}
          textAnchor="start"
          verticalAnchor="end"
          text={datum.hintText}
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
        text={datum.hintCount > 0 ? `${Math.ceil(datum.hintCount)}` : ''}
        style={{
          fontSize: 15,
          fill:
            datum.hintCount === 0 ||
            datum.hintText === noResponseLabel ||
            x <= 70
              ? '#FFF'
              : '#384466',
        }}
      />
    </g>
  );
}
