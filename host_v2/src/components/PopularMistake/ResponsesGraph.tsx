import React, { useState, useRef, useEffect } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryContainer,
} from 'victory';
import CustomTick from './CustomTick';
import CustomLabel from './CustomLabel';
import CustomBar from './CustomBar';

const Container = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  width: '100%',
  maxWidth: `${theme.breakpoints.values.sm}px`,
  marginTop: `${theme.sizing.smallPadding}px`,
  marginBottom: `${theme.sizing.smallPadding}px`,
}));

const TitleText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.graphTickLabelColorDark}`,
  fontSize: `${theme.typography.h4.fontSize}`,
  paddingBottom: `${theme.sizing.smallPadding}px`,
}))

interface GraphProps {
  data?: any;
  questionChoices?: any;
  statePosition?: any;
  graphClickInfo?: any;
  isShortAnswerEnabled?: any;
  handleGraphClick?: any;
  numPlayers?: any;
  totalAnswers?: any;
}

export default function ResponsesGraph({
  data,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
  totalAnswers,
  numPlayers
}: GraphProps) {
  // TODO: maybe add these to theme since there are multiple victory graphs with the same format
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  const barThickness = 18;
  const barThicknessZero = 26;
  const xSmallPadding = 4;
  const mediumLargePadding = 20;
  const xLargePadding = 32;
  const labelOffset = 3;
  const noResponseLabel = '–';
  // victory applies a default of 50px to the VictoryChart component
  // we intentionally set this so that we can reference it programmatically throughout the chart
  const defaultVictoryPadding = 50;

  // TODO: clean this up
  const customBarSelectedWidth = isShortAnswerEnabled ? boundingRect.width - defaultVictoryPadding : boundingRect.width - (defaultVictoryPadding + theme.sizing.mediumPadding * 2);
  const correctChoiceIndex = data.findIndex((element: any) => element.answerCorrect);
  const largestAnswerCount = Math.max(
    ...data.map((response: any) => response.answerCount),
  );

  const calculateRoundedTicks = () => {
    const maxAnswerCount = Math.max(
      ...data.map(({ answerCount }: any) => answerCount),
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
      const node: any = graphRef.current;
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
  const customTheme: any = {
    axis: {
      style: {
        axis: { stroke: `${theme.palette.primary.graphAccentColor}`, strokeWidth: `${theme.sizing.barStrokeWidth}` },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: mediumLargePadding,
        },
      },
    },
    dependentAxis: {
      style: {
        axis: { stroke: 'transparent' },
        grid: { stroke: `${theme.palette.primary.graphAccentColor}`, strokeWidth: `${theme.sizing.barStrokeWidth}` },
        tickLabels: {
          fill: `${theme.palette.primary.graphTickLabelColorDark}`,
          fontWeight: `${theme.typography.body1.fontWeight}`,
          fontSize: `${theme.typography.caption.fontSize}`,
        },
      },
    },
    bar: {
      style: {
        data: {
          // TODO: find better way of determining if this is 'no response' option
          fill: ({ datum, index }: { datum: any, index: any }) =>
            datum.answerChoice === '-' ? 'transparent' : `${theme.palette.primary.main}`,
          stroke: `${theme.palette.primary.main}`,
          // TODO: add this to theme
          strokeWidth: 1,
        },
        labels: {
          fill: ({ datum, index }: { datum: any, index: any }) =>
            datum.answerCount === 0
              ? `${theme.palette.primary.main}`
              : `${theme.palette.primary.darkBlue}`,
          fontWeight: `${theme.typography.body1.fontWeight}`,
          textAnchor: 'end',
          fontSize: `${theme.typography.caption.fontSize}`,
        },
      },
    },
  };
  return (
    <Container>
      <TitleText>
        {t('gamesession.popularMistakeCard.graph.title')}
      </TitleText>
      <div ref={graphRef}>
        {(isShortAnswerEnabled ? data.length >= 1 : data.length > 1) && (
          <VictoryChart
            domainPadding={{ x: 16, y: 0 }}
            padding={{
              top: theme.sizing.smallPadding,
              bottom: theme.sizing.extraSmallPadding,
              // TODO: fix this
              left: theme.sizing.smallPadding + 25,
              // TODO: figure out what this is for
              // (isShortAnswerEnabled && statePosition < 6) ? smallPadding : defaultVictoryPadding,
              right: theme.sizing.extraSmallPadding,
            }}
            containerComponent={
              <VictoryContainer
                style={{
                  touchAction: "auto"
                }}
              />
            }
            theme={customTheme}
            width={boundingRect.width}
            // TODO: clean this up
            height={data.length * 45}
          >
            <VictoryAxis
              standalone={false}
              tickLabelComponent={
                <CustomTick
                  data={data}
                  correctChoiceIndex={correctChoiceIndex}
                  statePosition={statePosition}
                  isShortAnswerEnabled={isShortAnswerEnabled}
                />
              }
            />
            {/* TODO: maybe abstract the below two into a function to avoid repeating code */}
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
              data={data}
              y="answerCount"
              x="answerChoice"
              horizontal
              standalone={false}
              cornerRadius={{ topLeft: 4, topRight: 4 }}
              labels={({ datum }) => `${datum.answerCount}`}
              barWidth={({ datum }) =>
                datum.answerCount !== 0 ? barThickness : barThicknessZero
              }
              animate={{
                onLoad: { duration: 200 },
                duration: 200,
              }}
              dataComponent={
                <CustomBar
                  xSmallPadding={xSmallPadding}
                  defaultVictoryPadding={defaultVictoryPadding}
                  selectedWidth={customBarSelectedWidth}
                  selectedHeight={18}
                  graphClickInfo={graphClickInfo}
                  handleGraphClick={handleGraphClick}
                  isShortAnswerEnabled={isShortAnswerEnabled}
                />
              }
              labelComponent={
                <CustomLabel
                  labelOffset={labelOffset}
                  barThickness={barThickness}
                  xSmallPadding={xSmallPadding}
                  xLargePadding={xLargePadding}
                  mediumLargePadding={mediumLargePadding}
                  defaultVictoryPadding={defaultVictoryPadding}
                  questionChoices={questionChoices}
                  noResponseLabel={noResponseLabel}
                  isShortAnswerEnabled={isShortAnswerEnabled}
                />
              }
            />
          </VictoryChart>
        )}
      </div>
    </Container>
  );
}
