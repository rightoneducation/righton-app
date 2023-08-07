import React, { useState, useRef, useEffect } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryContainer, VictoryPortal } from 'victory';
import { debounce } from 'lodash';
import CustomTick from './CustomTick';
import CustomLabel from './CustomLabel';
import CustomBar from './CustomBar';

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
    marginTop: '3%',
  },
  tooltip: {}
});

const ResponsesGraph = ({ studentResponses, numPlayers, totalAnswers, questionChoices, statePosition }) => {
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  const barThickness = 18;
  const barThicknessZero = 27;
  const smallPadding = 8;
  const noResponseLabel = '–';
  // victory applies a default of 50px to the VictoryChart component
  // we intentionally set this so that we can reference it programmatically throughout the chart
  const defaultVictoryPadding = 50;

  const [selectedBarIndex, setSelectedBarIndex] = useState(null);

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

  const classes = useStyles();
  const reversedResponses = [
    { label: noResponseLabel, count: numPlayers - totalAnswers, answer: 'No response' },
    ...studentResponses,
  ].reverse();

  
  const data = reversedResponses.map(({ label, count, answer }) => ({
    answerChoice: label,
    answerCount: count,
    answerText: answer,
  }));
  
  const correctChoiceIndex = questionChoices.findIndex(({ isAnswer }) => isAnswer) + 1;

  const largestAnswerCount = Math.max(...data.map(response => response.answerCount));

  const calculateRoundedTicks = () => {
    const maxAnswerCount = Math.max(...data.map(({ answerCount }) => answerCount));
    const tickInterval = 5;
    const tickCount = Math.ceil(maxAnswerCount / tickInterval);
    return Array.from({ length: tickCount + 1 }, (_, index) => index * tickInterval);
  };

  useEffect(() => {
    const handleResize = () => {
      const node = graphRef.current;
      if (node) {
        const { width } = node.getBoundingClientRect();
        setBoundingRect((prevRect) => ({
          ...prevRect,
          width,
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  const customTheme = {
    axis: {
      style: {
        axis: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: 20
        },
      },
    },
    dependentAxis: {
      style: {
        axis: { stroke: 'transparent' },
        grid: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
        tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400', fontSize: '12px' },
      },
    },
    bar: {
      style: {
        data: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? 'transparent' : '#FFF'),
          stroke: '#FFF',
          strokeWidth: 1,
          margin: 300,
        },
        labels: {
          fill: ({ datum, index }) => (index === reversedResponses.length - 1 || datum.answerCount === 0 ? '#FFF' : '#384466'),
          fontFamily: 'Rubik',
          fontWeight: '400',
          textAnchor: 'end',
          fontSize: '12px'
        },
      },
    },
  };

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Number of players
        </Typography>
      </div>
      <div ref={graphRef} >
        <VictoryChart
          domainPadding={37}
          padding={defaultVictoryPadding}
          containerComponent={<VictoryContainer />}
          theme={customTheme}
          width={boundingRect.width}
          height={410}
        >
          <VictoryAxis
            standalone={false}
            tickLabelComponent={
            <CustomTick reversedResponses={reversedResponses} correctChoiceIndex={correctChoiceIndex} statePosition={statePosition} />}
          />
          {largestAnswerCount < 5 && (
            <VictoryAxis
              dependentAxis
              crossAxis={false}
              standalone={false}
              orientation="top"
              tickValues={[0]}
            />
          )}
          {largestAnswerCount >= 5 && (
            <VictoryAxis
              dependentAxis
              crossAxis={false}
              standalone={false}
              orientation="top"
              tickValues={calculateRoundedTicks()}
              tickFormat={tick => Math.round(tick)}
            />
          )}
          <VictoryBar
            data={data}
            y="answerCount"
            x="answerChoice"
            horizontal
            standalone={false}
            cornerRadius={{ topLeft: 4, topRight: 4 }}
            labels={({ datum }) => `${datum.answerCount}`}
            barWidth={({ datum }) =>  datum.answerCount !== 0 ? barThickness : barThicknessZero} 
            dataComponent={<CustomBar smallPadding={smallPadding} selectedWidth={boundingRect.width-(defaultVictoryPadding+15)} selectedHeight={18} selectedBarIndex={selectedBarIndex} setSelectedBarIndex={setSelectedBarIndex}/>}
            labelComponent={
                <CustomLabel 
                  barThickness={barThickness} 
                  smallPadding={smallPadding} 
                  defaultVictoryPadding={defaultVictoryPadding} 
                  questionChoices={questionChoices}
                  noResponseLabel={noResponseLabel}
                  />
            }
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default ResponsesGraph;