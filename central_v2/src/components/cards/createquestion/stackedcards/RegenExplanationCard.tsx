import React from 'react';
import { Box, Typography, Checkbox, FormControl, FormControlLabel, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { AIButton, AIButtonType, WaegenInput, IAPIClients, RegenInput } from '@righton/networking';
import { RegenTextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { RegenExplanationStyledCard } from '../../../../lib/styledcomponents/RegenExplanationStyledCard';
import closeX from '../../../../images/closeX.svg';
import aiMonsterRegen from '../../../../images/aiMonsterRegen.svg';

interface RegenExplanationCardProps {
  setIsAIRegenEnabled: (isAIRegenEnabled: boolean) => void;
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
  currentExplanation: string;
  handleAIExplanationChange: (output: string, isRegen?: boolean) => void;
  apiClients: IAPIClients;
}

export default function RegenExplanationCard({
  setIsAIRegenEnabled,
  question,
  correctAnswer,
  wrongAnswer,
  currentExplanation,
  handleAIExplanationChange,
  apiClients
}: RegenExplanationCardProps) {
  const theme = useTheme();
  const [regenData, setRegenData] = React.useState<RegenInput>({
    question,
    correctAnswer,
    wrongAnswer,
    currentExplanation,
    incorrectMath: false,
    toneClarity: false,
    other: false,
    currentPrompt: ''
  });

  const handleAIRegenCheckboxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxValue = Number(e.target.value);
    const isChecked = e.target.checked;

    switch(checkboxValue){
      case(1):
        setRegenData({
          ...regenData,
          toneClarity: isChecked,
        });
        break;
      case(2):
        setRegenData({
          ...regenData,
          other: isChecked,
        });
        break;
      case(0):
      default:
        setRegenData({
          ...regenData,
          incorrectMath: isChecked,
        });
        break;
    }
  }
  
  return (
    <RegenExplanationStyledCard>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.xSmPadding}px`,
        }}
      >
        <Box 
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='body1' style={{color: '#FFFFFF', fontWeight: '600'}}>
            What can I improve in my explanation?
          </Typography>
      
          <Box onClick={() => setIsAIRegenEnabled(false)} style={{cursor: 'pointer'}}>
            <img src={closeX} alt='close' />
          </Box>
        </Box>
        <FormControl
          component="fieldset"
          variant="standard"
          sx={{display: 'inline', width: '100%', textAlign: 'left'}}
        >
          <FormControlLabel 
            value="0" 
            control={
              <Checkbox 
                checked={regenData.incorrectMath} 
                onChange={handleAIRegenCheckboxesChange} 
                name="incorrectMath"
                style={{color: '#FFF', paddingRight: '0px', paddingTop: `${theme.sizing.xxSmPadding}px`, paddingBottom: `${theme.sizing.xxSmPadding}px`}}
              />
            } 
            label={ 
              <Typography style={{ fontSize: '16px',textAlign: 'left', color: '#FFF'}} >
                Incorrect Math
              </Typography>
            } 
          />
          <FormControlLabel 
            value="1" 
            control={
              <Checkbox 
                checked={regenData.toneClarity} 
                onChange={handleAIRegenCheckboxesChange} 
                name="toneclarity"
                style={{color: '#FFF', paddingRight: '0px', paddingTop: `${theme.sizing.xxSmPadding}px`, paddingBottom: `${theme.sizing.xxSmPadding}px`}}
              />
            } 
            label={ 
              <Typography style={{ fontSize: '16px',textAlign: 'left', color: '#FFF'}} >
                Tone/Clarity
              </Typography>
            } 
          />
          <FormControlLabel 
            value="2" 
            control={
              <Checkbox 
                checked={regenData.other} 
                onChange={handleAIRegenCheckboxesChange} 
                name="other"
                style={{color: '#FFF', paddingRight: '0px', paddingTop: `${theme.sizing.xxSmPadding}px`, paddingBottom: `${theme.sizing.xxSmPadding}px`}}
              />
            } 
            label={ 
              <Typography style={{ fontSize: '16px',textAlign: 'left', color: '#FFF'}} >
                Other
              </Typography>
            } 
          />
        </FormControl>
      </Box>
      <Typography variant='body1' style={{color: '#FFFFFF', fontWeight: '600'}}>
          Would you like to elaborate?
      </Typography>
      <RegenTextContainerStyled 
        multiline 
        variant="outlined" 
        placeholder="Explanation..." 
        value={regenData.currentPrompt}
        onChange={(e) => setRegenData({...regenData, currentPrompt: e.target.value})}
      />
      <Box
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2
        }}
      > 
        <AIButton 
          apiClients={apiClients}
          regenInput={regenData}
          type={AIButtonType.WAE_REGENSUBMIT}
          handleClickOutput={(output) => handleAIExplanationChange(output, true)}
        />
      </Box>
      <motion.div
        initial={{ opacity: 0, bottom: '-50px' }}
        animate={{ opacity: 1, bottom: '0px' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '0px',
          objectFit: 'cover',
          zIndex: 1,
          overflow: 'hidden',
          marginLeft: '-10px',
          marginBottom: '-3px'
        }}
      >
        <img
          src={aiMonsterRegen} 
          alt='AI Monster'
        />
      </motion.div>
  </RegenExplanationStyledCard>
  );
}