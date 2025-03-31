import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { IExplanationToSave, ScreenSize } from '../lib/Models';
import {
  EmptyExplanationCardContainer,
  AllExplanationCardsContainer,
} from '../lib/styledcomponents/generator/StyledContainers';
import {
  PlaceholderHeaderStyled,
  PlaceholderBodyStyled,
} from '../lib/styledcomponents/generator/StyledTypography';
import ExplanationCard from './ExplanationCard';
import bloopy from '../img/loading/Bloopy.svg';

interface ExplanationCardsProps {
  screenSize: ScreenSize;
  explanationsToSave: IExplanationToSave[];
  handleUpdateExplanations: (explanation: IExplanationToSave, index: number) => void;
  isQuestionGenerating: boolean;
  isExplanationRegenerating: boolean;
  regenIndex: null | number;
}

export const ExplanationCards = ({
  screenSize,
  explanationsToSave,
  handleUpdateExplanations,
  isQuestionGenerating,
  isExplanationRegenerating,
  regenIndex,
}: ExplanationCardsProps) => {
  const isQuestionFilled = explanationsToSave.length > 0;

  return (
    <Box style={{ height: '100%', position: 'relative' }}>
      <AnimatePresence>
        {!isQuestionFilled ? (
          <motion.div
            key="empty"
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyExplanationCardContainer style={{ height: '100%', position: 'relative' }}>
              <PlaceholderHeaderStyled>
                💡 Explanations Loading...
              </PlaceholderHeaderStyled>
              <PlaceholderBodyStyled>
                Fill out all fields to generate AI-powered explanations.
              </PlaceholderBodyStyled>
              {isQuestionGenerating && (
                (screenSize != ScreenSize.SMALL) ? (
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: '10%',
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 10,
                    }}
                  >
                    <motion.img
                      src={bloopy}
                      alt="loading"
                      animate={{ rotate: [-10, 10, -10] }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                ) : (
                  <CircularProgress
                    style={{
                      color: '#000',
                    }}
                  />
                )
              )
              }
            </EmptyExplanationCardContainer>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AllExplanationCardsContainer style={{ height: '100%' }}>
              {explanationsToSave.map((explanation, index) => (
                <ExplanationCard
                  key={index}
                  index={index}
                  explanation={explanation}
                  handleUpdateExplanations={handleUpdateExplanations}
                />
              ))}
            </AllExplanationCardsContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
