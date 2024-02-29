import React from 'react';
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material';
import { GameSessionState } from "@righton/networking";
import FeaturedMistakes from "./FeaturedMistakes";

interface GameInProgressContentSwitchProps {
  totalAnswers: number;
  numPlayers: number;
  shortAnswerResponses: any[]; // Assuming it's an array of objects
  onSelectMistake: (value: any, isBasedOnPopularity: boolean) => void;
}

const ConfigContainerStyled = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '24px',
  width: '100%',
  maxWidth: "500px"
});

const ContentContainerStyled = styled(Box)({

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '500px',

});

export default function GameInProgressContentSwitch({
  totalAnswers,
  numPlayers,
  shortAnswerResponses,
  onSelectMistake,
}: GameInProgressContentSwitchProps) {

  const gameplayComponents = (
    <ConfigContainerStyled>
      <FeaturedMistakes
        shortAnswerResponses={shortAnswerResponses}
        totalAnswers={totalAnswers}
        onSelectMistake={onSelectMistake}
        // numPlayers={numPlayers}
      />
    </ConfigContainerStyled>
  );

  return (
    <ContentContainerStyled>
      {gameplayComponents}
    </ContentContainerStyled>
  );
}


// const useStyles = makeStyles({
//   contentContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     width: '100%',
//     maxWidth: '500px',
//   },
//   configContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     gap: '24px',
//     width: '100%',
//     maxWidth: "500px"
//   }
// });