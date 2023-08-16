import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box } from '@material-ui/core';
import { VictoryChart, VictoryStack, VictoryBar, VictoryLabel, VictoryAxis, VictoryLegend, Rect } from 'victory';
import { makeStyles } from '@material-ui/core';
import { debounce } from 'lodash';
import Legend from "../components/ConfidenceResponseLegend";
import CustomBar from "../components/CustomBar";
import { ConfidenceLevel } from '@righton/networking';

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
const classes = useStyles;


const ResponsesGraph = ({ responses, selectedBarValue, setSelectedBarValue }) => {
  const correctColor = "#FFF";
  const incorrectColor = "transparent";
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

  const SelectedBar = ({ x, y, width, height }) => {
    const padding = 5;
    const selectedWidth = width + padding * 2;
    const selectedHeight = height + padding * 2;
    console.log('sup');
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

  const barThickness = 55;
  const barThicknessZero = 30;
  const smallPadding = 12;
  const defaultVictoryPadding = 24;
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
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

  const getNumRespondants = (confidence, correct) => {
    return responses[confidence].filter(response => response.correct === correct).length;
  }

  const correctResponders = [
    { x: "Not\nrated", y: getNumRespondants(ConfidenceLevel.NOT_RATED, true), value: ConfidenceLevel.NOT_RATED },
    { x: "Not at\nall", y: getNumRespondants(ConfidenceLevel.NOT_AT_ALL, true), value: ConfidenceLevel.NOT_AT_ALL },
    { x: "Kinda", y: getNumRespondants(ConfidenceLevel.KINDA, true), value: ConfidenceLevel.KINDA },
    { x: "Quite", y: getNumRespondants(ConfidenceLevel.QUITE, true), value: ConfidenceLevel.QUITE },
    { x: "Very", y: getNumRespondants(ConfidenceLevel.VERY, true), value: ConfidenceLevel.VERY },
    { x: "Totally", y: getNumRespondants(ConfidenceLevel.TOTALLY, true), value: ConfidenceLevel.TOTALLY }
  ];
  const incorrectResponders = [
    { x: "Not\nrated", y: getNumRespondants(ConfidenceLevel.NOT_RATED, false), value: ConfidenceLevel.NOT_RATED },
    { x: "Not at\nall", y: getNumRespondants(ConfidenceLevel.NOT_AT_ALL, false), value: ConfidenceLevel.NOT_AT_ALL },
    { x: "Kinda", y: getNumRespondants(ConfidenceLevel.KINDA, false), value: ConfidenceLevel.KINDA },
    { x: "Quite", y: getNumRespondants(ConfidenceLevel.QUITE, false), value: ConfidenceLevel.QUITE },
    { x: "Very", y: getNumRespondants(ConfidenceLevel.VERY, false), value: ConfidenceLevel.VERY },
    { x: "Totally", y: getNumRespondants(ConfidenceLevel.TOTALLY, false), value: ConfidenceLevel.TOTALLY }
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
      <div ref={graphRef} >
        <VictoryChart theme={customThemeGraph} height={200} style={{ overflow: 'visible' }}>
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
            />
            <VictoryBar
              name="correct"
              data={correctResponders}
              cornerRadius={5}
              labels={({ index }) => correctResponders[index].y + incorrectResponders[index].y}
              dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={barThickness + smallPadding} selectedHeight={boundingRect.height} selectedBarValue={selectedBarValue} setSelectedBarValue={setSelectedBarValue} />}
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
      <Legend></Legend>
    </div>
  );
};

export default ResponsesGraph;