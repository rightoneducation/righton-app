import React from 'react';
import { Bar } from 'victory';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { ITeam } from '@righton/networking';

const HighlightRectangle = styled(Box)({
  '&:hover': {
    fill: 'rgba(255, 255, 255, 0.2)',
  },
});

interface CustomBarProps {
  props: {
    x: number;
    y: number;
    defaultVictoryPadding: number;
    selectedWidth: number;
    selectedHeight: number;
    datum: {answerCount: number, answerCorrect: boolean, answerChoice: string, answerText: string, answerTeams: ITeam[]};
    index: number;
    graphClickInfo: any;
    handleGraphClick: (value: any) => void;
    isShortAnswerEnabled: boolean;
  };
}

export default function CustomBar({
  props
}: CustomBarProps) {
  const theme = useTheme();
  const {
    x,
    y,
    selectedWidth,
    selectedHeight,
    datum,
    index,
    graphClickInfo,
    handleGraphClick,
    isShortAnswerEnabled
  } = props;
  return (
    <g>
      <Bar {...props} />
      {datum.answerCount > 0 && (
        <HighlightRectangle
          x={isShortAnswerEnabled ? 0 : theme.sizing.defaultVictoryPadding - theme.sizing.xxSmPadding}
          y={y - theme.sizing.smPadding}
          width={selectedWidth + theme.sizing.defaultVictoryPadding}
          height={selectedHeight + theme.sizing.smPadding - theme.sizing.xxSmPadding / 2}
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
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}
