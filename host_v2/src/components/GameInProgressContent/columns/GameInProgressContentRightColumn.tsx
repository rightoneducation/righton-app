
import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IPhase, GameSessionState } from '@righton/networking';
import { ScreenSize, IGraphClickInfo, IGraphClickIndices } from '../../../lib/HostModels';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import Responses from '../../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../../ConfidenceGraph/ConfidenceCard';


interface GameInProgressContentRightColumnProps {
  currentPhase: IPhase;
  currentState: GameSessionState;
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  confidences: IHostTeamAnswersConfidence[];
  numPlayers: number;
  isConfidenceEnabled: boolean;
  isShortAnswerEnabled: boolean;
  screenSize: ScreenSize;
  graphClickInfo: IGraphClickIndices;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export default function GameInProgressContentRightColumn ({
    currentPhase,
    currentState,
    currentQuestion,
    responses,
    confidences,
    numPlayers,
    isConfidenceEnabled,
    isShortAnswerEnabled,
    screenSize,
    graphClickInfo,
    setGraphClickInfo,
  }: GameInProgressContentRightColumnProps
){
  const theme = useTheme();
  return (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
      <ScrollBoxStyled>
        <Responses
          currentQuestion={currentQuestion}
          responses={responses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter))}
          statePosition={currentPhase === IPhase.ONE ? 0 : 8}
          isShortAnswerEnabled={currentQuestion.isShortAnswerEnabled}
          isPrevPhaseResponses
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
        />
        {isConfidenceEnabled && currentPhase === IPhase.TWO &&
          <ConfidenceCard
            confidences={confidences}
            numPlayers={numPlayers}
            graphClickInfo={graphClickInfo}
            setGraphClickInfo={setGraphClickInfo}
          />
        }
      </ScrollBoxStyled>
    </Grid>
  );
}
