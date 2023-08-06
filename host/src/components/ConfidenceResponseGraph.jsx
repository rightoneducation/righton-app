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
    alignSelf: "stretch"
  },
  title: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Rubik',
    fontSize: 12,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch"
  }
});
const classes = useStyles;


const ResponsesGraph = () => {
  const correctColor = "#FFF";
  const incorrectColor = "transparent";

  const correctResponders = [
    { x: "Not rated", y: 2 },
    { x: "Not at all", y: 0 },
    { x: "Kinda", y: 0 },
    { x: "Quite", y: 2 },
    { x: "Very", y: 6 },
    { x: "Totally", y: 0 }
  ];
  const incorrectResponders = [
    { x: "Not rated", y: 2 },
    { x: "Not at all", y: 0 },
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
        marginBottom: '-3%',
        marginTop: '5%'
      }}>
        <Typography
          className={classes.title}
          style={{
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            opacity: 0.4
          }}>
          Number of players
        </Typography>
      </div>
      <VictoryStack
        colorScale={[incorrectColor, correctColor]}
        domainPadding={0}
        style={{
          data: {
            strokeWidth: 2,
            stroke: "#FFF"
          }
        }}
        height={190}
        labelComponent={
          <VictoryLabel
            className={classes.title}
            style={{
              fill: '#FFF',
              fontSize: 16
            }}
          />
        }
      >
        <VictoryBar
          data={incorrectResponders}
          barWidth={55}
          cornerRadius={({ index }) => correctResponders[index].y === 0 ? 5 : 0}
        />
        <VictoryBar
          data={correctResponders}
          barWidth={55}
          cornerRadius={5}
          labels={({ datum, index }) => datum.y + incorrectResponders[index].y}
        />
        <VictoryAxis
          tickValues={correctResponders.map(el => el.x)}
        />

      </VictoryStack>
    </div>
  );
};

export default ResponsesGraph;