
import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, GameSessionState } from '@righton/networking';
import { ScreenSize, IGraphClickInfo } from '../../../lib/HostModels';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';


interface GameInProgressContentRightColumnProps {
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  confidences: IHostTeamAnswersConfidence[];
  graphClickInfo: IGraphClickInfo;
  isConfidenceEnabled: boolean;
  isShortAnswerEnabled: boolean;
  screenSize: ScreenSize; 
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentRightColumn ({ 
    currentQuestion, 
    responses, 
    confidences,
    graphClickInfo, 
    isConfidenceEnabled,
    isShortAnswerEnabled, 
    screenSize, 
    handleGraphClick 
  }: GameInProgressContentRightColumnProps
){
  const theme = useTheme();
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
      <ScrollBoxStyled>
        <Responses 
          currentQuestion={currentQuestion}
          responses={responses}
          statePosition={0}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
          handleGraphClick={handleGraphClick}
        />
        { isConfidenceEnabled &&
          <ConfidenceCard 
            confidences={confidences}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick}
          />
        }
      </ScrollBoxStyled>
    </Grid>
  );
}