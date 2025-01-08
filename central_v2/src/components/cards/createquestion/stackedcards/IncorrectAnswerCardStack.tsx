import React, { useState, useRef, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CentralQuestionTemplateInput, IncorrectCard } from '@righton/networking';
import { APIClientsContext } from '../../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../../hooks/context/useAPIClientsContext';
import { CreateQuestionHighlightCard } from '../../../../lib/CentralModels';
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
  draftQuestion: CentralQuestionTemplateInput;
  incompleteIncorrectAnswers: IncorrectCard[];
  completeIncorrectAnswers: IncorrectCard[];
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  handleNextCardButtonClick: () => void;
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
  const [topCardHeight, setTopCardHeight] = useState(0);
  const [isAIExplanationGenerated, setIsAIExplanationGenerated] = useState(false);
  const getContainerHeight = () => {
    let height = 0;
    if (incompleteIncorrectAnswers.length !== 0) {
      height = incompleteIncorrectAnswers.length-1 * 50 + 244;
      if (isAIExplanationGenerated)
        height += topCardHeight;
      if (isAIEnabled && incompleteIncorrectAnswers[0].explanation.length > 0) // todo: this needs more thought
        height += 110;
    }
    return height;
  }

  const handleTopCardHeightChange = (height: number) => {
    console.log(height);
    setTopCardHeight(height);
  }

  const handleAIExplanationGenerated = (isGenerated: boolean) => {
    setIsAIExplanationGenerated(isGenerated);
  }

  return (
    <CardStackContainer>
      <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'}}>
        {allAnswers && allAnswers.map((_, index) => 
            <IncorrectAnswerPill index={index} selectedIndex={completeIncorrectAnswers.length} />  
          )
        }
      </Box>
      <Box style={{ width: '100%', height: getContainerHeight(), position: 'relative' }}>
        <AnimatePresence initial={false}>
          {incompleteIncorrectAnswers.map((card, index) => {
            if (index === 0) {
              return (
                <motion.div
                  key={card.id}
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
                    zIndex: incompleteIncorrectAnswers.length - index,
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
                    handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
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
                  top: isAIEnabled && isAIExplanationGenerated ? `${(index * 50) + 110 + (topCardHeight-56)}px` : `${(index * 50 + (topCardHeight-56))}px`,
                  zIndex: incompleteIncorrectAnswers.length - index - 1,
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
          paddingTop: (incompleteIncorrectAnswers.length - 1) * 50 // todo: this doesn't work when length === 1
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
      {incompleteIncorrectAnswers.length === 0 && (
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
          isEnabled={incompleteIncorrectAnswers.length > 0}
          onClick={handleNextCardButtonClick}
        />
      </Box>
      )}
    </CardStackContainer>
  );
}
