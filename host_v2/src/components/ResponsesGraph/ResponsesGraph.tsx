import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryContainer,
  Bar
} from 'victory';
import { ITeam, IHostTeamAnswersResponse } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import CustomTick from './CustomTick';
import CustomLabel from './CustomLabel';
import { CustomBar } from './CustomBar';

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

interface ResponseGraphProps {
  data: IHostTeamAnswersResponse[];
  statePosition: number,
  isShortAnswerEnabled: boolean,
  graphClickInfo: IGraphClickInfo, // eslint-disable-line
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void; // eslint-disable-line
  setGraphClickIndex: (index: number | null) => void;
}

export default function ResponsesGraph({
  data,
  statePosition,
  isShortAnswerEnabled,
  graphClickInfo,
  setGraphClickInfo,
  setGraphClickIndex,
}: ResponseGraphProps) {
  const theme = useTheme();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef<HTMLElement | null>(null);
  const noResponseLabel = '–';
  const customBarSelectedWidth = isShortAnswerEnabled ? boundingRect.width - theme.sizing.defaultVictoryPadding : boundingRect.width - (theme.sizing.defaultVictoryPadding + theme.sizing.mdPadding * 2);
  const correctChoiceIndex =
    data.findIndex((element: any) => element.isCorrect);
  const largestAnswerCount = Math.max(
    ...data.map((response: any) => response.count),
  );
  const numAnswers = data.length;
  const calculateRoundedTicks = () => {
    const maxAnswerCount = Math.max(
      ...data.map(({ count }) => count),
    );
    const tickInterval = 5;
    const tickCount = Math.ceil(maxAnswerCount / tickInterval);
    return Array.from(
      { length: tickCount + 1 },
      (_, index) => index * tickInterval,
    );
  };
  // remove any zero responses when displaying phase 1 data in phase 2
  const filteredData = statePosition > 6 ? data.filter((response) => response.count !== 0) : data;
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
    setGraphClickIndex(selectedIndex);
  }

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

  let tickLabelComponent;

  if (!isShortAnswerEnabled) {
    tickLabelComponent = (
      <CustomTick 
        correctChoiceIndex={correctChoiceIndex}
        statePosition={statePosition}
        isShortAnswerEnabled={isShortAnswerEnabled}
      />
    );
  }
  return (
    <ResponseGraphContainer>
      <TitleContainer>
        <TitleText>Number of players</TitleText>
      </TitleContainer>
      <Box ref={graphRef}>
        {(isShortAnswerEnabled ? filteredData.length >= 1 : filteredData.length >= 1) && (
        <VictoryChart
          domainPadding={{ x: isShortAnswerEnabled ? 32: 16, y: 0 }} // domainPadding is offsetting all data away from the origin. used in conjunction with height
          padding={{
            top: theme.sizing.smPadding,
            bottom: theme.sizing.xSmPadding,
            left: (isShortAnswerEnabled) ? theme.sizing.xSmPadding : theme.sizing.defaultVictoryPadding,
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
          height={isShortAnswerEnabled ? filteredData.length * 68 : filteredData.length * 40} // height is a calc of the width of the bars + the space between them + the offset
        >
          <VictoryAxis
            standalone={false}
            tickLabelComponent={
              tickLabelComponent
            }
          />
          {largestAnswerCount < 5 && (
            <VictoryAxis
              dependentAxis
              crossAxis={false}
              standalone={false}
              orientation="top"
              tickValues={[0]}
            />
          )}
          {largestAnswerCount >= 5 && (
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
            data={filteredData}
            y="count"
            x={isShortAnswerEnabled ? "rawAnswer" : "multiChoiceCharacter"}
            horizontal
            standalone={false}
            animate={{
              onLoad: { duration: 200 },
              duration: 200,
              animationWhitelist: ["data"],
            }}
            cornerRadius={{ topLeft: 4, topRight: 4 }}
            style={{ 
              data: { 
                fill: ({ index, datum }: any) => ((index === numAnswers-1 || statePosition > 6) && datum.multiChoiceCharacter ==='–') ? 'transparent' : '#FFF'
              } 
            }}
            barWidth={({ datum }) =>
              datum.count !== 0 ? theme.sizing.barThicknessResponses : theme.sizing.barThicknessZeroResponses
            }
            labels={({ datum }) => `${datum.count}`}
            dataComponent={
              <CustomBar 
                data={data}
                statePosition={statePosition}
                customBarSelectedWidth={customBarSelectedWidth}
                graphClickInfo={graphClickInfo}
                setGraphClickInfo={setGraphClickInfo}
                isShortAnswerEnabled={isShortAnswerEnabled}
              />
            }
            labelComponent={
              <CustomLabel
                noResponseLabel={noResponseLabel}
                isShortAnswerEnabled={isShortAnswerEnabled}
                customBarSelectedWidth={customBarSelectedWidth}
                statePosition={statePosition}
              />
            }
          
          />
        </VictoryChart>
        )}
      </Box>
    </ResponseGraphContainer>
  );
}
