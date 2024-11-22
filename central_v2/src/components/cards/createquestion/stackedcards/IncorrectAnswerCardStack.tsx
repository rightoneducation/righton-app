import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateQuestionHighlightCard, CreateQuestionTemplateInput, IncorrectAnswer } from '../../../../lib/CentralModels';
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
  highlightCard: CreateQuestionHighlightCard;
  draftQuestion: CreateQuestionTemplateInput;
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  handleDraftQuestionIncorrectUpdate: ( newAnswers: IncorrectAnswer[]) => void;
  isCardSubmitted: boolean;
}

export default function IncorrectAnswerCardStack({
  highlightCard,
  draftQuestion,
  handleDraftQuestionIncorrectUpdate,
  handleCardClick,
  isCardSubmitted
}: IncorrectAnswerCardStackProps) {

  const [incompleteAnswers, setIncompleteAnswers] = useState<IncorrectAnswer[]>([
    { id: 'card-1', answer: '', explanation: '', isCardComplete: false},
    { id: 'card-2', answer: '', explanation: '', isCardComplete: false},
    { id: 'card-3', answer: '', explanation: '', isCardComplete: false},
  ]);

  const [completeAnswers, setCompleteAnswers] = useState<IncorrectAnswer[]>([]);

  const allAnswers = [...incompleteAnswers, ...completeAnswers];
  const isAllCompleted = incompleteAnswers.length === 0;

  const handleNextCardClick = (newAnswers: IncorrectAnswer[]) => {
    if (newAnswers.length === 0) return;
    const [movingCard, ...remainingCards] = newAnswers;
    const updatedMovingCard = { ...movingCard, isCardComplete: true };
  
    setIncompleteAnswers(remainingCards);
    setCompleteAnswers([updatedMovingCard, ...completeAnswers]);
  };

  const handleUpdateCardData = (cardData: IncorrectAnswer, isCardComplete: boolean) => {
    const prevCompleteAnswers = [...completeAnswers];
    const prevIncompleteAnswers = [...incompleteAnswers];
    if (isCardComplete){
      const newAnswers = prevCompleteAnswers.map((answer) => {
        if (answer.id === cardData.id) {
          return cardData;
        }
        return answer;
      });
      setCompleteAnswers(newAnswers);
    } else { 
      const newAnswers = prevIncompleteAnswers.map((answer) => {
        if (answer.id === cardData.id) {
          return cardData;
        }
        return answer;
      });
      setIncompleteAnswers(newAnswers);
      handleDraftQuestionIncorrectUpdate([...newAnswers, ...completeAnswers]);
      handleNextCardClick(newAnswers);
    }
  }

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
                    answerData={card} 
                    isHighlight={highlightCard === card.id}
                    isCardComplete={false}
                    isCardSubmitted={isCardSubmitted}
                    handleUpdateCardData={handleUpdateCardData}
                    handleCardClick={handleCardClick}
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
                  answerData={card} 
                  isHighlight={highlightCard === card.id}
                  isCardComplete={false}
                  isCardSubmitted={isCardSubmitted}
                  handleUpdateCardData={handleUpdateCardData}
                  handleCardClick={handleCardClick}
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
              answerData={card} 
              isHighlight={highlightCard === card.id}
              isCardComplete
              isCardSubmitted={isCardSubmitted}
              handleUpdateCardData={handleUpdateCardData}
              handleCardClick={handleCardClick}
            />
          </motion.div>
        ))}
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
          onClick={() => handleNextCardClick(incompleteAnswers)}
        />
      </Box>
      )}
    </CardStackContainer>
  );
}
