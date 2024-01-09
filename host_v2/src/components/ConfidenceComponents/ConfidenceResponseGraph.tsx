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

const LabelStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.playerFeedbackLabelColor}`,
  fontSize: `${theme.typography.caption.fontSize}`,
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch'
}));

const ContainerStyled = styled(Box)({
  display: 'flex',
  padding: `4px`,
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
});

const CenteredContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center'
});

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
  const customThemeGraph = {
    axis: {
      style: {
        axis: { stroke: `${theme.palette.primary.graphAccentColor}`, strokeWidth: `${theme.sizing.barStrokeWidth}` },
        grid: { stroke: 'transparent' },
        tickLabels: {
          padding: 10,
          fill: `${theme.palette.primary.playerFeedbackLabelColor}`,
          fontSize: `${theme.typography.body2.fontSize}`,
        },
      },
    },
    stack: {
      colorScale: [incorrectColor, correctColor],
      style: {
        data: {
          stroke: `${theme.palette.primary.main}`,
          strokeWidth: `${theme.sizing.barStrokeWidth}`,
        },
      },
    },
    bar: {
      style: {
        data: {
          fill: `${theme.palette.primary.graphAccentColor}`,
        },
      },
      barWidth: `${theme.sizing.confidenceBarThickness}`,
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

  /**
   * @param name must be either 'correct' or 'incorrect'
   * @returns VictoryBar component for approproate data based on name arg
   */
  function customBar(name: string): any {
    return (
      <VictoryBar
        name={name}
        data={name === 'incorrect' ? incorrectResponders : correctResponders}
        cornerRadius={({ index }) =>
          (index !== undefined && correctResponders[index].y === 0) ||
            name === 'correct' ? 5 : 0
        }
        labels={({ index }) =>
          correctResponders[index].y + incorrectResponders[index].y
        }
        dataComponent={
          <CustomBar
            selectedWidth={theme.sizing.confidenceBarThickness}
            selectedHeight={200}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick}
          />
        }
      />);
  }

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
      <CenteredContainer>
        <LabelStyled>{t('gamesession.confidenceCard.graph.title')}</LabelStyled>
      </CenteredContainer>
      <div ref={graphRef}>
        <VictoryChart
          theme={customThemeGraph}
          height={200}
          containerComponent={
            <VictoryContainer style={{ touchAction: "auto" }} />
          }>
          <VictoryStack
            standalone={false}
            labelComponent={
              <VictoryLabel
                style={{
                  fill: `${theme.palette.primary.main}`,
                  fontSize: `${theme.typography.body2.fontSize}`,
                }} />}>
            {customBar('incorrect')}
            {customBar('correct')}
            <VictoryAxis
              tickValues={correctResponders.map((datum: any) => datum.x)}
            />
          </VictoryStack>
        </VictoryChart>
      </div>
      <CenteredContainer>
        <LabelStyled>{t('gamesession.confidenceCard.title')}</LabelStyled>
      </CenteredContainer>
      <Legend />
    </ContainerStyled>
  );
}
