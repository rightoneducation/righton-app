import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import IncorrectAnswerCard from './IncorrectAnswerCard';
import CentralButton from '../../../button/Button';
import { ButtonType } from '../../../button/ButtonModels';

const CardStackContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '16px',
});

// interface IncorrectAnswerCardstackProps {

// }



export default function IncorrectAnswerCardStack() {

  type Answer = {
    id: string;
    text: string;
    explanation: string;
    isCompleted: boolean;
  }

  type IncorrectAnswer = {
    id?: string;
    text?: string;
    explanation?: string;
    isCompleted?: boolean;
    incompleteAnswers?: Answer[];
  }
  const [answers, setAnswers] = useState<IncorrectAnswer[]>(
    [
      {
        incompleteAnswers: [
          {
            id: 'asdfasdfasd',
            text: 'A',
            explanation: 'Explanation A',
            isCompleted: false
          },
          {
            id: 'asdfqwerqwer',
            text: 'B',
            explanation: 'Explanation C',
            isCompleted: false
          },
          {
            id: 'etyertyerty',
            text: 'C',
            explanation: 'Explanation C',
            isCompleted: false
          },
        ]
      }, 
   
    ]
  );
  const subCards = answers[0]?.incompleteAnswers?.slice(1);
console.log(subCards);
  const handleNextCardClick = () => {
    const dupAnswers = [...answers];
    if (dupAnswers[0] && dupAnswers[0].incompleteAnswers && dupAnswers[0].incompleteAnswers.length !== 0) {
        dupAnswers[0].incompleteAnswers.shift(); // Removes the first element
    }
    console.log(dupAnswers);
    setAnswers((prev) => [...dupAnswers]);
    // let dupAnswers = [...answers];
    // const currentAnswer = dupAnswers[0]; 
    // let currentIncompleteAnswer;
    // if (currentAnswer && currentAnswer.incompleteAnswers) {
    //   currentIncompleteAnswer = currentAnswer.incompleteAnswers.shift();
    //   if (currentIncompleteAnswer){
    //     const firstDupAnswer = dupAnswers.shift();
    //     if (firstDupAnswer) 
    //       dupAnswers = [firstDupAnswer, currentIncompleteAnswer, ...dupAnswers];
    //     setAnswers(dupAnswers);
    //   }
    // }
    // console.log('dupAnswers', dupAnswers);
  };

/* {
          answers.map((answer, index) => (
            (index === 0 && answer.incompleteAnswers) 
              ? answer.incompleteAnswers.map((incompleteAnswer: Answer, incompleteIndex: number) => 
                  <motion.div
                    key={incompleteAnswer.id}
                    layout
                    initial={false}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    exit={{y: 200}}
                    style={{ position: incompleteIndex === 0 ? 'relative' : 'absolute', y: (incompleteIndex *50), zIndex: 3 - (incompleteIndex), width: '100%' }}
                  >
                    <IncorrectAnswerCard answer={incompleteAnswer.text} isCompleted={incompleteIndex === 0}/>
                  </motion.div>
                  
                )
              : (answer.text && answer.explanation) &&
                <motion.div
                  key={answer.text}
                  layout
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ zIndex: 3 , width: '100%'}}
                >
                  <IncorrectAnswerCard answer={answer.text} isCompleted/>
                </motion.div>
          )) */

  return (
    <CardStackContainer>
      <AnimatePresence>
        {answers[0].incompleteAnswers && answers[0].incompleteAnswers.length !== 0 &&  
          <motion.div
            key={answers[0].incompleteAnswers[0].id}
            layout
            initial={false}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            exit={{ y: 200 }}
            style={{ position: 'absolute', width: '100%', zIndex: 3 }}
          >
            <IncorrectAnswerCard answer={answers[0].incompleteAnswers[0].text} isCompleted />
          </motion.div>
        }
      </AnimatePresence>
        {subCards && subCards.map((answer, index) => (
            (answer.text && answer.explanation) && (
              <Box style={{width: '100%', position: 'absolute', top: `calc(${(index + 1) * 50}px)`, zIndex: 3 - (index + 1) }}>
                <IncorrectAnswerCard key={answer.id} answer={answer.text} index={index+1} isCompleted={false}/>
              </Box>
            )
        ))}
      <Box style={{position: 'absolute', zIndex: 3, bottom: '32px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <CentralButton buttonType={ButtonType.NEXTCARD} isEnabled onClick={() => handleNextCardClick()}/>
      </Box>
    </CardStackContainer>
  );
}