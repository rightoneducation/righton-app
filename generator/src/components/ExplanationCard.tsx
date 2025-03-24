import React, {useEffect, useState} from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, RadioGroup, FormGroup, FormControl, FormControlLabel, Radio, Checkbox, Tooltip, useTheme } from '@mui/material';
import AcceptAnswer from '../img/AcceptAnswer.svg';
import RegenAnswer from '../img/RegenAnswer.svg';
import RegenArrow from '../img/RegenArrow.svg';
import DiscardAnswer from '../img/DiscardAnswer.svg';
import AcceptIcon from '../img/AcceptIcon.svg';
import RejectIcon from '../img/RejectIcon.svg';
import { 
  CardHeaderTextStyled, 
  EditTextStyled,
  ExplanationTextStyled,
  ButtonSubtextStyled,
  SavedTextStyled,
  FooterBoldStyled,
  DiscardTextStyled
} from '../lib/styledcomponents/generator/StyledTypography';
import EditAnswer from '../img/EditAnswer.svg';
import {
  
} from '../lib/GamePlayButtonStyled';
import { 
  ButtonStyled, 
  ButtonWrongAnswerStyled
} from '../lib/styledcomponents/generator/StyledButtons';
import {
  ExplanationCardStyled,
  ExplanationCardContentStyled
} from '../lib/styledcomponents/generator/StyledCards';
import { SingleExplanationCardContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { TextFieldStyled } from '../lib/styledcomponents/generator/StyledTextField';
import { ExplanationRegenType } from '../lib/Constants';
import { IQuestionToSave, IRegenInput, IChipData } from '../lib/Models';
import { compareEditedExplanation } from '../lib/API';
import DiscardOptions from './discard/DiscardOptions';

interface Explanation {
  answer: string; 
  selectedExplanation: string; 
  editedExplanation?: string;
  dismissedExplanations: {
    explanation: IChipData | null;
    prompt?: string;
  }[]
}

interface ExplanationCardProps {
  index: number;
  questionToSave: IQuestionToSave
  isSubmitted: boolean;
  explanation: Explanation;
  selectedCards: boolean[];
  setQuestionToSave: (questionToSave: IQuestionToSave) => void;
  handleExplanationClick: (input: IRegenInput) => void;
  saveDiscardExplanation: (
    question: string, selectedExplanation: string
  ) => void;
  isQuestionSaved: boolean;
  isRegenerating: boolean;
}

interface DiscardOptions {
  incorrectMath: boolean;
  toneClarity: boolean;
  other: {
    isEnabled: boolean;
    text: string;
  };
}

enum DiscardOptionsEnum {
  incorrectMath = 0,
  toneClarity = 1,
  other = 2
}

export default function ExplanationCard(
  { 
    index, 
    questionToSave,
    isSubmitted, 
    explanation, 
    selectedCards,
    setQuestionToSave,
    handleExplanationClick,
    saveDiscardExplanation,
    isQuestionSaved,
    isRegenerating
}: ExplanationCardProps) {
  const theme = useTheme();
  const buttonStyle = {
    margin: '5px',
  };
  const [isPromptEnabled, setIsPromptEnabled] = useState<boolean>(false);
  const [isDiscardEnabled, setIsDiscardEnabled] = useState<boolean>(false);
  const [isRegenEnabled, setIsRegenEnabled] = useState<boolean>(false);
  const [regenPromptText, setRegenPromptText] = useState<string|null>(null);
  const [discardPromptText, setDiscardPromptText] = useState<string>('');
  const [discardOptions, setDiscardOptions] = useState<DiscardOptions>({incorrectMath: false, toneClarity: false, other: {isEnabled: false, text:''}});
  const [regenType, setRegenType] = useState<ExplanationRegenType>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDiscarded, setIsDiscarded] = useState<boolean>(false);

  // editMode flips the explanation into a Textfield, so that a user can edit its contents
  const [isEditMode, setIsEditMode] = useState(false);
  // local state to store edited explanation
  const [editableExplanation, setEditableExplanation] = useState(explanation.editedExplanation ? explanation.editedExplanation : '');

  useEffect(() => {
      if (isQuestionSaved) {
        setIsSaved(false);
      }
  }, [isQuestionSaved]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxValue = Number(e.target.value);
    const isChecked = e.target.checked;
  
    switch (checkboxValue) {
      case DiscardOptionsEnum.incorrectMath:
        setDiscardOptions((prev) => ({
          ...prev,
          incorrectMath: isChecked,
        }));
        break;
      case DiscardOptionsEnum.toneClarity:
        setDiscardOptions((prev) => ({
          ...prev,
          toneClarity: isChecked,
        }));
        break;
      case DiscardOptionsEnum.other:
        setDiscardOptions((prev) => ({
          ...prev,
          other: {
            ...prev.other,
            isEnabled: isChecked,
            text: isChecked ? discardPromptText : ''
          },
        }));
        break;
      default:
        console.warn('Unknown discard option');
    }
    if (checkboxValue === DiscardOptionsEnum.other && !isChecked) {
      setDiscardPromptText('');
    }
  }

  // answer: string; selectedExplanation: string; dismissedExplanations: string[]
  const packageRegenInputAndSubmit= (index: number, action: ExplanationRegenType, discardedExplanation: IChipData | null, promptText?: string) => {
    const inputToSend: IRegenInput = {
      question: questionToSave,
      action,
      index 
    }    
    switch (action){
      case ExplanationRegenType.ACCEPT:
        setIsSaved(true);
        break;
      case ExplanationRegenType.ACCEPT_EDITED:
        inputToSend.question.wrongAnswers[index].selectedExplanation = explanation.selectedExplanation;
        inputToSend.question.wrongAnswers[index].editedExplanation = editableExplanation;
        compareEditedExplanation(explanation.selectedExplanation, editableExplanation).then((response: any) => {
          console.log(response);
          inputToSend.question.wrongAnswers[index].editedReason = response.content;
        }).then(() => {
          console.log(inputToSend);
          setQuestionToSave(inputToSend.question);
          setIsEditMode(false);
          setIsSaved(true);
        });
        break;
      case ExplanationRegenType.DISCARD:
        setIsDiscarded(true);
        inputToSend.question.wrongAnswers[index].dismissedExplanations.push({explanation: discardedExplanation, prompt: promptText})
        setQuestionToSave(inputToSend.question);
        break;
      case ExplanationRegenType.REGEN:
        inputToSend.question.wrongAnswers[index].dismissedExplanations.push({explanation: null, prompt: ''})
        setQuestionToSave(inputToSend.question);
        break;
    }
    setRegenType(action);
    handleExplanationClick(inputToSend);
    setIsPromptEnabled(false);
    setIsDiscardEnabled(false);
    setRegenPromptText(null);
    setDiscardPromptText('');
  }
  const handleEditModeClick = () => {
    setEditableExplanation(explanation.editedExplanation ? explanation.editedExplanation : explanation.selectedExplanation);
    setIsEditMode(true);
  }
  const handleEditSave = () => {
    const inputQuestion = JSON.parse(JSON.stringify(questionToSave));
    inputQuestion.wrongAnswers[index].editedExplanation = editableExplanation;
    setQuestionToSave(inputQuestion);
    setIsEditMode(false);
  }
  const handleEditDiscard = () => {
    setEditableExplanation(explanation.editedExplanation ? explanation.editedExplanation : explanation.selectedExplanation);
    setIsEditMode(false);
  }

  return (
    <SingleExplanationCardContainer style={{position: 'relative', width: '100%'}}>
      { isSaved &&
        <Box style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          opacity: 1,
          zIndex: 5
        }}>
        <SavedTextStyled> Saved! </SavedTextStyled>
        </Box>
      }
      { isRegenerating && 
        <Box style={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 1,
          zIndex: 15,
          background:  '#cccccc',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CircularProgress style={{color: "#000"}}/>
        </Box>
      }
      <ExplanationCardStyled key={index} isSaved={isSaved}>
        { isDiscarded 
        ? <Box style={{width: '100%', display: 'flex', justifyContent: 'center'}}> 
            <CardHeaderTextStyled> Thanks for your feedback! </CardHeaderTextStyled>
          </Box>
        : <>
            <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              <CardHeaderTextStyled>
                Explanation for Wrong Answer #{index + 1}
              </CardHeaderTextStyled>
              { !isEditMode &&
                <Box style={{display: 'flex', gap: `${theme.sizing.xSmPadding}px`}}>
                  <EditTextStyled onClick={handleEditModeClick}>
                    Edit
                  </EditTextStyled>
                  <img src={RegenArrow} alt="Regen Explanation" style={{cursor: 'pointer', height: '20px', width: 'auto'}} onClick={() => packageRegenInputAndSubmit(index, 3,  null)}/>
                </Box>
              }
            </Box>
            { !isEditMode ? 
              <>
                <ExplanationTextStyled>
                  {editableExplanation.length > 0 ? editableExplanation : explanation.selectedExplanation}
                </ExplanationTextStyled>
                {isDiscardEnabled &&
                  <DiscardOptions index={index} packageRegenInputAndSubmit={packageRegenInputAndSubmit}/>
                }
              </>
              : 
              <>
                <TextField style={{width: '100%'}} value={editableExplanation} onChange={(e) => setEditableExplanation(e.target.value)} multiline={true} maxRows={5}/>
                <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xSmPadding}px`}}>
                  <FooterBoldStyled style={{cursor: 'pointer'}} onClick={handleEditSave}>
                    Save
                  </FooterBoldStyled>
                  <FooterBoldStyled>
                    |
                  </FooterBoldStyled>
                  <FooterBoldStyled style={{cursor: 'pointer'}} onClick={handleEditDiscard}>
                    Discard
                  </FooterBoldStyled>
                </Box>
              </>
            }
        </>
      }
    </ExplanationCardStyled>
    <Grid container spacing='8px'>
      <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <ButtonWrongAnswerStyled disabled={isDiscardEnabled} onClick={() => packageRegenInputAndSubmit(index, isEditMode ? 1 : 0, null)}>
          Edit
        </ButtonWrongAnswerStyled>
      </Grid>
      <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <ButtonWrongAnswerStyled disabled={isDiscardEnabled} onClick={() => packageRegenInputAndSubmit(index, isEditMode ? 1 : 0, null)}>
          Regenerate
        </ButtonWrongAnswerStyled>
      </Grid>
      <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <ButtonStyled onClick={() => {setIsDiscardEnabled(true); setIsRegenEnabled(false); setIsEditMode(false)}}>
          Save
        </ButtonStyled>
      </Grid>
    </Grid>
  </SingleExplanationCardContainer>
  )
}