import React, { useMemo } from 'react';
import { Bar } from 'victory';
import { styled, useTheme } from '@mui/material/styles';

const HighlightRectangle = styled('rect')({
  cursor: 'pointer', 
  '&:hover': {
    fill: 'rgba(255, 255, 255, 0.2)',
  },
});

export function CustomBar(props: any) {
  const theme = useTheme();
  const { 
    datum,
    y,
    customBarSelectedWidth,
    index,
    graphClickInfo,
    handleGraphClick,
    isShortAnswerEnabled
   } = props;
   const height = (isShortAnswerEnabled ? 18 : 13) + theme.sizing.mdPadding - theme.sizing.xSmPadding / 2;
   // wrapping this in a useMemo in an effort to avoid any additional renders
   const isSelected = useMemo(() =>{
    // ensure that 0 isn't treated as falsy
    return graphClickInfo.selectedIndex !== null &&
    graphClickInfo.selectedIndex !== undefined &&
    graphClickInfo.selectedIndex === index &&
    graphClickInfo.graph === 'realtime';
   }, [graphClickInfo.selectedIndex, index, graphClickInfo.graph]);
  return (
    <g>
    <Bar {...props} />
    {datum.count > 0 && (
      <HighlightRectangle
        x =  {theme.sizing.defaultVictoryPadding - theme.sizing.xSmPadding}
        y =  {y - theme.sizing.smPadding}
        width = {customBarSelectedWidth + theme.sizing.defaultVictoryPadding + theme.sizing.xSmPadding}
        height = {height}
        fill={
          isSelected
            ? 'rgba(255, 255, 255, 0.2)'
            : 'transparent'
        }
        stroke="transparent"
        rx={8}
        ry={8}
        onClick={() =>
          handleGraphClick({ graph: 'realtime', selectedIndex: index })
        }
      />
    )}
  </g>
  );
}