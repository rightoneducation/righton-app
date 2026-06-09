import React, { useMemo } from 'react';
import { Bar } from 'victory';
import { styled, useTheme } from '@mui/material/styles';

const HighlightRectangle = styled('rect')({
  cursor: 'pointer', 
  '&:hover': {
    fill:'rgba(235, 255, 218, 0.4)',
  },
});

export function CustomBar(props: any) {
  const theme = useTheme();
  const { 
    datum,
    y,
    customBarSelectedWidth,
    index,
    statePosition,
    graphClickInfo,
    setGraphClickInfo,
    isShortAnswerEnabled,
    isPrevPhaseResponses
   } = props;
   const height = (isShortAnswerEnabled ? 36 : 16) + theme.sizing.mdPadding - theme.sizing.xSmPadding / 2;
   // wrapping this in a useMemo in an effort to avoid any additional renders
   const isSelected = useMemo(() =>{
      // ensure that 0 isn't treated as falsy
      return graphClickInfo.selectedIndex !== null &&
      graphClickInfo.selectedIndex !== undefined &&
      graphClickInfo.selectedIndex === index &&
      (statePosition < 6 || (statePosition > 6 && isPrevPhaseResponses) ? graphClickInfo.graph === 'realtimephase1' : graphClickInfo.graph === 'realtimephase2');
   }, [graphClickInfo.selectedIndex, index, graphClickInfo.graph, statePosition, isPrevPhaseResponses]);
  return (
    <g>
      <Bar {...props} />
      {datum.count > 0 && (
        <HighlightRectangle
          x =  {isShortAnswerEnabled ? 0 : theme.sizing.defaultVictoryPadding - theme.sizing.xSmPadding - theme.sizing.mdPadding}
          y =  {isShortAnswerEnabled ? y - theme.sizing.xLgPadding + theme.sizing.xSmPadding : y - theme.sizing.smPadding}
          width = {customBarSelectedWidth + theme.sizing.defaultVictoryPadding + (isShortAnswerEnabled ? 0 : theme.sizing.mdPadding) + theme.sizing.xSmPadding }
          height = {height}
          fill={
            isSelected
              ? 'rgba(235, 255, 218, 0.4)'
              : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          onClick={() =>
            setGraphClickInfo({ graph: statePosition < 6 || (statePosition > 6 && isPrevPhaseResponses) ? 'realtimephase1' : 'realtimephase2', selectedIndex: index })
          }
        />
      )}
    </g>
  );
}