import React from 'react';
import { Grid } from '@mui/material';
import { GameSessionState, IHostTeamAnswersHint, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IQuestion, IPhase } from '@righton/networking';
import { Mistake, IGraphClickInfo, IGraphClickIndices } from "../../../lib/HostModels";
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import HintsCard from '../../HintsGraph/HintsCard';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';
import FeaturedMistakes from '../../FeaturedMistakes';


interface GameInProgressContentMidColumnProps {
  currentQuestion: IQuestion;
  currentState: GameSessionState;
  responses: IHostTeamAnswersResponse[];
  featuredMistakesSelectionValue: string;
  isShortAnswerEnabled: boolean;
  isConfidenceEnabled: boolean;
  isHintEnabled: boolean;
  currentHints: IHostTeamAnswersHint[];
  numPlayers: number;
  currentPhase: IPhase;
  graphClickInfo: IGraphClickIndices;
  confidences: IHostTeamAnswersConfidence[];
  isPopularMode: boolean;
  setIsPopularMode: (isPopularMode: boolean) => void;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentMidColumn ({
    currentQuestion,
    currentState,
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
    isPopularMode,
    setIsPopularMode,
    setGraphClickInfo
  }: GameInProgressContentMidColumnProps
){
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
    <ScrollBoxStyled>
      <Responses
        currentQuestion={currentQuestion}
        responses={responses}
        statePosition={currentPhase === IPhase.ONE ? 0 : 8}
        graphClickInfo={graphClickInfo}
        isPrevPhaseResponses={false}
        isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
        setGraphClickInfo={setGraphClickInfo}
      />
      {isConfidenceEnabled && currentPhase === IPhase.ONE &&
        <ConfidenceCard
          confidences={confidences}
          numPlayers={numPlayers}
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
        />
      }
      {isShortAnswerEnabled && currentPhase === IPhase.ONE &&
        <FeaturedMistakes
          currentQuestion={currentQuestion}
          currentState={currentState}
          featuredMistakesSelectionValue={featuredMistakesSelectionValue}
          isPopularMode={isPopularMode}
          setIsPopularMode={setIsPopularMode}
        />
      }
      {isHintEnabled && currentPhase === IPhase.TWO &&
        <HintsCard
          hints={currentHints}
          numPlayers={numPlayers}
        />
      }
    </ScrollBoxStyled>
  </Grid>
  );
}
