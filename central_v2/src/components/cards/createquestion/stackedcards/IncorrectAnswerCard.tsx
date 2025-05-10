import React, { useState, useMemo, useRef, useEffect} from 'react';
import { Paper, Box, styled, InputAdornment, useTheme } from '@mui/material';
import { debounce } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { CentralQuestionTemplateInput, IncorrectCard, AIButton, IAPIClients, AIButtonType, WaegenInput, RegenInput } from '@righton/networking';
import CentralButton from '../../../button/Button';
import { ButtonType } from '../../../button/ButtonModels';
import RegenExplanationCard from './RegenExplanationCard';
import { CreateQuestionHighlightCard } from '../../../../lib/CentralModels';
import errorIcon from '../../../../images/errorIcon.svg';
import aiMonster from '../../../../images/aiMonster.svg';
import aiMonsterSpeech from '../../../../images/aiMonsterSpeech.svg';
import { ErrorIcon } from '../../../../lib/styledcomponents/CentralStyledComponents';
import {
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';
import ErrorBox from '../ErrorBox';

interface StyledCardProps {
  isHighlight: boolean;
  isCardComplete: boolean;
  isCardClicked: boolean;
  isAIEnabled: boolean;
  isAIExplanationGenerated: boolean;
  isTopCard?: boolean;
  isAIRegenEnabled: boolean;
  isClone: boolean;
}

const AnswerCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isHighlight' && prop !== 'isCardComplete' && prop !== 'isCardClicked' && prop !== 'isAIEnabled' && prop !== 'isAIExplanationGenerated' && prop !== 'isTopCard' && prop !== 'isAIRegenEnabled' && prop !== 'isClone',
})<StyledCardProps>(({ theme, isHighlight, isCardComplete, isCardClicked, isAIEnabled, isAIExplanationGenerated, isAIRegenEnabled, isTopCard, isClone }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  paddingBottom: isAIEnabled && isAIExplanationGenerated && isTopCard && !isAIRegenEnabled ? '70px' : `${theme.sizing.mdPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: `10px`,
  boxShadow: isHighlight ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
  opacity: isCardComplete && !isCardClicked && !isClone ? 0.6 : 1,
  transition: 'box-shadow 0.6s, opacity  0.6s',
  position: 'relative',
  overflow: 'hidden'
}));

interface IncorrectAnswerCardProps {
  apiClients: IAPIClients;
  isClone: boolean;
  answerData: IncorrectCard;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight?: boolean;
  isCardSubmitted: boolean;
  isAIEnabled: boolean;
  isAIError: boolean;
  isTopCard?: boolean;
  handleIncorrectCardStackUpdate: (cardData: IncorrectCard, draftQuestion: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => void;
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  handleTopCardHeightChange?: (height: number) => void;
  handleAIExplanationGenerated: (isGenerated: boolean) => void;
  handleNextCardButtonClick?: (cardData: IncorrectCard) => void;
  completeAnswers: IncorrectCard[];
  incompleteAnswers: IncorrectCard[];
  isReadOnly?: boolean;
}

export default function IncorrectAnswerCard({
  apiClients,
  isClone,
  answerData,
  draftQuestion,
  isHighlight,
  isCardSubmitted,
  isAIEnabled,
  isAIError,
  isTopCard,
  handleIncorrectCardStackUpdate,
  handleNextCardButtonClick,
  handleCardClick,
  handleTopCardHeightChange,
  handleAIExplanationGenerated,
  completeAnswers,
  incompleteAnswers,
  isReadOnly,
} : IncorrectAnswerCardProps) {
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAIGeneratedLocal, setIsAIGeneratedLocal] = useState<boolean>(false);
  const [isAIRegenEnabled, setIsAIRegenEnabled] = useState(false);
  const [isCardClicked, setIsCardClicked] = useState<boolean>(false);
  const [cardData, setCardData] = useState<IncorrectCard>({
    id: answerData.id,
    answer: answerData.answer,
    explanation: answerData.explanation,
    isFirstEdit: answerData.isFirstEdit,
    isCardComplete: answerData.isCardComplete,
  });
  
  // inits the regenData with the current card's data
  const [regenData, setRegenData] = useState<RegenInput>({
    question: draftQuestion.questionCard.title,
    correctAnswer: draftQuestion.correctCard.answer,
    wrongAnswer: answerData.answer,
    incorrectMath: false,
    toneClarity: false,
    other: false,
    currentExplanation: '',
    currentPrompt: '',
  });
  
  const waegenInput: WaegenInput = {
    question: draftQuestion.questionCard.title,
    correctAnswer: draftQuestion.correctCard.answer,
    wrongAnswer: cardData.answer,
    discardedExplanations: JSON.stringify([cardData.explanation])
  };

  // tracks changes to card height so that other cards in the stack (in the parent component) can adjust their position accordingly
  useEffect(() => {
    if (!cardRef.current || !isTopCard) return undefined;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (handleTopCardHeightChange ) {
          handleTopCardHeightChange(entry.borderBoxSize[0].blockSize);
        }
      });
    });

    resizeObserver.observe(cardRef.current);
    if (handleTopCardHeightChange) {
      handleTopCardHeightChange(cardRef.current.getBoundingClientRect().height);
    }
    return () => {
        if (!resizeObserver) return;
        resizeObserver.disconnect();
    };
  }, [isTopCard, handleTopCardHeightChange])

  const debouncedCardChanges = useMemo(() => 
    debounce((debounceCardData: IncorrectCard, debouncedDraftQuestion: CentralQuestionTemplateInput, debounceCompleteAnswers: IncorrectCard[], debounceIncompleteAnswers: IncorrectCard[]) => {
      setIsCardClicked(false);
      handleIncorrectCardStackUpdate(debounceCardData, debouncedDraftQuestion, debounceCompleteAnswers, debounceIncompleteAnswers);
    }, 1000)
  , [handleIncorrectCardStackUpdate]);

  const handleLocalAnswerChange = (value: string) => {
    setCardData({
      ...cardData,
      answer: value,
    })
      debouncedCardChanges({...cardData, answer: value}, draftQuestion, completeAnswers, incompleteAnswers);
  }

  const handleLocalExplanationChange = (value: string) => {
    setCardData({
      ...cardData,
      explanation: value,
    })
      debouncedCardChanges({...cardData, explanation: value}, draftQuestion, completeAnswers, incompleteAnswers);
  }

  const handleAIExplanationChange = (value: string, isRegen?: boolean ) => {
    if (value === 'ERROR') {
      handleAIExplanationGenerated(false);
      return;
    }
    setCardData({
      ...cardData,
      explanation: value,
    });
    if (isRegen)
      setIsAIRegenEnabled(false);
    handleAIExplanationGenerated(true);
    setIsAIGeneratedLocal(true);
  }

  const handleLocalCardClick = () => {
    setIsCardClicked(true);
  }

  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
      <AnswerCard ref={cardRef} elevation={6} isHighlight={isHighlight ?? false} isCardComplete={answerData.isCardComplete} isCardClicked={isCardClicked} isAIEnabled={isAIEnabled} isAIExplanationGenerated={isAIGeneratedLocal} isAIRegenEnabled={isAIRegenEnabled} isTopCard={isTopCard ?? false} isClone={isClone} onClick={handleLocalCardClick}>
        <QuestionTitleStyled sx={{ color: "#47366C"}}>
          Incorrect Answer
        </QuestionTitleStyled>
        <TextContainerStyled 
        disabled={isReadOnly}
          multiline 
          variant="outlined" 
          rows='1'
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '43px',
              fontFamily: 'Rubik'
            },
         '& .MuiInputBase-input': {
              color: '#47366C',
              opacity: isCardSubmitted && cardData.explanation.length === 0 ? 1 : 0.5,
              '&::placeholder': {
                color: isCardSubmitted && cardData.explanation.length === 0 ? '#D0254D':'#47366C',
                opacity: isCardSubmitted && cardData.explanation.length === 0 ? 1 : 0.5
              },
              '&:focus': {
                color: '#47366C',
                opacity: 1,
              },
              '&:focus::placeholder': {
                color: '#47366C',
                opacity: 1,
              },
            },
        }} 
          placeholder="Enter Incorrect Answer..." 
          value={cardData.answer}
          onChange={(e) => handleLocalAnswerChange(e.target.value)}
          error={(isCardSubmitted || isAIError) && cardData.answer.length === 0}
          InputProps={{
            startAdornment: 
            (isCardSubmitted || isAIError) && cardData.answer.length === 0 &&
              <InputAdornment
                position="start" 
                sx={{ 
                  alignSelf: 'flex-start',
                  mt: '5px'
                }}
              >
                <ErrorIcon src={errorIcon} alt='error icon'/>
              </InputAdornment>
          }}
        />
        <Box style={{
          width: '100%',
          
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <QuestionTitleStyled sx={{ color: "#47366C"}}>
            Mistake Explanation
          </QuestionTitleStyled>
          { isAIEnabled &&
            <AIButton 
              apiClients={apiClients}
              waegenInput={waegenInput}
              type={AIButtonType.WAE_GEN}
              handleClickOutput={(output) => handleAIExplanationChange(output)}
            />
          }
        </Box>
        <TextContainerStyled
        disabled={isReadOnly} 
          multiline 
          variant="outlined"
          rows="4"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'Rubik',
            },
            '& .MuiInputBase-input': {
              color: '#47366C',
              opacity: isCardSubmitted && cardData.explanation.length === 0 ? 1 : 0.5,
              '&::placeholder': {
                color: isCardSubmitted && cardData.explanation.length === 0 ? '#D0254D':'#47366C',
                opacity: isCardSubmitted && cardData.explanation.length === 0 ? 1 : 0.5,
              },
              '&:focus': {
                color: '#47366C',
                opacity: 1,
              },
              '&:focus::placeholder': {
                color: '#47366C',
                opacity: 1,
              },
            },
          }}
          placeholder="Enter Explanation here..." 
          value={cardData.explanation}
          onChange={(e) => handleLocalExplanationChange(e.target.value)}
          error={isCardSubmitted && cardData.explanation.length === 0}
          isAIEnabled={isAIEnabled}
          InputProps={{
            startAdornment: 
              isCardSubmitted && cardData.explanation.length === 0 &&
              <InputAdornment
                position="start" 
                sx={{ 
                  alignSelf: 'flex-start',
                  mt: '10px'
                }}
              >
                <ErrorIcon src={errorIcon} alt='error icon'/>
              </InputAdornment>
          }}
        />
        { isAIRegenEnabled 
        ? <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            exit={{ 
              opacity: 0, 
              transition: { 
                duration: 0.6, 
                ease: 'easeInOut'
              } 
            }}
          >
            <RegenExplanationCard 
              setIsAIRegenEnabled={setIsAIRegenEnabled}
              question={draftQuestion.questionCard.title}
              correctAnswer={draftQuestion.correctCard.answer}
              wrongAnswer={cardData.answer}
              currentExplanation={cardData.explanation}
              handleAIExplanationChange={handleAIExplanationChange}
              apiClients={apiClients}
            />
          </motion.div>
        : <AnimatePresence>
              {isAIGeneratedLocal && isAIEnabled && isTopCard &&
                <>
                  <img
                    src={aiMonsterSpeech} 
                    alt='AI Monster Speech'
                    style={{height: '20px', width: '20px', marginTop: '-16px', marginBottom: '-16px', transform: 'translateX(20px)', zIndex: 10}}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <AIButton 
                      apiClients={apiClients}
                      waegenInput={waegenInput}
                      type={AIButtonType.WAE_REGEN}
                      handleAIEnabled={(output) => setIsAIRegenEnabled(output)}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, bottom: '-110px' }}
                    animate={{ opacity: 1, bottom: '-50px' }}
                    transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
                    style={{
                      position: 'absolute',
                      bottom: '-50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '160px',
                      height: 'auto',
                      objectFit: 'cover',
                      zIndex: 1,
                    }}
                  >
                    <img
                      src={aiMonster} 
                      alt='AI Monster'
                    />
                  </motion.div>
                </>
              }
            </AnimatePresence>
          }
          {
            (isTopCard && (isCardSubmitted || isAIError) && (cardData.explanation.length === 0 || cardData.answer.length === 0)) &&
            <ErrorBox/>
          }
      </AnswerCard>
      { isTopCard &&
        <Box
          style={{
            zIndex: 5,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CentralButton
            buttonType={ButtonType.NEXTCARD}
            isEnabled={incompleteAnswers.length > 0}
            onClick={() => handleNextCardButtonClick && handleNextCardButtonClick(cardData)}
          />
        </Box>
        
      }
    </Box>
  )
}
