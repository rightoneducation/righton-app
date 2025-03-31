

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme } from '@mui/material';
import { SavedModalTextStyled, HowToTitleStyled, HowToListItemStyled, HowToBulletItemStyled } from '../../lib/styledcomponents/generator/StyledTypography';
import { ButtonStyled, ButtonWrongAnswerStyled } from '../../lib/styledcomponents/generator/StyledButtons';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: '100%',
  top: '50%',
  transform: `translateY(-50%)`,
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

interface HowToModalProps {
  isModalOpen: boolean;
  setIsHowToModalOpen: (isOpen: boolean) => void;
  handleGenerateSample: () => void;
}

export default function HowtoModal({
  isModalOpen,
  setIsHowToModalOpen,
  handleGenerateSample
}: HowToModalProps) {
  const theme = useTheme();

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{width: '100%'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexDirection: 'column',
        }}> 
          <HowToTitleStyled style={{fontWeight: 700 }}> How to Use the </ HowToTitleStyled> 
          <HowToTitleStyled style={{fontWeight: 700, fontStyle: 'italic'}}> Wrong Answer Explanation Generator </HowToTitleStyled> 
        </Box>
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          flexDirection: 'column',
        }}>
          <HowToTitleStyled style={{fontWeight: 700 }}> About </ HowToTitleStyled> 
          <hr style={{backgroundColor: 'black', width: '100%', height: '1px'}}/>
          <HowToTitleStyled> The <b>Wrong Answer Explanation Generator </b> is a teaching tool used to generate possible explanations for wrong answers to a particular math question or problem.</ HowToTitleStyled> 
          <br />
          <HowToTitleStyled> These explanations can be used to help teachers gain further insight as to why students are giving a certain wrong answer.</ HowToTitleStyled> 
        </Box> 
        <Box style={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          flexDirection: 'column',
        }}>
          <HowToTitleStyled style={{fontWeight: 700 }}> Instructions </ HowToTitleStyled> 
          <hr style={{backgroundColor: 'black', width: '100%', height: '1px'}}/>
          <ol style={{ marginBlockStart: '0px', marginBlockEnd: '0px', paddingLeft: '22px' }}>
            <HowToListItemStyled>Enter the question or problem.</HowToListItemStyled>
            <HowToListItemStyled>Enter the correct answer to the question or problem.</HowToListItemStyled>
            <HowToListItemStyled>Enter the wrong answer you would like an explanation for.</HowToListItemStyled>
            <HowToListItemStyled>If you would like to add another wrong answer, click on <b>add a wrong answer</b>. Add as many wrong answers as you need.</HowToListItemStyled>
            <HowToListItemStyled>Click on <b>generate explanation(s)</b>. On the right side, a possible explanation as to how a learner may have arrived at the wrong answer will be generated. An explanation will be provided for each wrong answer you submit.</HowToListItemStyled>
          </ol>
          <br/>
          <HowToTitleStyled>From here, you can edit, regenerate, or save the explanation for your pedagogical purposes. </ HowToTitleStyled>
          <br/>
          <ul style={{ marginBlockStart: '0px', marginBlockEnd: '0px', paddingLeft: '22px', gap: '16px' }}>
            <HowToBulletItemStyled>You might <b>edit</b> the explanation if the generated explanation is generally helpful for you, but you need to modify it for certain reasons.</HowToBulletItemStyled>
            <HowToBulletItemStyled>You can choose to <b>regenerate</b> the explanation if the one provided does not meet your requirements (e.g., it’s incorrect, it isn’t useful for your context, etc.). In this case, providing a reason why the explanation was not useful will help us generate something more appropriate for your purposes. </HowToBulletItemStyled>
            <HowToBulletItemStyled><b>Save</b> the explanation once you are satisfied with the results for later use, e.g., lesson planning, creating assessments, etc.</HowToBulletItemStyled>
          </ul>
        </Box> 
        <Box style={{display: 'flex', width: '100%', gap: '8px'}}>
           
          <ButtonStyled onClick={() => setIsHowToModalOpen(false)}>
            Go to generator
          </ButtonStyled>
          <ButtonWrongAnswerStyled onClick={handleGenerateSample}>
            Generate a sample
          </ButtonWrongAnswerStyled>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
