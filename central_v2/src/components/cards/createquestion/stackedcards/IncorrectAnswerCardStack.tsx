import React from 'react';
import { Box, styled } from '@mui/material';
import IncorrectAnswerCard from './IncorrectAnswerCard';
import CentralButton from '../../../button/Button';
import { ButtonType } from '../../../button/ButtonModels';


const CardStackContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

// interface IncorrectAnswerCardstackProps {

// }

export default function IncorrectAnswerCardStack() {
  const incorrectAnswers = [
    { 
      answer: 'incorrect answer one', explanation: 'explanation'
    },
    { 
      answer: 'incorrect answer two', explanation: 'explanation'
    },
    { 
      answer: 'incorrect answer three', explanation: 'explanation'
    }
  ]
  return (
    <CardStackContainer>
      {incorrectAnswers.map((incorrectAnswer, index) => (
        <IncorrectAnswerCard index={index}/>
      ))
      } 
      <Box style={{position: 'absolute', zIndex: 3, bottom: '75px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <CentralButton buttonType={ButtonType.NEXTCARD} isEnabled/>
      </Box>
    </CardStackContainer>
  );
}