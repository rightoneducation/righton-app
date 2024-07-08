import React from 'react';
import { Grid } from '@mui/material';
import { GameSessionState, IHostTeamAnswersHint } from '@righton/networking';
import { Mistake } from "../../../lib/HostModels";
import ScrollBoxStyled from '../../../lib/styledcomponents/layout/ScrollBoxStyled';
import FeaturedMistakes from '../../FeaturedMistakes';
import HintsCard from '../../HintsGraph/HintsCard';


interface GameInProgressContentMidColumnProps {
  onSelectMistake: (answer: string, isSelected: boolean) => void;
  sortedMistakes: Mistake[];
  setSortedMistakes: (value: Mistake[]) => void;
  isPopularMode: boolean;
  setIsPopularMode: (value: boolean) => void;
  featuredMistakesSelectionValue: string;
  isShortAnswerEnabled: boolean;
  isHintEnabled: boolean;
  currentHints: IHostTeamAnswersHint[];
  numPlayers: number;
}


export default function GameInProgressContentMidColumn ({ 
    onSelectMistake,
    sortedMistakes,
    setSortedMistakes,
    isPopularMode,
    setIsPopularMode,
    featuredMistakesSelectionValue,
    isShortAnswerEnabled,
    isHintEnabled,
    currentHints,
    numPlayers
  }: GameInProgressContentMidColumnProps
){
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
          numPlayers={numPlayers}
          currentState={GameSessionState.CHOOSE_TRICKIEST_ANSWER}
        />
      }
    </ScrollBoxStyled>
  </Grid>
  );
}