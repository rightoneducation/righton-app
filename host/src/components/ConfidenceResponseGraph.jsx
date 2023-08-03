import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { VictoryChart, VictoryStack, VictoryBar, VictoryLabel, VictoryContainer, VictoryPortal } from 'victory';
import { makeStyles } from '@material-ui/core';

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


const ResponsesGraph = () => {
  const correctColor = "#FFF";
  const incorrectColor = "transparent";

  const correctResponders = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 6 }
  ];
  const incorrectResponders = [
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 4, y: 5 },
    { x: 5, y: 5 }
  ];
  return (
    <VictoryStack
      colorScale={[correctColor, incorrectColor]}
      domainPadding={0}
      style={{
        data: {
          strokeWidth: 3,
          stroke: "#FFF"
        }
      }}
    >
      <VictoryBar
        cornerRadius={{ topLeft: 4, topRight: 4 }}
        data={correctResponders}

      />
      <VictoryBar
        data={incorrectResponders}

      />
    </VictoryStack>
  );
};

export default ResponsesGraph;