import React from 'react';
import { Grid } from '@mui/material';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryContainer } from 'victory';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '40vh',
    width: '100%'
  },
});

const ResponsesGraph = ({ responses }) => {
  const classes = useStyles();

  const reversedResponses = [...responses].reverse();
  const data = reversedResponses.map(response => ({
    quarter: response.label,
    earnings: response.count,
  }));

  return (
    <Grid className={classes.container}>
      
      <VictoryChart
        domainPadding={20}
        containerComponent={<VictoryContainer />}
      >
        
        <VictoryAxis standalone={false} style={{ axis: { stroke: 'rgba(255, 255, 255, 0.5)' }, tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins', fontWeight: '800' } }} />
        <VictoryAxis
          dependentAxis
          standalone={false}
          label={"Number of Players"} 
          orientation="top"
          style={{
            axis: { stroke: 'transparent' },
            axisLabel: {fill:'rgba(255, 255, 255, 0.5)'},
            grid: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 0.5 },
            tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400'},

          }}
        />
        <VictoryBar
          data={data}
          y="earnings"
          x="quarter"
          horizontal
          cornerRadius={{ topLeft: 4, topRight: 4 }}
          labels={({ datum }) => `${datum.earnings}`}
          style={{
            data: {
              fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? 'transparent' : '#FFF'),
              stroke: ({ datum, index }) => (index === reversedResponses.length - 1 ? '#FFF' : 'transparent'), // Set borderColor conditionally
              strokeWidth: 1, // Set the borderWidth
            },
            labels: {
              fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? '#FFF' : '#384466'),
              fontFamily: 'Rubik',
              fontWeight: '400',
            },
          }}
          labelComponent={<VictoryLabel dx={-20} />}
        />
      </VictoryChart>
      </Grid>
  );
};

export default ResponsesGraph;











