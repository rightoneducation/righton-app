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
import { ConfidenceLevel, IHostTeamAnswersConfidence } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import Legend from './ConfidenceResponseLegend';
import CustomBar from './CustomBar';

interface GraphProps {
  confidences: IHostTeamAnswersConfidence[];
  graphClickIndex: number | null;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

interface Response {
  x: string;
  y: number;
}

const LabelStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.playerFeedbackLabelColor}`,
  fontSize: `${theme.typography.caption.fontSize}`,
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
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
  justifyContent: 'center',
});

export default function ConfidenceResponsesGraph({
  confidences,
  graphClickIndex,
  setGraphClickInfo,
}: GraphProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();  
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 }); // eslint-disable-line
  const graphRef = useRef<HTMLDivElement>(null);
  const correctConfidencesArray = confidences.map(confidence => {
    return {
        level: confidence.level,
        label: confidence.label,
        correct: confidence.correct
    };
  });
  const incorrectConfidencesArray = confidences.map(confidence => {
    return {
        level: confidence.level,
        label: confidence.label,
        incorrect: confidence.incorrect
    };
  });
  const currentCorrectConfidences = correctConfidencesArray.map((confidence, index) => ({
    x: confidence.label,
    y: confidence.correct.length,
  }));
  const currentIncorrectConfidences = incorrectConfidencesArray.map((confidence, index) => ({
    x: confidence.label,
    y: confidence.incorrect.length,
  }));
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
  return (
    <ContainerStyled>
      <CenteredContainer>
        <LabelStyled>{t('gamesession.confidenceCard.graph.title')}</LabelStyled>
      </CenteredContainer>
      <div ref={graphRef}>
        <VictoryChart
          theme={theme.victoryConfidenceTheme}
          height={200}
          containerComponent={
            <VictoryContainer style={{ touchAction: 'auto' }} />
          }
        >
          <VictoryStack
            standalone={false}
            labelComponent={
              <VictoryLabel
                style={{
                  fill: `${theme.palette.primary.main}`,
                  fontSize: `${theme.typography.body2.fontSize}`,
                }}
              />
            }
          >
            {currentIncorrectConfidences.length > 0 &&
              <VictoryBar
                name='incorrect'
                style={{data: {fill: 'transparent'}}}
                data={currentIncorrectConfidences}
                cornerRadius={({ index }) =>
                  (index !== undefined && currentCorrectConfidences[Number(index)].y === 0)
                    ? 5
                    : 0
                }
                labels={({ index }) => {
                  if (currentCorrectConfidences[index].y === 0) {
                    return currentIncorrectConfidences[index].y + currentCorrectConfidences[index].y;
                  }
                  return null;
                }}
                dataComponent={
                  <CustomBar
                    selectedWidth={
                      theme.sizing.confidenceBarThickness + theme.sizing.xSmPadding
                    }
                    selectedHeight={200}
                    graphClickIndex={graphClickIndex}
                    setGraphClickInfo={setGraphClickInfo}
                  />
                }
              />
            }
            {currentCorrectConfidences.length > 0 &&
              <VictoryBar
                name='correct'
                style={{data: {fill: '#FFF'}}}
                data={currentCorrectConfidences}
                cornerRadius={5}
                labels={({ index }) =>
                  currentIncorrectConfidences[index].y + currentCorrectConfidences[index].y
                }
                dataComponent={
                  <CustomBar
                    selectedWidth={
                      theme.sizing.confidenceBarThickness + theme.sizing.xSmPadding
                    }
                    selectedHeight={200}
                    graphClickIndex={graphClickIndex}
                    setGraphClickInfo={setGraphClickInfo}
                  />
                }
              />
            }
            <VictoryAxis
              tickValues={currentCorrectConfidences.map((datum: Response) => datum.x)}
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
