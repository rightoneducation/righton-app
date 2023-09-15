import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { VictoryChart, VictoryStack, VictoryBar, VictoryLabel, VictoryAxis } from 'victory';
import { makeStyles } from '@material-ui/core';
import { debounce } from 'lodash';
import Legend from "./ConfidenceResponseLegend";
import CustomBar from "./CustomBar";
import { ConfidenceLevel } from '@righton/networking';

export default function ConfidenceResponsesGraph ({  
  confidenceData,
  graphClickInfo, 
  handleGraphClick,
}) {
  const classes = useStyles();
  const correctColor = "#FFF";
  const incorrectColor = "transparent";
  const barThickness = 55;
  const smallPadding = 12;
  const customThemeGraph = {
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
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  // this is req'd to handle the resizing of the graph container so that Victory can render the svgs 
  useEffect(() => {
    const node = graphRef.current;
    if (node) {
      const updateRect = debounce(() => {
        setBoundingRect(node.getBoundingClientRect());
      });
      updateRect();
      window.addEventListener('resize', updateRect);

      return () => {
        updateRect.cancel();
        window.removeEventListener('resize', updateRect);
      };
    }
  }, []);
  // parse the confidenceData to be used by Victory
  const correctResponders = [];
  const incorrectResponders = [];
  // TODO: integrate this into ConfidenceLevel enum to prevent use of dictionaries here and in confidenceresponsedropdown
  const ConfidenceLevelDictionary = {
    0: "Not\nRated",
    1: "Not At\nAll",
    2: "Kinda",
    3: "Quite",
    4: "Very",
    5: "Totally"
  };
  Object.keys(ConfidenceLevel).map((key, index) => {
    correctResponders.push({x: ConfidenceLevelDictionary[index], y: confidenceData[index].correct});
    incorrectResponders.push({x: ConfidenceLevelDictionary[index], y: confidenceData[index].incorrect});
  });

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
      <div ref={graphRef} >
        <VictoryChart theme={customThemeGraph} height={200}>
          <VictoryStack
            standalone={false}
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
              name="incorrect"
              data={incorrectResponders}
              cornerRadius={({ index }) => correctResponders[index].y === 0 ? 5 : 0}
              labels={({ index }) => correctResponders[index].y + incorrectResponders[index].y}
              dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={barThickness + smallPadding} selectedHeight={200} graphClickInfo={graphClickInfo} handleGraphClick={handleGraphClick} />}
            />
            <VictoryBar
              name="correct"
              data={correctResponders}
              cornerRadius={5}
              labels={({ index }) => correctResponders[index].y + incorrectResponders[index].y}
              dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={barThickness + smallPadding} selectedHeight={200} graphClickInfo={graphClickInfo} handleGraphClick={handleGraphClick} />}
            />
            <VictoryAxis
              tickValues={correctResponders.map(datum => datum.x)}
            />
          </VictoryStack>
        </VictoryChart>
      </div>
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
      <Legend/>
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    padding: "5px 4px",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
  },
  labels: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Rubik',
    fontSize: 12,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch"
  }
});