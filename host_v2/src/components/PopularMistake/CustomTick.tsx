import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryLabel } from 'victory';

interface TickProps {
  x?: number;
  y?: number;
  index?: number;
  text?: string;
  correctChoiceIndex: number;
  statePosition: number;
}

export default function CustomTick({
  x,
  y,
  index,
  text,
  correctChoiceIndex,
  statePosition,
}: TickProps) {
  const theme = useTheme(); // eslint-disable-line
  const showCustomTick = index === correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const commonStyle = {
    fill: fillTick ? `${theme.palette.primary.graphTickLabelColorLight}` : `${theme.palette.primary.graphTickLabelColorDark}`,
    fontFamily: 'Poppins',
    fontWeight: `${theme.typography.h5.fontWeight}`,
    fontSize: `${theme.typography.h5.fontSize}`,
  };

  return (
    <g>
      <VictoryLabel x={x} y={y} text={text} style={commonStyle} />
    </g>
  );
}