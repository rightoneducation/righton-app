
import { Grid } from '@mui/material';
import { IQuestion, IHostTeamAnswersResponse, IHostTeamAnswersConfidence } from '@righton/networking';
import { ScreenSize, IGraphClickInfo } from '../../../lib/HostModels';
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import FeaturedMistakes from '../../FeaturedMistakes';
import HintsCard from '../../HintsGraph/HintsCard';


interface GameInProgressContentMidColumnProps {
  currentQuestion: IQuestion;
  currentResponses: IHostTeamAnswersResponse[];
  currentConfidences: IHostTeamAnswersConfidence[];
  graphClickInfo: IGraphClickInfo;
  isConfidenceEnabled: boolean;
  isShortAnswerEnabled: boolean;
  screenSize: ScreenSize; 
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}


export const GameInProgressContentMidColumn = (
  { 
    currentQuestion, 
    currentResponses, 
    currentConfidences, 
    graphClickInfo, 
    isConfidenceEnabled,
    isShortAnswerEnabled, 
    screenSize, 
    handleGraphClick 
  }: GameInProgressContentMidColumnProps
) => {
  return (
    <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
    <ScrollBoxStyled>
      {isShortAnswerEnabled &&
        <FeaturedMistakes
          sortedMistakes={sortedMistakes}
          setSortedMistakes={setSortedMistakes}
          isPopularMode={isPopularMode}
          setIsPopularMode={setIsPopularMode}
          onSelectMistake={onSelectMistake}
          featuredMistakesSelectionValue={featuredMistakesSelectionValue}
        /> 
      }
      {isHintEnabled &&
        <HintsCard 
          hints={currentHints}
          numPlayers={localGameSession.teams.length}
          currentState={GameSessionState.CHOOSE_TRICKIEST_ANSWER}
        />
      }
    </ScrollBoxStyled>
  </Grid>
  );
}