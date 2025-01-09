import React from 'react';
import { Box, Typography, Checkbox, FormControl, FormControlLabel, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { AIButton, AIButtonType, WaegenInput, IAPIClients } from '@righton/networking';
import { RegenTextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { RegenData } from '../../../../lib/CentralModels';
import closeX from '../../../../images/closeX.svg';
import aiMonsterRegen from '../../../../images/aiMonsterRegen.svg';

interface RegenExplanationCardProps {
  setIsAIRegenEnabled: (isAIRegenEnabled: boolean) => void;
  regenData: RegenData;
  setRegenData: (regenData: RegenData) => void;
  isCardSubmitted: boolean;
  handleAIRegenCheckboxesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAIExplanationChange: (output: string) => void;
  apiClients: IAPIClients;
  waegenInput: WaegenInput;
}

export default function RegenExplanationCard({
  setIsAIRegenEnabled,
  regenData,
  setRegenData,
  isCardSubmitted,
  handleAIRegenCheckboxesChange,
  handleAIExplanationChange,
  apiClients,
  waegenInput
}: RegenExplanationCardProps) {
  const theme = useTheme();
  return (
    <Box
    style={{
      background: `${theme.palette.primary.aiGradient}`,
      width: '100%',
      paddingTop: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '12px',
      borderRadius: `${theme.sizing.xxSmPadding}px`,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: `${theme.sizing.smPadding}px`,
      position: 'relative'
    }}
  >
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
      value={regenData.explanation}
      onChange={(e) => setRegenData({...regenData, explanation: e.target.value})}
      error={isCardSubmitted && regenData.explanation.length === 0}
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
        waegenInput={waegenInput}
        type={AIButtonType.WAE_REGENSUBMIT}
        handleClickOutput={(output) => handleAIExplanationChange(output)}
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
  </Box>
  );
}