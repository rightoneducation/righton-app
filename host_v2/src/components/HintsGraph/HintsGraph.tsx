import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryContainer,
} from 'victory';
import { ITeam, IHostTeamAnswersResponse } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import CustomLabel from './CustomLabel';
import CustomBar from './CustomBar';

const ResponseGraphContainer = styled(Box)({
  textAlign: 'center',
  width: '100%',
  maxWidth: '500px',
});

const TitleText = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.5)',
  fontFamily: 'Rubik',
  fontSize: '17px',
  paddingBottom: '16px',
});

const TitleContainer = styled(Box)({
  marginTop: '3%',
});

interface HintsGraphProps {
  data: IHostTeamAnswersResponse[];
  setGraphClickIndex: (index: number | null) => void;
}

export default function HintsGraph({
  data,
  setGraphClickIndex,
}: HintsGraphProps) {
  const theme = useTheme();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const [graphClickInfo, setGraphClickInfo] = React.useState<IGraphClickInfo>({graph: null, selectedIndex: null});
  const graphRef = useRef<HTMLElement | null>(null);
  const noResponseLabel = '–';
  const labelOffset = 3;
  const barThickness = 18;
  const barThicknessZero = 26;
  const customBarSelectedWidth = boundingRect.width - theme.sizing.defaultVictoryPadding;
  const largestHintCount = Math.max(
    ...data.map((response) => response.teams.length),
  );
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
    setGraphClickIndex(selectedIndex);
  }
  const calculateRoundedTicks = () => {
    const maxHintCount = Math.max(
      ...data.map((response) => response.teams.length),
    );
    const tickInterval = 5;
    const tickCount = Math.ceil(maxHintCount / tickInterval);
    return Array.from(
      { length: tickCount + 1 },
      (_, index) => index * tickInterval,
    );
  };
  useEffect(() => {
    const handleResize = () => {
      const node: HTMLElement | null = graphRef.current;
      if (node) {
        const { width } = node.getBoundingClientRect();
        setBoundingRect((prevRect) => ({
          ...prevRect,
          width,
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
     <ResponseGraphContainer>
      <TitleContainer>
        <TitleText>Responses aggregated by common phrases</TitleText>
      </TitleContainer>
      <Box ref={graphRef}>
        {data.length >= 1 && (
        <VictoryChart
          domainPadding={{ x: 36, y: 0 }} // domainPadding is offsetting all data away from the origin. used in conjunction with height
          padding={{
            top: theme.sizing.smPadding,
            bottom: theme.sizing.xSmPadding,
            left:  theme.sizing.xSmPadding,
            right: theme.sizing.xSmPadding,
          }}
          containerComponent={
            <VictoryContainer 
              style={{
                touchAction: "auto"
              }}
            />
          }
          theme={theme.victoryResponsesTheme}
          width={boundingRect.width}
          height={data.length * 68} // height is a calc of the width of the bars + the space between them + the offset
        >
          <VictoryAxis
            standalone={false}
          />
          {largestHintCount < 5 && (
            <VictoryAxis
              dependentAxis
              crossAxis={false}
              standalone={false}
              orientation="top"
              tickValues={[0]}
            />
          )}
          {largestHintCount >= 5 && (
            <VictoryAxis
              dependentAxis
              crossAxis={false}
              standalone={false}
              orientation="top"
              tickValues={calculateRoundedTicks()}
              tickFormat={(tick) => Math.round(tick)}
            />
          )}
          <VictoryBar
            data={data}
            y="teams.length"
            x="themeText"
            horizontal
            standalone={false}
            cornerRadius={{ topLeft: 4, topRight: 4 }}
            labels={({ datum }) => `${datum.teams.length}`}
            barWidth={({ datum }) =>
              datum.teams.length !== 0 ? barThickness : barThicknessZero
            }
            animate={{
              onLoad: { duration: 200 },
              duration: 200,
            }}
            dataComponent={
              <CustomBar
                xSmallPadding={theme.sizing.xxSmPadding}
                mediumPadding={theme.sizing.smPadding}
                defaultVictoryPadding={theme.sizing.defaultVictoryPadding}
                selectedWidth={customBarSelectedWidth}
                selectedHeight={barThickness}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
            }
            labelComponent={
              <CustomLabel
                labelOffset={labelOffset}
                barThickness={barThickness}
                xSmallPadding={theme.sizing.xxSmPadding}
                xLargePadding={theme.sizing.lgPadding}
                mediumLargePadding={theme.sizing.mdPadding - theme.sizing.xxSmPadding}
                defaultVictoryPadding={theme.sizing.defaultVictoryPadding}
                // questionChoices={questionChoices}
                noResponseLabel={noResponseLabel}
              />
            }
          />
        </VictoryChart>
        )}
      </Box>
    </ResponseGraphContainer>
  );
}
