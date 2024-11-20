import React, { useState, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateQuestionTemplateInput } from '../../../../lib/CentralModels';
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
  draftQuestion: CreateQuestionTemplateInput;
  handleIncorrectAnswerChange: (draftQuestionTemplateInput: CreateQuestionTemplateInput, index: number, value: string) => void;
  handleIncorrectExplanationChange: (draftQuestionTemplateInput: CreateQuestionTemplateInput, index: number, value: string) => void;
  isCardSubmitted: boolean;
}

export default function IncorrectAnswerCardStack({
  isSelected,
  draftQuestion,
  handleIncorrectAnswerChange,
  handleIncorrectExplanationChange,
  isCardSubmitted
}: IncorrectAnswerCardStackProps) {
  type IncorrectAnswer = {
    id: string;
    text: string;
    explanation: string;
  };

  const [incompleteAnswers, setIncompleteAnswers] = useState<IncorrectAnswer[]>([
    { id: 'card-1', text: '', explanation: ''},
    { id: 'card-2', text: '', explanation: ''},
    { id: 'card-3', text: '', explanation: ''},
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

  const verifyCorrectAnswerCardComplete = (index: number) => {
    if (
      draftQuestion 
      && draftQuestion.incorrectAnswers[index] 
      && draftQuestion.incorrectAnswers[index].answer 
      && draftQuestion.incorrectAnswers[index].answer.length > 0 
      && draftQuestion.incorrectAnswers[index].explanation
      && draftQuestion.incorrectAnswers[index].explanation.length > 0
    ) {
      return true;
    }
    return false;
  }

  const handleLocalAnswerChange = (index: number, value: string) => {
    const prevAnswers = [...incompleteAnswers];
    prevAnswers[index].text = value;
    setIncompleteAnswers(prevAnswers);
    handleIncorrectAnswerChange(draftQuestion, index, value);
  };

  const handleLocalExplanationChange = (index: number, value: string) => {
    const prevAnswers = [...incompleteAnswers];
    prevAnswers[index].explanation = value;
    setIncompleteAnswers(prevAnswers);
    handleIncorrectExplanationChange(draftQuestion, index, value);
  };

  useEffect(() => {
   draftQuestion.incorrectAnswers.forEach((card) => {
    if (card.answer.length > 0 && card.explanation.length > 0) {
      const isIncomplete = incompleteAnswers.some(
        (answer) =>
          answer.text === card.answer &&
          answer.explanation === card.explanation
      );

      if (isIncomplete) {
        handleNextCardClick();
      }
    }
  });
  }, [draftQuestion, incompleteAnswers]); // eslint-disable-line react-hooks/exhaustive-deps

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
                  <IncorrectAnswerCard 
                    index={index} 
                    answer={card.text}
                    explanation={card.explanation}
                    isSelected={isSelected} 
                    handleLocalAnswerChange={handleLocalAnswerChange} 
                    handleLocalExplanationChange={handleLocalExplanationChange}
                    isCardSubmitted={isCardSubmitted}
                  />
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
                <IncorrectAnswerCard   
                  index={index} 
                  answer={card.text} 
                  explanation={card.explanation}
                  isSelected={isSelected} 
                  handleLocalAnswerChange={handleLocalAnswerChange} 
                  handleLocalExplanationChange={handleLocalExplanationChange}
                  isCardSubmitted={isCardSubmitted}
                />
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
              <IncorrectAnswerCard   
                index={index}
                answer={card.text} 
                explanation={card.explanation}
                isSelected={isSelected} 
                handleLocalAnswerChange={handleLocalAnswerChange} 
                handleLocalExplanationChange={handleLocalExplanationChange}
                isCardSubmitted={isCardSubmitted}
              />
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
