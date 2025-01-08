import React, { useState, useMemo, useRef, useEffect} from 'react';
import { Paper, Box, styled, InputAdornment, useTheme } from '@mui/material';
import { debounce } from 'lodash';
import {AnimatePresence, motion} from 'framer-motion';
import { CentralQuestionTemplateInput, IncorrectCard, AIButton, IAPIClients, AIButtonType, WaegenInput } from '@righton/networking';
import { CreateQuestionHighlightCard, } from '../../../../lib/CentralModels';
import errorIcon from '../../../../images/errorIcon.svg';
import aiMonster from '../../../../images/aiMonster.svg';
import aiMonsterSpeech from '../../../../images/aiMonsterSpeech.svg';
import { ErrorIcon } from '../../../../lib/styledcomponents/CentralStyledComponents';
import {
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface StyledCardProps {
  isHighlight: boolean;
  isCardComplete: boolean;
  isCardClicked: boolean;
  isAIEnabled: boolean;
  isAIExplanationGenerated: boolean;
  isTopCard?: boolean;
}

const AnswerCard = styled(Paper)<StyledCardProps>(({ theme, isHighlight, isCardComplete, isCardClicked, isAIEnabled, isAIExplanationGenerated, isTopCard }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  paddingBottom: isAIEnabled && isAIExplanationGenerated && isTopCard ? '120px' : `${theme.sizing.mdPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: `10px`,
  boxShadow: isHighlight ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
  opacity: isCardComplete && !isCardClicked ? 0.6 : 1,
  transition: 'box-shadow 0.6s, opacity  0.6s, padding-bottom 0.6s',
  position: 'relative',
  overflow: 'hidden'
}));

interface IncorrectAnswerCardProps {
  apiClients: IAPIClients;
  answerData: IncorrectCard;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight?: boolean;
  isCardSubmitted: boolean;
  isAIEnabled: boolean;
  isTopCard?: boolean;
  handleIncorrectCardStackUpdate: (cardData: IncorrectCard, draftQuestion: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => void;
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  handleTopCardHeightChange?: (height: number) => void;
  handleAIExplanationGenerated: (isGenerated: boolean) => void;
  completeAnswers: IncorrectCard[];
  incompleteAnswers: IncorrectCard[];
}

export default function IncorrectAnswerCard({
  apiClients,
  answerData,
  draftQuestion,
  isHighlight,
  isCardSubmitted,
  isAIEnabled,
  isTopCard,
  handleIncorrectCardStackUpdate,
  handleCardClick,
  handleTopCardHeightChange,
  handleAIExplanationGenerated,
  completeAnswers,
  incompleteAnswers
} : IncorrectAnswerCardProps) {
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAIGeneratedLocal, setIsAIGeneratedLocal] = useState<boolean>(false);
  const [isCardClicked, setIsCardClicked] = useState<boolean>(false);
  const [cardData, setCardData] = useState<IncorrectCard>({
    id: answerData.id,
    answer: answerData.answer,
    explanation: answerData.explanation,
    isFirstEdit: answerData.isFirstEdit,
    isCardComplete: answerData.isCardComplete,
  });
  
  const waegenInput: WaegenInput = {
    question: draftQuestion.questionCard.title,
    correctAnswer: draftQuestion.correctCard.answer,
    wrongAnswer: cardData.answer,
    discardedExplanations: JSON.stringify([cardData.explanation])
  };

  const getCardType = () => {
    switch(answerData.id){
      case 'card-2':
        return CreateQuestionHighlightCard.INCORRECTANSWER2;
      case 'card-3':
        return CreateQuestionHighlightCard.INCORRECTANSWER3;
      case 'card-1':
      default:
        return CreateQuestionHighlightCard.INCORRECTANSWER1;
    }
  } 

  useEffect(() => {
    if (!cardRef.current || !isTopCard) return undefined;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (handleTopCardHeightChange) {
          handleTopCardHeightChange(entry.contentRect.height);
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

  const handleAIExplanationChange = (value: string ) => {
    setCardData({
      ...cardData,
      explanation: value,
    });
    handleAIExplanationGenerated(true);
    setIsAIGeneratedLocal(true);
  }

  const handleLocalCardClick = () => {
    setIsCardClicked(true);
    // handleCardClick(getCardType())
  }

  return (
    <AnswerCard elevation={6} isHighlight={isHighlight ?? false} isCardComplete={answerData.isCardComplete} isCardClicked={isCardClicked} isAIEnabled={isAIEnabled} isAIExplanationGenerated={isAIGeneratedLocal} isTopCard={isTopCard ?? false} onClick={handleLocalCardClick}>
      <QuestionTitleStyled>
        Incorrect Answer
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Distractor..." 
        value={cardData.answer}
        onChange={(e) => handleLocalAnswerChange(e.target.value)}
        error={isCardSubmitted && cardData.answer.length === 0}
        InputProps={{
          startAdornment: 
           isCardSubmitted && cardData.answer.length === 0 &&
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
      <Box style={{
        width: '100%',
        height: '38px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <QuestionTitleStyled>
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
        ref={cardRef}
        multiline 
        variant="outlined" 
        placeholder="Explanation..." 
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
      
      <AnimatePresence>
        {isAIGeneratedLocal && isAIEnabled && isTopCard &&
          <>
            <img
              src={aiMonsterSpeech} 
              alt='AI Monster Speech'
              style={{height: '20px', width: '20px', marginTop: '-16px', marginBottom: '-16px', transform: 'translateX(20px)', zIndex: 10}}
            />
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
    </AnswerCard>
  )
}
