import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryContainer,
} from 'victory';
import { ITeam } from '@righton/networking';
import CustomTick from './CustomTick';
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

interface ResponseGraphProps {
  data: {answerCount: number, answerCorrect: boolean, answerChoice: string, answerText: string, answerTeams: ITeam[]}[];
  questionChoices: any,
  statePosition: number,
  graphClickInfo: any,
  isShortAnswerEnabled: boolean,
  handleGraphClick: (value: any) => void,
}

export default function ResponsesGraph({
  data,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}: ResponseGraphProps) {
  const theme = useTheme();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef<HTMLElement | null>(null);
  const noResponseLabel = '–';

  const customBarSelectedWidth = isShortAnswerEnabled ? boundingRect.width - theme.sizing.defaultVictoryPadding : boundingRect.width - (theme.sizing.defaultVictoryPadding + theme.sizing.mdPadding * 2);
  const correctChoiceIndex =
    data.findIndex((element: any) => element.answerCorrect);
  const largestAnswerCount = Math.max(
    ...data.map((response: any) => response.answerCount),
  );

  const calculateRoundedTicks = () => {
    const maxAnswerCount = Math.max(
      ...data.map(({ answerCount }) => answerCount),
    );
    const tickInterval = 5;
    const tickCount = Math.ceil(maxAnswerCount / tickInterval);
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

  // theme to eventually be wrapped into a mui theme when host is upgraded to mui v5
  
  return (
    console.log(data)
    // <ResponseGraphContainer>
    //   <TitleContainer>
    //     <TitleText>Number of players</TitleText>
    //   </TitleContainer>
    //   <Box ref={graphRef}>
    //     {(isShortAnswerEnabled ? data.length >= 1 : data.length > 1) && (
    //     <VictoryChart
    //       domainPadding={{ x: 36, y: 0 }}
    //       padding={{
    //         top: theme.sizing.smPadding,
    //         bottom: theme.sizing.xSmPadding,
    //         left: (isShortAnswerEnabled && statePosition < 6) ? theme.sizing.xSmPadding : theme.sizing.defaultVictoryPadding,
    //         right: theme.sizing.xSmPadding,
    //       }}
    //       containerComponent={
    //         <VictoryContainer 
    //           style={{
    //             touchAction: "auto"
    //           }}
    //         />
    //       }
    //       theme={theme.victoryTheme}
    //       width={boundingRect.width}
    //       height={data.length * 65}
    //     >
    //       <VictoryAxis
    //         standalone={false}
    //         tickLabelComponent={
    //           <CustomTick
    //             x={x}
    //             y={y}
    //             index={index}
    //             text={text}
    //             correctChoiceIndex={correctChoiceIndex}
    //             statePosition={statePosition}
    //           />
    //         }
    //       />
    //       {largestAnswerCount < 5 && (
    //         <VictoryAxis
    //           dependentAxis
    //           crossAxis={false}
    //           standalone={false}
    //           orientation="top"
    //           tickValues={[0]}
    //         />
    //       )}
    //       {largestAnswerCount >= 5 && (
    //         <VictoryAxis
    //           dependentAxis
    //           crossAxis={false}
    //           standalone={false}
    //           orientation="top"
    //           tickValues={calculateRoundedTicks()}
    //           tickFormat={(tick) => Math.round(tick)}
    //         />
    //       )}
    //       <VictoryBar
    //         data={data}
    //         y="answerCount"
    //         x="answerChoice"
    //         horizontal
    //         standalone={false}
    //         cornerRadius={{ topLeft: 4, topRight: 4 }}
    //         labels={({ datum }) => `${datum.answerCount}`}
    //         barWidth={({ datum }) =>
    //           datum.answerCount !== 0 ? theme.sizing.barThicknessResponses : theme.sizing.barThicknessZeroResponses
    //         }
    //         animate={{
    //           onLoad: { duration: 200 },
    //           duration: 200,
    //         }}
    //         dataComponent={
    //           <CustomBar
    //             selectedWidth={customBarSelectedWidth}
    //             selectedHeight={18}
    //             graphClickInfo={graphClickInfo}
    //             handleGraphClick={handleGraphClick}
    //             isShortAnswerEnabled={isShortAnswerEnabled}
    //           />
    //         }
    //         labelComponent={
    //           <CustomLabel
    //             questionChoices={questionChoices}
    //             noResponseLabel={noResponseLabel}
    //             isShortAnswerEnabled={isShortAnswerEnabled}
    //           />
    //         }
    //       />
    //     </VictoryChart>
    //     )}
    //   </Box>
    // </ResponseGraphContainer>
  );
}
