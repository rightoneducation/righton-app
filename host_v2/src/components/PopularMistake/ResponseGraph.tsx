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

interface Team {
  name: string;
}

interface PopularMistakeOption {
  answerChoice: string;
  answerCorrect: boolean;
  answerCount: number;
  answerTeams: Team[];
  answerText: string;
}

interface QuestionChoice {
  reason: string;
  text: string;
  isAnswer: boolean;
}

interface GraphProps {
  data: PopularMistakeOption[];
  questionChoices: QuestionChoice[];
  statePosition: number;
  graphClickIndex: number | null;
  isShortAnswerEnabled: boolean;
  handleGraphClick: (selectedIndex: number | null) => void;
}

export default function ResponsesGraph({
  data,
  questionChoices,
  statePosition,
  graphClickIndex,
  isShortAnswerEnabled,
  handleGraphClick
}: GraphProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  const noResponseLabel = '–';

  const customBarSelectedWidth = boundingRect.width - theme.sizing.defaultVictoryPadding;
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
          padding: `${theme.sizing.smallPadding}`,
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
          strokeWidth: `${theme.sizing.barStrokeWidthThin}`,
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
  console.log(data.length);
  return (
    <Container>
      <TitleText>
        {t('gamesession.popularMistakeCard.graph.title')}
      </TitleText>
      <div ref={graphRef}>
        {(isShortAnswerEnabled ? data.length >= 1 : data.length > 1) && (
          <VictoryChart
            domainPadding={{ x: theme.sizing.smallPadding, y: 0 }}
            padding={{
              top: theme.sizing.smallPadding,
              bottom: theme.sizing.extraSmallPadding,
              left: theme.sizing.responseAxisPadding,
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
            height={data.length * theme.sizing.responseGraphVerticalScale}
          >
            <VictoryAxis
              standalone={false}
              tickLabelComponent={
                <CustomTick
                  correctChoiceIndex={correctChoiceIndex}
                  statePosition={statePosition}
                />
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
              data={data}
              y="answerCount"
              x="answerChoice"
              horizontal
              standalone={false}
              cornerRadius={{ topLeft: 4, topRight: 4 }}
              labels={({ datum }) => `${datum.answerCount}`}
              barWidth={({ datum }) =>
                datum.answerCount !== 0 ? theme.sizing.responseBarThickness :
                  theme.sizing.responseBarThickness + theme.sizing.extraSmallPadding
              }
              animate={{
                onLoad: { duration: 200 },
                duration: 200,
              }}
              dataComponent={
                <CustomBar
                  dynamicWidth={customBarSelectedWidth}
                  graphClickIndex={graphClickIndex}
                  handleGraphClick={handleGraphClick}
                />
              }
              labelComponent={
                <CustomLabel />
              }
            />
          </VictoryChart>
        )}
      </div>
    </Container>
  );
}
