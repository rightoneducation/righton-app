import React, { useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import IncorrectAnswerCard from './IncorrectAnswerCard';
import CentralButton from '../../../button/Button';
import { ButtonType } from '../../../button/ButtonModels';
import IncorrectAnswerPill from './IncorrectAnswerPill';

const CardStackContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '16px',
});

interface IncorrectAnswerCardStackProps {
  isSelected: boolean;
}

export default function IncorrectAnswerCardStack({isSelected}: IncorrectAnswerCardStackProps) {
  type IncorrectAnswer = {
    id: string;
    text: string;
    explanation: string;
  };

  const [incompleteAnswers, setIncompleteAnswers] = useState<IncorrectAnswer[]>([
    { id: 'card-1', text: 'A', explanation: 'Explanation A'},
    { id: 'card-2', text: 'B', explanation: 'Explanation B'},
    { id: 'card-3', text: 'C', explanation: 'Explanation C'},
  ]);

  const [completeAnswers, setCompleteAnswers] = useState<IncorrectAnswer[]>([]);

  const allAnswers = [...incompleteAnswers, ...completeAnswers];
  const isAllCompleted = incompleteAnswers.length === 0;

  const handleNextCardClick = () => {
    if (incompleteAnswers.length === 0) return;
    const [movingCard, ...remainingCards] = incompleteAnswers;
    setIncompleteAnswers(remainingCards);
    setCompleteAnswers([movingCard, ...completeAnswers]);
  };

  return (
    <CardStackContainer>
      <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'}}>
        {allAnswers && allAnswers.map((_, index) => 
            <IncorrectAnswerPill index={index} selectedIndex={completeAnswers.length} />  
          )
        }
      </Box>
      <Box style={{ width: '100%', height: incompleteAnswers.length !== 0 ? `calc(${(incompleteAnswers.length-1) * 50}px + 244px )` : 0, position: 'relative' }}>
        <AnimatePresence>
          {incompleteAnswers.map((card, index) => {
            if (index === 0) {
              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: 274 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    zIndex: incompleteAnswers.length - index,
                  }}
                >
                  <IncorrectAnswerCard answer={card.text} isSelected={isSelected}/>
                </motion.div>
              );
            }
            return (
              <Box
                key={card.id}
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: `${index * 50}px`,
                  zIndex: incompleteAnswers.length - index - 1
                }}
              >
                <IncorrectAnswerCard answer={card.text} />
              </Box>
            );
          })}
        </AnimatePresence>
      </Box>
      <Box
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          opacity: isAllCompleted ? 0.6 : 1,
        }}
      >
        <AnimatePresence>
          {completeAnswers.map((card, index) => (
            <motion.div
              key={card.id}
              layoutId={card.id}
              initial={{ opacity: 1, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{
                zIndex: completeAnswers.length - index,
                width: '100%',
              }}
            >
              <IncorrectAnswerCard answer={card.text} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      {incompleteAnswers.length !== 0 && (
      <Box
        style={{
          position: 'absolute',
          zIndex: 3,
          top: '274px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CentralButton
          buttonType={ButtonType.NEXTCARD}
          isEnabled={incompleteAnswers.length > 0}
          onClick={handleNextCardClick}
        />
      </Box>
      )}
    </CardStackContainer>
  );
}
