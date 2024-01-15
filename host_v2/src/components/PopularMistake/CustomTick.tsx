import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VictoryLabel } from 'victory';

// TODO: proper types
interface TickProps {
  x?: any;
  y?: any;
  index?: any;
  text?: any;
  data?: any;
  correctChoiceIndex?: any;
  statePosition?: any;
  isShortAnswerEnabled?: any;
}

export default function CustomTick({
  x,
  y,
  index,
  text,
  data,
  correctChoiceIndex,
  statePosition,
  isShortAnswerEnabled
}: TickProps) {
  const theme = useTheme(); // eslint-disable-line
  const showCustomTick = index === correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  // TODO: find some way to check if the datum is 'no response' in a way that is cleaner/more dynamic
  const isNoResponse = text === '-';
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