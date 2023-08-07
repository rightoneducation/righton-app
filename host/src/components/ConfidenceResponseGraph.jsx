import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { VictoryChart, VictoryStack, VictoryBar, VictoryLabel, VictoryAxis, VictoryPortal } from 'victory';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: "flex",
    padding: "5px 4px",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    height: 400
  },
  labels: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Rubik',
    fontSize: 12,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch"
  },
  legendContainer: {
    display: "flex",
    padding: "5px 4px",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    height: 100
  }
});
const classes = useStyles;


const ResponsesGraph = () => {
  const correctColor = "#FFF";
  const incorrectColor = "transparent";
  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: 10,
          fill: 'rgba(255, 255, 255, 0.5)',
          fontSize: 18
        },
      },
    },
    stack: {
      colorScale: [incorrectColor, correctColor],
      style: {
        data: {
          stroke: '#FFF',
          strokeWidth: 2
        }
      }
    },
    bar: {
      barWidth: 55
    }
  }

  const correctResponders = [
    { x: "Not\nrated", y: 2 },
    { x: "Not at\nall", y: 0 },
    { x: "Kinda", y: 0 },
    { x: "Quite", y: 2 },
    { x: "Very", y: 6 },
    { x: "Totally", y: 0 }
  ];
  const incorrectResponders = [
    { x: "Not\nrated", y: 2 },
    { x: "Not at\nall", y: 0 },
    { x: "Kinda", y: 2 },
    { x: "Quite", y: 4 },
    { x: "Very", y: 4 },
    { x: "Totally", y: 2 }
  ];
  return (
    <div className={classes.container}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '-5%',
        marginTop: '5%'
      }}>
        <Typography
          className={classes.labels}
          style={{
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            opacity: 0.4
          }}>
          Number of players
        </Typography>
      </div>
      <VictoryChart theme={customTheme} height={200}>
        <VictoryStack
          labelComponent={
            <VictoryLabel
              className={classes.labels}
              style={{
                fill: '#FFF',
                fontSize: 18,

              }}
            />
          }
        >
          <VictoryBar
            data={incorrectResponders}
            cornerRadius={({ index }) => correctResponders[index].y === 0 ? 5 : 0}
          />
          <VictoryBar
            data={correctResponders}
            cornerRadius={5}
            labels={({ datum, index }) => datum.y + incorrectResponders[index].y}
          />
          <VictoryAxis
            tickValues={correctResponders.map(datum => datum.x)}
          />
        </VictoryStack>
      </VictoryChart>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Typography
          className={classes.labels}
          style={{
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            opacity: 0.4
          }}>
          Confidence
        </Typography>
      </div>
    </div>
  );
};

export default ResponsesGraph;