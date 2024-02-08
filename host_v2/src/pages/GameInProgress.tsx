import React from 'react';
import { GameSessionState } from '@righton/networking';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import FooterContent from '../components/FooterComponents/FooterContent';


export default function GameInProgress() {
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
    const currentTimer = 90;
    const gameTimerZero = false
    const totalTime =
        currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
        ? phaseOneTime
        : phaseTwoTime;

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
    )
}
    