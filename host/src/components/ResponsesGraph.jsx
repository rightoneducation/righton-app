import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryContainer, VictoryPortal } from 'victory';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '10px',
    marginBottom: '-15px',
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
      fill="rgba(255, 255, 255, 0.5)"
      stroke="transparent"
      strokeWidth={3}
      rx={8}
      ry={8}
    />
  );
};

const ResponsesGraph = ({ studentResponses, numPlayers, totalAnswers, currentState, questionChoices, statePosition }) => {
  const classes = useStyles();

  const reversedResponses = [
    { label: "-", count: numPlayers - totalAnswers },
    ...studentResponses,
  ].reverse();


  const data = reversedResponses.map(response => ({
    answerChoice: response.label,
    answerCount: response.count,
  }));

  const correctChoiceIndex = questionChoices.findIndex(choice => choice.isAnswer)+1;
  //dependent on feedback
  //const largestAnswerCount = Math.max(...data.map(response => response.answerCount));

  console.log(statePosition);

  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.5)' },
        grid: { stroke: 'transparent' },
        tickLabels: {
          fill: ( statePosition === 6 ? ({ datum, index }) => (index === reversedResponses.length-1 - correctChoiceIndex ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)') : 'rgba(255, 255, 255, 0.5)'),
          fontFamily: 'Poppins',
          fontWeight: '800',
          padding: 10,
        },
      },
    },
    dependentAxis: {
      style: {
        axis: { stroke: 'transparent' },
        grid: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 0.5 },
        tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400' },
      },
    },
    bar: {
      style: {
        data: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? 'transparent' : '#FFF'),
          stroke: ({ datum, index }) => (index === reversedResponses.length - 1 && datum.answerCount !== 0 ? '#FFF' : 'transparent'),
          strokeWidth: 1,
        },
        labels: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? '#FFF' : '#384466'),
          fontFamily: 'Rubik',
          fontWeight: '400',
        },
      },
    },
  };

  const axisTickValues = reversedResponses.map(response => response.label);

  const [selectedBarInfo, setSelectedBarInfo] = useState(null);

  const handleBarClick = (event) => {
    const barElement = event.target;
    const { x, y, width, height } = barElement.getBBox();
    setSelectedBarInfo({ x, y, width, height });
  };


  return (
    <Grid item xs={12} className={classes.container}>
      <Typography className={classes.title}>
        Number of Players
      </Typography>
      <VictoryChart
        domainPadding={20}
        containerComponent={<VictoryContainer />}
        theme={customTheme}
      >
        <VictoryAxis
          standalone={false}
          tickValues={axisTickValues}
        />
        {numPlayers < 5 && 
        <VictoryAxis
          dependentAxis
          crossAxis={false}
          standalone={false}
          orientation="top"
          tickValues={[0]}
        />}

        {numPlayers >= 5 && 
        <VictoryAxis
          dependentAxis
          crossAxis={false}
          standalone={false}
          orientation="top"
        />}

        <VictoryBar
          data={data}
          y="answerCount"
          x="answerChoice"
          horizontal
          cornerRadius={{ topLeft: 4, topRight: 4 }}
          labels={({ datum }) => datum.answerCount !== 0 ? `${datum.answerCount}` : ""}
          labelComponent={<VictoryLabel dx={-20} />}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: (event) => {
                  handleBarClick(event); 
                  return [];
                },
              },
            },
          ]}
        />
        {selectedBarInfo && ( 
        <VictoryPortal>
          <SelectedBar
            x={selectedBarInfo.x - 20}
            y={selectedBarInfo.y}
            width={selectedBarInfo.width + 20}
            height={selectedBarInfo.height}
          />
          </VictoryPortal>
        )}
      </VictoryChart>
    </Grid>
  );
};

export default ResponsesGraph;
