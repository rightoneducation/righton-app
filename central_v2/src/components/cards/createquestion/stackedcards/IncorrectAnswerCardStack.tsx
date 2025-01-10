import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CentralQuestionTemplateInput, IncorrectCard } from '@righton/networking';
import { APIClientsContext } from '../../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../../hooks/context/useAPIClientsContext';
import { CreateQuestionHighlightCard } from '../../../../lib/CentralModels';
import IncorrectAnswerCard from './IncorrectAnswerCard';
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
  draftQuestion: CentralQuestionTemplateInput;
  incompleteIncorrectAnswers: IncorrectCard[];
  completeIncorrectAnswers: IncorrectCard[];
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  handleNextCardButtonClick: (cardData: IncorrectCard) => void;
  handleIncorrectCardStackUpdate: (cardData: IncorrectCard, draftQuestion: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => void;
  isCardSubmitted: boolean;
  isAIEnabled: boolean;
}

export default function IncorrectAnswerCardStack({
  highlightCard,
  draftQuestion,
  incompleteIncorrectAnswers,
  completeIncorrectAnswers,
  handleCardClick,
  handleNextCardButtonClick,
  handleIncorrectCardStackUpdate,
  isCardSubmitted,
  isAIEnabled
}: IncorrectAnswerCardStackProps) {

  const allAnswers = [...incompleteIncorrectAnswers, ...completeIncorrectAnswers];
  // need to pass the apiClients created at app init to the AI components
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [topCardHeight, setTopCardHeight] = useState(258);
  const [isAIExplanationGenerated, setIsAIExplanationGenerated] = useState(false);
  const handleTopCardHeightChange = (height: number) => {
    setTopCardHeight(height);
  }

  const handleAIExplanationGenerated = (isGenerated: boolean) => {
    setIsAIExplanationGenerated(isGenerated);
  }

  const handleIncorrectCardStackUpdateLocal = (cardData: IncorrectCard, draftQuestionInput: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => {
    handleIncorrectCardStackUpdate(cardData, draftQuestionInput, completeAnswers, incompleteAnswers);
    setIsAIExplanationGenerated(false);
  }
  return (
    <CardStackContainer>
      <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'}}>
        {allAnswers && allAnswers.map((_, index) => 
            <IncorrectAnswerPill index={index} selectedIndex={completeIncorrectAnswers.length} />  
          )
        }
      </Box>
      <Box style={{ width: '100%', height: incompleteIncorrectAnswers.length > 0 ?  topCardHeight + ((incompleteIncorrectAnswers.length - 1) * 50) : 0, position: 'relative' }}>
        <AnimatePresence initial={false}>
          {incompleteIncorrectAnswers.map((card, index) => {
            if (index === 0) {
              return (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={card.id}
                  initial={false}
                  exit={{ 
                    opacity: 0, 
                    y: 274,
                    transition: { duration: 0.6, ease: 'easeInOut' }
                   }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    zIndex: 3,
                  }}
                >
                  <IncorrectAnswerCard
                    apiClients={apiClients}
                    answerData={card} 
                    draftQuestion={draftQuestion}
                    isHighlight={highlightCard === card.id}
                    isCardSubmitted={isCardSubmitted}
                    isAIEnabled={isAIEnabled}
                    isTopCard
                    handleNextCardButtonClick={handleNextCardButtonClick}
                    handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdateLocal}
                    handleCardClick={handleCardClick}
                    handleTopCardHeightChange={handleTopCardHeightChange}
                    handleAIExplanationGenerated={handleAIExplanationGenerated}
                    completeAnswers={completeIncorrectAnswers}
                    incompleteAnswers={incompleteIncorrectAnswers}                    
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
                  top:  (topCardHeight - 258) + ((index) * 50),
                  zIndex: incompleteIncorrectAnswers.length - index,
                  transition: 'top 0.6s ease-in-out',
                }}
              >
                <IncorrectAnswerCard
                  apiClients={apiClients}   
                  answerData={card} 
                  draftQuestion={draftQuestion}
                  isHighlight={highlightCard === card.id}
                  isCardSubmitted={isCardSubmitted}
                  isAIEnabled={isAIEnabled}
                  handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
                  handleCardClick={handleCardClick}
                  handleAIExplanationGenerated={handleAIExplanationGenerated}
                  completeAnswers={completeIncorrectAnswers}
                  incompleteAnswers={incompleteIncorrectAnswers}
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
        }}
      >
        {completeIncorrectAnswers.map((card, index) => (
          <motion.div
            key={card.id}
            layoutId={card.id}
            initial={{ opacity: 1, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              zIndex: completeIncorrectAnswers.length - index,
              width: '100%',
            }}
          >
            <IncorrectAnswerCard
              apiClients={apiClients}   
              answerData={card} 
              draftQuestion={draftQuestion}
              isHighlight={highlightCard === card.id}
              isCardSubmitted={isCardSubmitted}
              isAIEnabled={isAIEnabled}
              handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
              handleCardClick={handleCardClick}
              handleAIExplanationGenerated={handleAIExplanationGenerated}
              completeAnswers={completeIncorrectAnswers}
              incompleteAnswers={incompleteIncorrectAnswers}
            />
          </motion.div>
        ))}
      </Box>
    </CardStackContainer>
  );
}
