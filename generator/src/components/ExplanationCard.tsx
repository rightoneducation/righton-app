import React, {useEffect, useState} from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, RadioGroup, FormGroup, FormControl, FormControlLabel, Radio, Checkbox, Tooltip, useTheme } from '@mui/material';
import { 
  CardHeaderTextStyled, 
  EditTextStyled,
  ExplanationTextStyled,
  ButtonSubtextStyled,
  SavedTextStyled,
  EditStatusTextStyled,
  FooterBoldStyled,
  DiscardTextStyled
} from '../lib/styledcomponents/generator/StyledTypography';
import { EditExplanationStyledTextField } from '../lib/styledcomponents/generator/StyledTextField';
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
import { IExplanationToSave, IRegenInput, IChipData } from '../lib/Models';
import { compareEditedExplanation } from '../lib/API';
import RegenOptions from './regen/RegenOptions';

interface ExplanationCardProps {
  index: number;
  isSubmitted: boolean;
  explanation: IExplanationToSave;
  selectedCards: boolean[];
  handleSaveExplanations: (explanation: IExplanationToSave) => void;
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
    isSubmitted, 
    explanation, 
    selectedCards,
    handleSaveExplanations,
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
  const [editableExplanation, setEditableExplanation] = useState(explanation.genExplanation.editedExplanation ? explanation.genExplanation.editedExplanation : '');
  const firstLineText = editableExplanation.length > 0 ? editableExplanation.split('.')[0] : explanation.genExplanation.explanation.split('.')[0];
  const remainingText = editableExplanation.length > 0 ? editableExplanation.split('.').slice(1).join('.') : explanation.genExplanation.explanation.split('.').slice(1).join('.');

  useEffect(() => {
      if (isQuestionSaved) {
        setIsSaved(false);
      }
  }, [isQuestionSaved]);

  // answer: string; selectedExplanation: string; dismissedExplanations: string[]
  const handleUpdateExplanation = (index: number, action: ExplanationRegenType, explanation: IExplanationToSave, discardedExplanation: IChipData | null, promptText?: string) => {
    const explanationCopy = {...explanation};
    switch (action){
      case ExplanationRegenType.ACCEPT_EDITED:        
        compareEditedExplanation(explanation.genExplanation.explanation, editableExplanation).then((response: any) => {
          explanationCopy.genExplanation.editedExplanation = editableExplanation;
          if (!explanationCopy.genExplanation.regenExplanations) 
            explanationCopy.genExplanation.regenExplanations = [];
          explanationCopy.genExplanation.regenExplanations.push({reason: discardedExplanation, prompt: promptText});
          handleExplanationClick({explanation, action, index});
        }).then(() => {
          handleSaveExplanations(explanationCopy);
          setIsEditMode(false);
          setIsSaved(true);
        });
        break;
      case ExplanationRegenType.REGEN:
        // handle Regen
        // inputToSend.question.wrongAnswers[index].dismissedExplanations.push({explanation: null, prompt: ''})
        // setQuestionToSave(inputToSend.question);
        break;
    }
    setRegenType(action);
    setIsPromptEnabled(false);
    setIsRegenEnabled(false);
    setRegenPromptText(null);
    setDiscardPromptText('');
  }

  const handleEditModeClick = () => {
    setEditableExplanation(editableExplanation.length > 0 ? editableExplanation : explanation.genExplanation.explanation);
    setIsEditMode(true);
  }

  return (
    <SingleExplanationCardContainer 
      style={{
        position: 'relative',
        width: '100%'
      }} 
      sx={{
        gap: (editableExplanation.length > 0 && !isEditMode && !isRegenEnabled) 
        ? `${theme.sizing.smPadding}px` 
        : `${theme.sizing.mdPadding}px`
      }}
    >
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
            </Box>
            { !isEditMode ? 
              <>
                <ExplanationTextStyled>
                  {firstLineText}
                </ExplanationTextStyled>
                <ExplanationTextStyled>
                  {remainingText}
                </ExplanationTextStyled>
              </>
              : 
              <>
                <EditExplanationStyledTextField 
                  value={editableExplanation} 
                  onChange={(e) => setEditableExplanation(e.target.value)} 
                  multiline={true} 
                  maxRows={5}
                />
              </>
            }
        </>
      }
    </ExplanationCardStyled>
    { isRegenEnabled  
      ? <RegenOptions index={index} explanation={explanation} handleUpdateExplanation={handleUpdateExplanation}/>
      : !isSaved && (
        <> 
          { editableExplanation.length > 0 && !isEditMode &&
            <EditStatusTextStyled>
              Your edits have been updated.
            </EditStatusTextStyled>
          }
          <Grid container spacing='8px'>
          { !isEditMode ? 
            <>
            <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <ButtonWrongAnswerStyled onClick={handleEditModeClick} style={{fontWeight: 400}}>
                Edit
              </ButtonWrongAnswerStyled>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <ButtonWrongAnswerStyled disabled={isRegenEnabled} onClick={() => setIsRegenEnabled(true)} style={{fontWeight: 400}}>
                Regenerate
              </ButtonWrongAnswerStyled>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <ButtonStyled onClick={() => {handleSaveExplanations(explanation)}} style={{fontWeight: 400}}>
                Save
              </ButtonStyled>
            </Grid>
            </>
          : 
            <Grid item xs={12} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <ButtonStyled onClick={() => setIsEditMode(false)} >
                Update
              </ButtonStyled>
            </Grid>
          }
          </Grid>
        </>
      )
    }
  </SingleExplanationCardContainer>
  )
}