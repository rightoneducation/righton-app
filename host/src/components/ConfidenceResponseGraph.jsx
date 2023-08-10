import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box } from '@material-ui/core';
import { VictoryChart, VictoryStack, VictoryBar, VictoryLabel, VictoryAxis, VictoryLegend, Rect } from 'victory';
import { makeStyles } from '@material-ui/core';
import { debounce } from 'lodash';
import Legend from "../components/ConfidenceResponseLegend";
import CustomBar from "../components/CustomBar";

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


const ResponsesGraph = () => {
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

  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const barThickness = 55;
  const barThicknessZero = 30;
  const smallPadding = 8;
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
            // dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={barThickness + smallPadding} selectedHeight={boundingRect.height - defaultVictoryPadding - 60} selectedBarIndex={selectedBarIndex} setSelectedBarIndex={setSelectedBarIndex} />}
            />
            <VictoryBar
              name="correct"
              data={correctResponders}
              cornerRadius={5}
              labels={({ index }) => correctResponders[index].y + incorrectResponders[index].y}
              dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={barThickness + smallPadding} selectedHeight={boundingRect.height + defaultVictoryPadding} selectedBarIndex={selectedBarIndex} setSelectedBarIndex={setSelectedBarIndex} />}
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