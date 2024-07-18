import React from 'react';
import { Grid } from '@mui/material';
import { GameSessionState, IHostTeamAnswersHint, IHostTeamAnswersResponse, IQuestion } from '@righton/networking';
import { Mistake, IGraphClickInfo } from "../../../lib/HostModels";
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import FeaturedMistakes from '../../FeaturedMistakes';
import HintsCard from '../../HintsGraph/HintsCard';
import Responses from '../../ResponsesGraph/ResponsesCard';


interface GameInProgressContentMidColumnProps {
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  featuredMistakesSelectionValue: string;
  isShortAnswerEnabled: boolean;
  isHintEnabled: boolean;
  currentHints: IHostTeamAnswersHint[];
  numPlayers: number;
  graphClickInfo: IGraphClickInfo;
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentMidColumn ({ 
    currentQuestion,
    responses,
    featuredMistakesSelectionValue,
    isShortAnswerEnabled,
    isHintEnabled,
    currentHints,
    numPlayers,
    graphClickInfo,
    handleGraphClick
  }: GameInProgressContentMidColumnProps
){
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
    <ScrollBoxStyled>
      {isShortAnswerEnabled ?
        <FeaturedMistakes
          currentQuestion={currentQuestion}
          responses={responses}
          featuredMistakesSelectionValue={featuredMistakesSelectionValue}
        /> 
        :
        <Responses 
          currentQuestion={currentQuestion}
          responses={responses}
          statePosition={6}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
          handleGraphClick={handleGraphClick}
        />
      }
      {isHintEnabled && 
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