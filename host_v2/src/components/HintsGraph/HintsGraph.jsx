import React, { useState, useRef, useEffect } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryContainer,
} from 'victory';
import CustomLabel from './CustomLabel';
import CustomBar from './CustomBar';

export default function HintsGraph({
  data,
  questionChoices,
  graphClickInfo,
  handleGraphClick,
}) {
  const classes = useStyles();
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  const barThickness = 18;
  const barThicknessZero = 26;
  const xSmallPadding = 4;
  const smallPadding = 8;
  const mediumPadding = 16;
  const mediumLargePadding = 20;
  const largePadding = 24;
  const xLargePadding = 32;
  const xxLargePadding = 40;
  const labelOffset = 3;
  const noResponseLabel = 'No Response';
  // victory applies a default of 50px to the VictoryChart component
  // we intentionally set this so that we can reference it programmatically throughout the chart
  
  const defaultVictoryPadding = 50;
  const customBarSelectedWidth = boundingRect.width - defaultVictoryPadding;
  const largestHintCount = Math.max(
    ...data.map((response) => response.teams.length),
  );
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
      const node = graphRef.current;
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
  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: mediumLargePadding,
        },
      },
    },
    dependentAxis: {
      style: {
        axis: { stroke: 'transparent' },
        grid: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
        tickLabels: {
          fill: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Rubik',
          fontWeight: '400',
          fontSize: '12px',
        },
      },
    },
    bar: {
      style: {
        data: {
          fill: '#FFF',
          stroke: '#FFF',
          strokeWidth: 1,
        },
        labels: {
          fill: ({ datum, index }) => datum.team.length === 0
              ? '#FFF'
              : '#384466',
          fontFamily: 'Rubik',
          fontWeight: '400',
          textAnchor: 'end',
          fontSize: '12px',
        },
      },
    },
  };
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>Responses aggregated by common phrases</Typography>
      </div>
      <div ref={graphRef}>
        {data.length >= 1  && (
        <VictoryChart
          domainPadding={{ x: 36, y: 0 }}
          padding={{
            top: mediumPadding,
            bottom: smallPadding,
            left:  smallPadding,
            right: smallPadding,
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
          height={data.length * 65}
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
                xSmallPadding={xSmallPadding}
                mediumPadding={mediumPadding}
                defaultVictoryPadding={defaultVictoryPadding}
                selectedWidth={customBarSelectedWidth}
                selectedHeight={18}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
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
              />
            }
          />
        </VictoryChart>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Rubik',
    fontSize: '12px',
    paddingBottom: '12px',
  },
  titleContainer: {
    marginTop: '3%',
  },
});
