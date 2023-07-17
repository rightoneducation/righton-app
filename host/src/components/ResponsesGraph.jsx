import React from 'react';
import { Grid, Typography } from '@mui/material';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryContainer } from 'victory';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
  title:{
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '10px',
    marginBottom: '-15px' 
  },
});

const ResponsesGraph = ({ responses }) => {
  const classes = useStyles();

  const reversedResponses = [...responses].reverse();
  const data = reversedResponses.map(response => ({
    answerChoice: response.label,
    answerCount: response.count,
  }));

  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.5)'},
        grid: { stroke: 'transparent' },
        tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins', fontWeight: '800', padding: 10},
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
          stroke: ({ datum, index }) => (index === reversedResponses.length - 1 ? '#FFF' : 'transparent'),
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

  const tickValues = reversedResponses.map(response => response.label);

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
          tickValues={tickValues} 
        />
        <VictoryAxis
          dependentAxis
          crossAxis={false}
          standalone={false}
          orientation="top"
        />
        <VictoryBar
          data={data}
          y="answerCount"
          x="answerChoice"
          horizontal
          cornerRadius={{ topLeft: 4, topRight: 4 }}
          labels={({ datum }) => `${datum.answerCount}`}
          labelComponent={<VictoryLabel dx={-20} />}
        />
      </VictoryChart>
    </Grid>
  );
};

export default ResponsesGraph;