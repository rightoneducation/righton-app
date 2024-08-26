import React from 'react';
import { Grid } from '@mui/material';
import { GameSessionState, IHostTeamAnswersHint, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IQuestion, IPhase } from '@righton/networking';
import { Mistake, IGraphClickInfo } from "../../../lib/HostModels";
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import FeaturedMistakes from '../../FeaturedMistakes';
import HintsCard from '../../HintsGraph/HintsCard';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';


interface GameInProgressContentMidColumnProps {
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  featuredMistakesSelectionValue: string;
  isShortAnswerEnabled: boolean;
  isConfidenceEnabled: boolean;
  isHintEnabled: boolean;
  currentHints: IHostTeamAnswersHint[];
  numPlayers: number;
  currentPhase: IPhase;
  graphClickInfo: IGraphClickInfo;
  confidences: IHostTeamAnswersConfidence[];
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentMidColumn ({ 
    currentQuestion,
    responses,
    featuredMistakesSelectionValue,
    isShortAnswerEnabled,
    isHintEnabled,
    isConfidenceEnabled,
    currentHints,
    numPlayers,
    graphClickInfo,
    currentPhase,
    confidences,
    handleGraphClick
  }: GameInProgressContentMidColumnProps
){
  console.log('````')
  console.log(isConfidenceEnabled);
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
    <ScrollBoxStyled>
      <Responses 
        currentQuestion={currentQuestion}
        responses={responses}
        statePosition={0}
        graphClickInfo={graphClickInfo}
        isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
        handleGraphClick={handleGraphClick}
      />
      {isConfidenceEnabled && currentPhase === IPhase.ONE && 
        <ConfidenceCard 
          confidences={confidences}
          graphClickInfo={graphClickInfo}
          handleGraphClick={handleGraphClick}
        />
      }
      {isHintEnabled && currentPhase === IPhase.TWO &&
        <HintsCard 
          hints={currentHints}
          numPlayers={numPlayers}
          currentState={GameSessionState.CHOOSE_TRICKIEST_ANSWER}
        />
      }
    </ScrollBoxStyled>
  </Grid>
  );
}