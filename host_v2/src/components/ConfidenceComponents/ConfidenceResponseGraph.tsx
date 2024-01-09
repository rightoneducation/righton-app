import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  VictoryChart,
  VictoryContainer,
  VictoryStack,
  VictoryBar,
  VictoryLabel,
  VictoryAxis,
} from 'victory';
import { debounce } from 'lodash';
import { ConfidenceLevel } from '@righton/networking';
import Legend from './ConfidenceResponseLegend';
import CustomBar from './CustomBar';

// TODO: maybe move styled components to bottom?
const LabelStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.playerFeedbackLabelColor}`,
  fontSize: `${theme.typography.caption.fontSize}`,
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  opacity: 0.4
}));

const ContainerStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: `calc(${theme.extraSmallPadding})/2`,
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
}));


interface GraphProps {
  // TODO: change these to their correct types (and make them non-optional)
  confidenceData?: any;
  graphClickInfo?: any;
  handleGraphClick?: any;
}

export default function ConfidenceResponsesGraph({
  confidenceData,
  graphClickInfo,
  handleGraphClick,
}: GraphProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();

  const correctColor = `${theme.palette.primary.main}`;
  const incorrectColor = 'transparent';
  const barThickness = 55;
  const smallPadding = 12;
  const customThemeGraph = {
    axis: {
      style: {
        axis: { stroke: `${theme.palette.primary.graphAccentColor}`, strokeWidth: 2 },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: 10,
          fill: `${theme.palette.primary.graphAccentColor}`,
          fontSize: 18,
        },
      },
    },
    stack: {
      colorScale: [incorrectColor, correctColor],
      style: {
        data: {
          stroke: `${theme.palette.primary.main}`,
          strokeWidth: 2,
        },
      },
    },
    bar: {
      style: {
        data: {
          fill: `${theme.palette.primary.graphAccentColor}`,  // Adjust the fill color as needed
        },
      },
      barWidth: 55,
    },
  };
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef<HTMLDivElement>(null);
  // this is req'd to handle the resizing of the graph container so that Victory can render the svgs
  // eslint-disable-next-line consistent-return
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
  const correctResponders: any = [];
  const incorrectResponders: any = [];

  const ConfidenceLevelDictionary: { [key: number]: string } = {
    0: 'Not\nRated',
    1: 'Not At\nAll',
    2: 'Kinda',
    3: 'Quite',
    4: 'Very',
    5: 'Totally',
  };
  Object.keys(ConfidenceLevel).forEach((key, index: number) => {
    correctResponders.push({
      x: ConfidenceLevelDictionary[index],
      y: confidenceData[index].correct,
    });
    incorrectResponders.push({
      x: ConfidenceLevelDictionary[index],
      y: confidenceData[index].incorrect,
    });
  });

  return (
    <ContainerStyled>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '-5%',
          marginTop: '5%',
        }}
      >
        <LabelStyled>
          Number of players
        </LabelStyled>
      </div>
      <div ref={graphRef}>
        <VictoryChart
          theme={customThemeGraph}
          height={200}
          containerComponent={
            <VictoryContainer
              style={{
                touchAction: "auto"
              }}
            />
          }
        >
          <VictoryStack
            standalone={false}
            labelComponent={
              <VictoryLabel
                style={{
                  fill: `${theme.palette.primary.main}`,
                  fontSize: 18,
                }}
              />
            }
          >
            <VictoryBar
              name="incorrect"
              data={incorrectResponders}
              cornerRadius={({ index }) =>
                index !== undefined && correctResponders[index].y === 0 ? 5 : 0
              }
              labels={({ index }) =>
                correctResponders[index].y + incorrectResponders[index].y
              }
              dataComponent={
                <CustomBar
                  // smallPadding={smallPadding}
                  selectedWidth={barThickness + smallPadding}
                  selectedHeight={200}
                  graphClickInfo={graphClickInfo}
                  handleGraphClick={handleGraphClick}
                />
              }
            />
            <VictoryBar
              name="correct"
              data={correctResponders}
              cornerRadius={5}
              labels={({ index }) =>
                correctResponders[index].y + incorrectResponders[index].y
              }
              dataComponent={
                <CustomBar
                  // smallPadding={smallPadding}
                  selectedWidth={barThickness + smallPadding}
                  selectedHeight={200}
                  graphClickInfo={graphClickInfo}
                  handleGraphClick={handleGraphClick}
                />
              }
            />
            <VictoryAxis
              tickValues={correctResponders.map((datum: any) => datum.x)}
            />
          </VictoryStack>
        </VictoryChart>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LabelStyled>
          Confidence
        </LabelStyled>
      </div>
      <Legend />
    </ContainerStyled>
  );
}
