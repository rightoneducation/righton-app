

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme } from '@mui/material';
import { SavedModalTextStyled, HowToTitleStyled, HowToListItemStyled, HowToBulletItemStyled } from '../lib/styledcomponents/generator/StyledTypography';
import { ButtonStyled, ButtonWrongAnswerStyled } from '../lib/styledcomponents/generator/StyledButtons';
import { IExplanationToSave, ILocalExplanation } from '../lib/Models';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  width: '100%',
  maxWidth: '560px',
  height: 'auto',
  maxHeight: '100%',
  background: '#FFF',
  padding: '22px',
  zIndex: 7,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box'
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface SavedExplanationCardProps {
  explanation: ILocalExplanation;
  handleDiscardSavedExplanation: (explanation: IExplanationToSave) => void;
}

export default function SavedExplanationCard({
  explanation,
  handleDiscardSavedExplanation
}: SavedExplanationCardProps) {
  const theme = useTheme();

  const month = explanation.date.slice(5, 7);
  const day = explanation.date.slice(8, 10);
  const year = explanation.date.slice(2, 4);
  const formattedDate = `${month}/${day}/${year}`;

  return (
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'space-between', 
          paddingBottom: '8px'
        }}> 
          <HowToTitleStyled style={{fontWeight: 700 }}> Subject </ HowToTitleStyled> 
          <HowToTitleStyled> {formattedDate} </HowToTitleStyled> 
        </Box>
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          flexDirection: 'column',
          paddingBottom: '8px'
        }}>
          <HowToTitleStyled style={{fontWeight: 700 }}> Question </ HowToTitleStyled> 
          <hr style={{backgroundColor: 'black', width: '100%', height: '1px'}}/>
          <Box style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <HowToTitleStyled> {explanation.question}</ HowToTitleStyled> 
            <HowToTitleStyled> <b> Correct Answer </b> {explanation.correctAnswer}</ HowToTitleStyled> 
          </Box>
        </Box> 
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          flexDirection: 'column',
        }}>
          <HowToTitleStyled style={{fontWeight: 700 }}> Wrong Answer Explanation </ HowToTitleStyled> 
          <hr style={{backgroundColor: 'black', width: '100%', height: '1px'}}/>
          <Box style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <HowToTitleStyled> <b> Wrong Answer </b> {explanation.wrongAnswer}</ HowToTitleStyled> 
            <HowToTitleStyled> <b> Explanation: </b> {explanation.genExplanation.explanation}</ HowToTitleStyled> 
          </Box>
        </Box> 
        <Box style={{display: 'flex', width: '100%', gap: '8px'}}>
           
          <ButtonStyled>
            View
          </ButtonStyled>
          <ButtonWrongAnswerStyled onClick={()=>handleDiscardSavedExplanation(explanation)}>
            Discard
          </ButtonWrongAnswerStyled>
        </Box>
      </IntegratedContainer>      
  );
}
