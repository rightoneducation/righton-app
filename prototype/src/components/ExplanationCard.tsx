import React, {useEffect, useState} from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, RadioGroup, FormGroup, FormControl, FormControlLabel, Radio, Checkbox, Tooltip } from '@mui/material';
import AcceptAnswer from '../img/AcceptAnswer.svg';
import RegenAnswer from '../img/RegenAnswer.svg';
import RegenWithPromptAnswer from '../img/RegenWithPromptAnswer.svg';
import DiscardAnswer from '../img/DiscardAnswer.svg';
import ExplanationSaved from '../img/ExplanationSaved.svg';
import EditAnswer from '../img/EditAnswer.svg';
import {
  AnswerExplanationButtonStyled,
  PromptSubmitButtonStyled
} from '../lib/GamePlayButtonStyled';
import { ExplanationRegenType } from '../lib/Constants';
import { IQuestionToSave, IRegenInput } from '../lib/Models';
import { compareEditedExplanation } from '../lib/API';

interface Explanation {
  answer: string; 
  selectedExplanation: string; 
  dismissedExplanations: {
    explanation: string;
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
    isQuestionSaved
}: ExplanationCardProps) {

  const buttonStyle = {
    margin: '5px',
  };
  const cardStyle = (index: number, isSubmitted: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '300px',
    padding: '20px',
    transition: 'opacity 0.3s ease',
    borderRadius: '20px',
    borderThickness: '2px',
    borderStyle: 'solid',
    borderColor: 'white',
    opacity: selectedCards[index] || !isSubmitted ? 0.25 : 1, // Use the selected state of this specific card
    gap: '10px'
  });
  const [isPromptEnabled, setIsPromptEnabled] = useState<boolean>(false);
  const [isDiscardEnabled, setIsDiscardEnabled] = useState<boolean>(false);
  const [isRegenEnabled, setIsRegenEnabled] = useState<boolean>(false);
  const [regenPromptText, setRegenPromptText] = useState<string|null>(null);
  const [discardPromptText, setDiscardPromptText] = useState<string>('');
  const [discardOptions, setDiscardOptions] = useState<DiscardOptions>({incorrectMath: false, toneClarity: false, other: {isEnabled: false, text:''}});
  const [originalExplanation, setOriginalExplanation] = useState<string>('');
  const [regenType, setRegenType] = useState<ExplanationRegenType>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // editMode flips the explanation into a Textfield, so that a user can edit its contents
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableExplanation, setEditableExplanation] = useState(explanation.selectedExplanation);
  
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
  const packageRegenInputAndSubmit= (index: number, action: ExplanationRegenType, promptText?: string, discardedExplanation?: string) => {
    const inputToSend: IRegenInput = {
      question: questionToSave,
      action,
      index 
    }    
    switch (action){
      case ExplanationRegenType.ACCEPT:
        setOriginalExplanation(editableExplanation.length > 0 ? editableExplanation : originalExplanation);
        setIsSaved(true);
        break;
      case ExplanationRegenType.ACCEPT_EDITED:
        inputToSend.question.wrongAnswers[index].selectedExplanation = originalExplanation;
        inputToSend.question.wrongAnswers[index].editedExplanation = editableExplanation;
        compareEditedExplanation(originalExplanation, editableExplanation).then((response: any) => {
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
        if (discardPromptText !== null && discardPromptText !== undefined && discardPromptText !== '') {
          inputToSend.question.wrongAnswers[index].dismissedExplanations.push({explanation: explanation.selectedExplanation, prompt: discardPromptText})
          setQuestionToSave(inputToSend.question);
        }
        if (discardOptions.toneClarity)
          inputToSend.question.wrongAnswers[index].dismissedExplanations.push({explanation: explanation.selectedExplanation, prompt: "Adjust tone to match a middle school reading level"});
        if (discardOptions.incorrectMath)
          saveDiscardExplanation(questionToSave.question, explanation.selectedExplanation)
        break;
    }
    setRegenType(action);
    handleExplanationClick(inputToSend);
    setIsPromptEnabled(false);
    setIsDiscardEnabled(false);
    setRegenPromptText(null);
    setDiscardPromptText('');
  }

  return (
    <Box style={{position: 'relative'}}>
    <Card key={index} style={cardStyle(index, isSubmitted)}>
        <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', fontSize: '15px', lineHeight: '30px'}} >
        {!isSubmitted ? `Explanation for Wrong Answer ${index+1} will appear here` : `Wrong Answer Explanation ${index + 1}`}
        </Typography>
        { !isEditMode ? 
        <Typography style={{ fontFamily: 'Poppins', fontWeight: '200', fontSize: '15px', lineHeight: '18px'}} >
          {editableExplanation.length > 0 ? editableExplanation : explanation.selectedExplanation}
        </Typography>
        : 
        <TextField style={{width: '100%'}} value={editableExplanation} onChange={(e) => setEditableExplanation(e.target.value)} multiline={true} maxRows={5}/>
        }
        {isSubmitted && !isSaved && (
          <>
            <Box display="flex" justifyContent="center" >
              <Tooltip title="Accept Explanation" enterDelay={0} placement="top" arrow>
                <AnswerExplanationButtonStyled style={buttonStyle} onClick={() => packageRegenInputAndSubmit(index, isEditMode ? 1 : 0)} animate={false}>
                  <img src={AcceptAnswer} style={{width: '50px', height: '50px'}}/>
                </AnswerExplanationButtonStyled>    
              </Tooltip>
              <Tooltip title="Edit Explanation" enterDelay={0} placement="top" arrow>
                  <AnswerExplanationButtonStyled style={buttonStyle} onClick={() => {setOriginalExplanation(explanation.selectedExplanation); setEditableExplanation(explanation.selectedExplanation); setIsEditMode(!isEditMode); setIsRegenEnabled(false); setIsDiscardEnabled(false)}} animate={false}>
                    <img src={EditAnswer} style={{width: '30px', height: '30px'}}/>
                  </AnswerExplanationButtonStyled> 
                </Tooltip>   
              { !isEditMode &&
                <>
                  <Tooltip title="Regenerate Explanation" enterDelay={0} placement="top" arrow>
                    <AnswerExplanationButtonStyled style={buttonStyle} onClick={() => {setIsRegenEnabled(true); setIsDiscardEnabled(false); setIsEditMode(false)}} animate={false}>
                      <img src={RegenAnswer} style={{width: '40px', height: '40px'}}/>
                    </AnswerExplanationButtonStyled>  
                  </Tooltip>
                </>
              }
              <Tooltip title="Reject Explanation" enterDelay={0} placement="top" arrow>
                <AnswerExplanationButtonStyled style={buttonStyle} onClick={() => {setIsDiscardEnabled(true); setIsRegenEnabled(false); setIsEditMode(false)}} animate={false}>
                  <img src={DiscardAnswer} style={{width: '50px', height: '50px'}}/>
                </AnswerExplanationButtonStyled>
              </Tooltip>
            </Box>
            { isRegenEnabled && (
              <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Box style={{width: '100%'}}>
                <Typography style={{ fontFamily: 'Montserrat',  fontWeight: '700', fontSize: '12px', lineHeight: '20px', textAlign: 'left'}} >
                  Why are you regenerating this explanation?
                </Typography>
              </Box>
              <TextField style={{width: '100%'}} value={discardPromptText} onChange={(e) =>  {setDiscardOptions((prev) => ({
                      ...prev,
                      other: {
                        ...prev.other,
                        text: e.target.value,
                      },
                    }));
                    setDiscardPromptText(e.target.value);
                  }
                } 
                multiline={true} minRows={2} maxRows={2}/>
              <PromptSubmitButtonStyled title="Submit" style={buttonStyle} onClick={() => packageRegenInputAndSubmit(index, 2, regenPromptText ?? '', discardPromptText ?? '')} animate={false}>
                Submit
              </PromptSubmitButtonStyled>
              </Box>
            )}
            { isDiscardEnabled && (
                <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Box style={{width: '100%'}}>
                    <Typography style={{ fontFamily: 'Montserrat',  fontWeight: '700', fontSize: '12px', lineHeight: '20px', textAlign: 'left'}} >
                      Why are you discarding this explanation?
                    </Typography>
                  </Box>
                  <FormControl
                    component="fieldset"
                    variant="standard"
                    sx={{display: 'inline', width: '100%', textAlign: 'left', paddingLeft: '32px'}}
                  >
                    <FormControlLabel value="0" control={<Checkbox checked={discardOptions.incorrectMath} onChange={handleCheckboxChange} name="incorrectMath"/>} label={ 
                      <Typography style={{ fontFamily: 'Montserrat',fontSize: '12px', lineHeight: '20px', textAlign: 'left'}} >
                        Incorrect Math
                      </Typography>
                    } />
                    <FormControlLabel value="1" control={<Checkbox checked={discardOptions.toneClarity} onChange={handleCheckboxChange} name="toneClarity"/>} label={ 
                      <Typography style={{ fontFamily: 'Montserrat',fontSize: '12px', lineHeight: '20px', textAlign: 'left'}} >
                        Tone/Clarity
                      </Typography>
                    } />
                    <FormControlLabel value="2" control={<Checkbox checked={discardOptions.other.isEnabled} onChange={handleCheckboxChange} name="other"/>} label={ 
                      <Typography style={{ fontFamily: 'Montserrat',fontSize: '12px', lineHeight: '20px', textAlign: 'left'}} >
                        Other
                      </Typography>
                    } />
                  </FormControl>
                  { discardOptions.other &&
                    <TextField style={{width: '100%'}} value={discardPromptText} onChange={(e) =>  {setDiscardOptions((prev) => ({
                          ...prev,
                          other: {
                            ...prev.other,
                            text: e.target.value,
                          },
                        }));
                        setDiscardPromptText(e.target.value);
                      }
                    } 
                    multiline={true} minRows={2} maxRows={2}/>
                  }
                  <PromptSubmitButtonStyled title="Submit" style={buttonStyle} onClick={() => packageRegenInputAndSubmit(index, 2, regenPromptText ?? '', discardPromptText ?? '')} animate={false}>
                    Submit
                  </PromptSubmitButtonStyled>
                </Box>
              )}
          </>
        )}
    </Card>
    {selectedCards[index] && (
      <Box style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        {!isQuestionSaved && (
        (regenType === 0 || regenType === 1) ? 
          <>
            <Typography style={{  fontWeight: '800', fontSize: '16px', color: 'white', marginTop: '20px'}} >
              Saved!
            </Typography>
            <img src={ExplanationSaved} style={{width: '50px', height: '50px'}}/>
          </>
          :
          <>
            <Typography style={{  fontWeight: '800', fontSize: '14px', color: 'white', marginTop: '20px'}} >
              Regenerating Explanation...
            </Typography>
            <CircularProgress style={{color:'#159EFA'}}/>
          </>
        
        )}
      </Box>
    )}
  </Box>
  )
}