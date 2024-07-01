import React, {useCallback} from 'react';
import { VictoryLabel } from 'victory';
import { useTheme } from '@mui/material/styles';
import check from '../../img/Pickedcheck_white.svg';

export default function CustomLabel(props: any) {
  const {x, y, datum, noResponseLabel} = props;
  const theme = useTheme();
  const labelPadding = theme.sizing.defaultVictoryPadding + theme.sizing.xxSmPadding;
 

  return (
    <g>
      {datum.count !== 0 && (
        <VictoryLabel
          {...props}
          x={labelPadding}
          y={y- theme.sizing.labelOffsetResponses}
          dx={0}
          dy={-theme.sizing.barThicknessResponses / 2 - theme.sizing.xxSmPadding}
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
        x={x > 70 ? x - theme.sizing.labelOffsetResponses : x + (theme.sizing.mdPadding - theme.sizing.xxSmPadding)}
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
