import React from 'react';
import { Bar } from 'victory';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswersResponse, ITeam } from '@righton/networking';

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
    defaultVictoryPadding,
    customBarSelectedWidth,
    selectedHeight,
    index,
    graphClickInfo,
    handleGraphClick,
    isShortAnswerEnabled
   } = props;
  return (
    <g>
    <Bar {...props} />
    {datum.count > 0 && (
      <HighlightRectangle
        x =  {theme.sizing.defaultVictoryPadding - theme.sizing.xSmPadding}
        y =  {y - theme.sizing.smPadding}
        width = {customBarSelectedWidth + theme.sizing.defaultVictoryPadding + theme.sizing.xSmPadding}
        height = {13 + theme.sizing.mdPadding - theme.sizing.xSmPadding / 2}
        // x={isShortAnswerEnabled ? 0 : defaultVictoryPadding - xSmallPadding}
        // y={y - mediumPadding}
        // width={selectedWidth + defaultVictoryPadding}
        // height={selectedHeight + mediumPadding - xSmallPadding / 2}
        fill={
          graphClickInfo.selectedIndex &&
          graphClickInfo.selectedIndex === index &&
          graphClickInfo.graph === 'realtime'
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