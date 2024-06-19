import React from 'react';
import { Bar } from 'victory';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswersResponse, ITeam } from '@righton/networking';

const HighlightRectangle = styled(Box)({
  '&:hover': {
    fill: 'rgba(255, 255, 255, 0.2)',
  },
});

export function CustomBar(props: any) {
  const theme = useTheme();
  const { datum } = props;
  // console.log(props.barWidth); // eslint-disable-line
  // console.log(props.height); // eslint-disable-line
  // let highlightFill;
  // if (graphClickInfo.selectedIndex != null || graphClickInfo.selectedIndex === index && graphClickInfo.graph === 'realtime')
  //   highlightFill = graphClickInfo.selectedIndex && graphClickInfo.selectedIndex === index && graphClickInfo.graph === 'realtime' ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
  return (
       <Bar {...props} />
  );
}