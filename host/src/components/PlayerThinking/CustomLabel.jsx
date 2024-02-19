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
      {datum.teams.length !== 0 && (
        <VictoryLabel
          {...props}
          x={mediumLargePadding}
          y={y- labelOffset}
          dx={0}
          dy={-barThickness / 2 - xSmallPadding}
          textAnchor="start"
          verticalAnchor="end"
          text={datum.themeText}
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
        text={datum.teams.length > 0 ? `${Math.ceil(datum.teams.length)}` : ''}
        style={{
          fontSize: 15,
          fill:
            datum.teams.length === 0 ||
            datum.themeText === noResponseLabel ||
            x <= 70
              ? '#FFF'
              : '#384466',
        }}
      />
    </g>
  );
}
