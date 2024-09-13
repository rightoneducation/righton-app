
import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IPhase, GameSessionState } from '@righton/networking';
import { ScreenSize, IGraphClickInfo } from '../../../lib/HostModels';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';
import FeaturedMistakes from '../../FeaturedMistakes';


interface GameInProgressContentRightColumnProps {
  currentPhase: IPhase;
  featuredMistakesSelectionValue: string;
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  confidences: IHostTeamAnswersConfidence[];
  isConfidenceEnabled: boolean;
  isShortAnswerEnabled: boolean;
  screenSize: ScreenSize; 
  isPopularMode: boolean;
  setIsPopularMode: (isPopularMode: boolean) => void;
  graphClickInfo: IGraphClickInfo;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentRightColumn ({ 
    currentPhase,
    featuredMistakesSelectionValue,
    currentQuestion, 
    responses, 
    confidences,
    isConfidenceEnabled,
    isShortAnswerEnabled, 
    screenSize, 
    graphClickInfo,
    setGraphClickInfo,
    isPopularMode,
    setIsPopularMode
  }: GameInProgressContentRightColumnProps
){
  const theme = useTheme();
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
      <ScrollBoxStyled>
        {isShortAnswerEnabled && currentPhase === IPhase.ONE ?
          <FeaturedMistakes
            currentQuestion={currentQuestion}
            featuredMistakesSelectionValue={featuredMistakesSelectionValue}
            isPopularMode={isPopularMode}
            setIsPopularMode={setIsPopularMode}
          /> 
          :
          <Responses 
            currentQuestion={currentQuestion}
            responses={responses}
            statePosition={currentPhase === IPhase.ONE ? 0 : 8}
            isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
            graphClickInfo={graphClickInfo}
            setGraphClickInfo={setGraphClickInfo}
          />
        }
        {isConfidenceEnabled && currentPhase === IPhase.TWO && 
          <ConfidenceCard 
            confidences={confidences}
            graphClickInfo={graphClickInfo}
            setGraphClickInfo={setGraphClickInfo}
          />
        }
      </ScrollBoxStyled>
    </Grid>
  );
}