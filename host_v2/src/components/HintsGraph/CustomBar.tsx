import React, { useMemo } from 'react';
import { Bar } from 'victory';
import { styled, useTheme } from '@mui/material/styles';

const HighlightRectangle = styled('rect')({
  cursor: 'pointer', 
  '&:hover': {
    fill: 'rgba(255, 255, 255, 0.2)',
  },
});

export default function CustomBar( props: any ) {
  const { 
    datum,
    y,
    customBarSelectedWidth,
    index,
    graphClickIndex,
    setGraphClickInfo
   } = props;
   const theme = useTheme();
   const height =  36 + theme.sizing.mdPadding - theme.sizing.xSmPadding / 2;
    // wrapping this in a useMemo in an effort to avoid any additional renders
    const isSelected = useMemo(() =>{
      // ensure that 0 isn't treated as falsy
      return graphClickIndex !== null &&
      graphClickIndex !== undefined &&
      graphClickIndex === index 
     }, [graphClickIndex, index]);
  return (
    <g>
      <Bar {...props} />
      {datum.teams.length > 0 && (
        <HighlightRectangle
          x={0}
          y={y - theme.sizing.xLgPadding + theme.sizing.xSmPadding }
          width={customBarSelectedWidth + theme.sizing.defaultVictoryPadding}
          height={height}
          fill={
            isSelected
            ? 'rgba(255, 255, 255, 0.2)'
            : 'transparent'
          }
          stroke="transparent"
          rx={8}
          ry={8}
          onClick={() =>
            setGraphClickInfo(index)
          }
          style={{ 
            cursor: 'pointer',
            '&:hover': {
              fill: 'rgba(255, 255, 255, 0.2)',
            }, 
          }}
        />
      )}
    </g>
  );
}
