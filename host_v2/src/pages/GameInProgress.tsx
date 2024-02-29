import React from 'react';
import { GameSessionState } from '@righton/networking';
import { styled } from '@mui/material/styles';
import { 
  Box,
  Paper
} from '@mui/material';

import FooterContent from '../components/FooterComponents/FooterContent';
import GameInProgressContentSwitch from '../components/GameInProgressContentSwitch';

interface GameInProgressProps {
  onSelectMistake: (value: any, isBasedOnPopularity: boolean) => void;
  shortAnswerResponses: any[]; // Assuming it's an array of objects

}

const ContentContainerStyled = styled(Box)({
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
    overflowY: 'auto',
    touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
    padding: '24px',
    boxSizing: 'border-box',
});

const BackgroundStyled = styled(Paper)({
    position: 'fixed',
    height: '100%',
    width: '100%',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
});

export default function GameInProgress({ onSelectMistake, shortAnswerResponses }: GameInProgressProps) {
    type FooterButtonTextDictionary = {
        [key: number]: string;
    };

    const footerButtonTextDictionary: FooterButtonTextDictionary = {
        // dictionary used to assign button text based on the next state
        1: 'Begin Question',
        2: 'Continue',
        3: 'Go to Results',
        4: 'Go to Phase 2',
        5: 'Start Phase 2 Question',
        6: 'Continue',
        7: 'Go to Results',
        8: 'Go to Next Question',
        9: 'Proceed to RightOn Central',
    };
    const currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;
    const phaseOneTime = 180;
    const phaseTwoTime = 180;
    // const inputNum = 3;
    const totalNum = 4;
    const statePosition = 2;
    const gameTimerZero = false
    const teams: number[] = [1, 2, 3]
    const numPlayers = teams ? teams.length : 0;

    const getFooterText = (players: number, totalAnswers: number, statePositionParam: number) => {
        if (statePositionParam === 2 || statePositionParam === 6) {
          if (totalAnswers < players && gameTimerZero === false)
            return 'End Answering';
          return footerButtonTextDictionary[statePosition];
        }
        return footerButtonTextDictionary[statePosition];
      };

    return(
      <BackgroundStyled>
        <ContentContainerStyled>
          <GameInProgressContentSwitch
            totalAnswers={totalNum}
            numPlayers={numPlayers}
            shortAnswerResponses={shortAnswerResponses}
            onSelectMistake={onSelectMistake}
            
          />
        </ContentContainerStyled>
        <FooterContent
        inputNum={numPlayers} // need # for answer bar
        totalNum={totalNum} // number of answers
        footerBar = {currentState}
        phaseOneTime={phaseOneTime}
        phaseTwoTime={phaseTwoTime}
        footerButtonText={getFooterText(
            teams ? teams.length : 0,
            totalNum,
            statePosition,
        )} // provides index of current state for use in footer dictionary
        // footerButtonText='End Answering'
        />
      </BackgroundStyled>
    )
}
    