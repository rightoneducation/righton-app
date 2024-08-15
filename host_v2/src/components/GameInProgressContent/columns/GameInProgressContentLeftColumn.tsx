
import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IPhase, GameSessionState } from '@righton/networking';
import { ScreenSize, IGraphClickInfo } from '../../../lib/HostModels';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';
import FeaturedMistakes from '../../FeaturedMistakes';


interface GameInProgressContentLeftColumnProps {
  currentPhase: IPhase;
  featuredMistakesSelectionValue: string;
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  confidences: IHostTeamAnswersConfidence[];
  graphClickInfo: IGraphClickInfo;
  isConfidenceEnabled: boolean;
  isShortAnswerEnabled: boolean;
  screenSize: ScreenSize; 
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentLeftColumn ({ 
    currentPhase,
    featuredMistakesSelectionValue,
    currentQuestion, 
    responses, 
    confidences,
    graphClickInfo, 
    isConfidenceEnabled,
    isShortAnswerEnabled, 
    screenSize, 
    handleGraphClick 
  }: GameInProgressContentLeftColumnProps
){
  const theme = useTheme();
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
      <ScrollBoxStyled>
      {isShortAnswerEnabled && currentPhase === IPhase.ONE ?
        <FeaturedMistakes
          currentQuestion={currentQuestion}
          featuredMistakesSelectionValue={featuredMistakesSelectionValue}
        /> 
        :
        <>
        <Responses 
          currentQuestion={currentQuestion}
          responses={responses}
          statePosition={8}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
          handleGraphClick={handleGraphClick}
        />
        {isConfidenceEnabled &&
          <ConfidenceCard 
            confidences={confidences}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick}
          />
        }
        </>
      }
      </ScrollBoxStyled>
    </Grid>
  );
}