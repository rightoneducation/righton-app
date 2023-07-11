import React, { PureComponent } from 'react';
import {  Box } from '@mui/material';
import { VictoryBar, VictoryChart, VictoryLabel, VictoryAxis } from 'victory';

const data = [
  {quarter: 1, earnings: 13},
  {quarter: 2, earnings: 25},
  {quarter: 3, earnings: 5},
  {quarter: 4, earnings: 9}
];

export default function BarChartComponent() {
  // TODO: see if we can integrate the victory theme within our existing mui theme
  return (
    <Box>
      <VictoryChart
        domainPadding={20}
      >
      <VictoryAxis 
        standalone={false}
      />
      <VictoryAxis dependentAxis 
        standalone={false}
        orientation="top"
        style={{
          axis: { stroke: 'transparent' },
          grid: { stroke: '#000000', strokeWidth: 0.5 },
        }}
      />
       <VictoryBar
        data={data}
        y="earnings"
        x="quarter"
        horizontal
        cornerRadius={{topLeft:(4), topRight:(4)}}
        labels={({ datum }) => `${datum.earnings}`}
        style={{data: { fill: "#000000" }, labels: { fill: "white" } }}
        labelComponent={<VictoryLabel dx={-20} />}
       />
      </VictoryChart>
    </Box>
  );
}
