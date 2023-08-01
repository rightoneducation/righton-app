import React, { useState, useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryContainer, VictoryPortal } from 'victory';
import { makeStyles } from '@material-ui/core';
import CustomTick from './CustomTick';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    width: '100%',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Rubik',
    fontSize: '17px',
  },
  titleContainer: {
    marginBottom: '-5%',
    marginTop: '5%',
  },
});


const SelectedBar = ({ x, y, width, height }) => {
  const padding = 5;
  const selectedWidth = width + padding * 2;
  const selectedHeight = height + padding * 2;

  return (
    <rect
      x={x - padding}
      y={y - padding}
      width={selectedWidth}
      height={selectedHeight}
      fill="rgba(255, 255, 255, 0.25)"
      stroke="transparent"
      strokeWidth={3}
      rx={8}
      ry={8}
    />
  );
};
const ResponsesGraph = ({ studentResponses, numPlayers, totalAnswers, questionChoices, statePosition }) => {
  const classes = useStyles();
  const [selectedBarInfo, setSelectedBarInfo] = useState(null);

  const reversedResponses = [
    { label: "–", count: numPlayers - totalAnswers },
    ...studentResponses,
  ].reverse();

  const data = reversedResponses.map(({ label, count }) => ({
    answerChoice: label,
    answerCount: count,
  }));

  const correctChoiceIndex = questionChoices.findIndex(({ isAnswer }) => isAnswer) + 1;

  const handleSelectBar = (event) => {
    const barElement = event.target;
    const { x, y, width, height } = barElement.getBBox();
    if (selectedBarInfo && selectedBarInfo.x === x && selectedBarInfo.y === y && selectedBarInfo.width === width && selectedBarInfo.height === height) {
      setSelectedBarInfo(null);
    } else {
      setSelectedBarInfo({ x, y, width, height });
    }
  };

  const calculateRoundedTicks = () => {
    const maxAnswerCount = Math.max(...data.map(({ answerCount }) => answerCount));
    const tickCount = Math.min(maxAnswerCount, 4);
    const tickInterval = Math.ceil(maxAnswerCount / tickCount);
    return Array.from({ length: tickCount + 1 }, (_, index) => index * tickInterval);
  };

  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useCallback((node) => {
    if (node !== null) {
      setBoundingRect(node.getBoundingClientRect());
    }
  }, []);

  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.5)' },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: 20
        },
      },
    },
    dependentAxis: {
      style: {
        axis: { stroke: 'transparent' },
        grid: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1 },
        tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400', fontSize: '12px' },
      },
    },
    bar: {
      style: {
        data: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? 'transparent' : '#FFF'),
          stroke: '#FFF',
          strokeWidth: 1,
        },
        labels: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 || datum.answerCount === 0 ? '#FFF' : '#384466'),
          fontFamily: 'Rubik',
          fontWeight: '400',
          textAnchor: 'end',
          fontSize: '12px'
        },
      },
    },
  };

  return (
    <div className={classes.container} ref={graphRef}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Number of players
        </Typography>
      </div>
      <VictoryChart
        domainPadding={17}
        //containerComponent={<VictoryContainer />}
        theme={customTheme}
        width={boundingRect.width}
      >
        <VictoryAxis
          standalone={false}
          tickLabelComponent={<CustomTick reversedResponses={reversedResponses} correctChoiceIndex={correctChoiceIndex} statePosition={statePosition} />}
        />
        {numPlayers < 5 && (
          <VictoryAxis
            dependentAxis
            crossAxis={false}
            standalone={false}
            orientation="top"
            tickValues={[0]}
          />
        )}
        {numPlayers >= 5 && (
          <VictoryAxis
            dependentAxis
            crossAxis={false}
            standalone={false}
            orientation="top"
            tickValues={calculateRoundedTicks()}
            tickFormat={tick => Math.round(tick)}
          />
        )}
        <VictoryBar
          data={data}
          y="answerCount"
          x="answerChoice"
          horizontal
          cornerRadius={{ topLeft: 4, topRight: 4 }}
          labels={({ datum }) => `${datum.answerCount}`}
          barWidth={({ datum }) =>  datum.answerCount !== 0 ? 18 : 30} 
          labelComponent={
            <VictoryLabel dx={({ datum }) =>  datum.answerCount > 0 ? -2 : 10} />
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: handleSelectBar,
              },
            },
          ]}
        />
        {selectedBarInfo && (
          <VictoryPortal>
            <SelectedBar
              x={selectedBarInfo.x - 50}
              y={selectedBarInfo.y}
              width={selectedBarInfo.width + 50}
              height={selectedBarInfo.height}
            />
          </VictoryPortal>
        )}
      </VictoryChart>
    </div>
  );
};

export default ResponsesGraph;