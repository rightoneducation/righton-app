import React, {useState} from 'react';
import { Box, useTheme } from '@mui/material';
import { IExplanationToSave } from '../../lib/Models';
import { RegenerateTextFieldStyled } from '../../lib/styledcomponents/generator/StyledTextField';
import { ChipStyled } from '../../lib/styledcomponents/generator/StyledChip';
import { ButtonType } from '../styledbutton/ButtonModels';
import { 
  ButtonStyled, 
} from '../../lib/styledcomponents/generator/StyledButtons';
import { 
  DiscardTextStyled
} from '../../lib/styledcomponents/generator/StyledTypography';
import { IChipData } from '../../lib/Models';

interface RegenOptionsProps {
  index: number;
  explanation: IExplanationToSave;
  handleUpdateExplanation: (index: number, isEditMode: number, explanation: IExplanationToSave, discardedExplanation: IChipData | null, promptText?: string) => void;
}

export default function RegenOptions({
  index,
  explanation,
  handleUpdateExplanation
} : RegenOptionsProps) {
  const theme = useTheme();
  const [discardPromptText, setDiscardPromptText] = useState<string>('');
  const [selectedChips, setSelectedChips] = useState<IChipData>({
    incorrect: false,
    unclear: false,
    other: false
  });
  const buttonEnabled = selectedChips.incorrect || selectedChips.unclear || selectedChips.other;

  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <Box style={{display: 'flex', flexDirection: 'column', gap: '10px',paddingLeft: '20px', paddingRight: '20px'}}>
        <DiscardTextStyled style={{fontWeight: 600}}>
          Why do you wish to regenerate this explanation? 
        </DiscardTextStyled>
        <DiscardTextStyled>
          Select all that apply
        </DiscardTextStyled>
        <Box style={{display: 'flex', gap: 6}}>
          <ChipStyled label="Incorrect" isSelected={selectedChips.incorrect} onClick={() => 
            setSelectedChips((prev: IChipData) => ({
                ...prev,
                incorrect: !prev.incorrect 
              })
            )
          }/>
          <ChipStyled label="Unclear" isSelected={selectedChips.unclear} onClick={() => 
            setSelectedChips((prev: IChipData) => ({
                ...prev,
                unclear: !prev.unclear
              })
            )
          }/>
          <ChipStyled label="Other" isSelected={selectedChips.other} onClick={() => 
            setSelectedChips((prev: IChipData) => ({
                ...prev,
                other: !prev.other
              })
            )
          }/>
        </Box>
        <DiscardTextStyled style={{fontWeight: 600}}>
          Please provide additional information:
        </DiscardTextStyled>
        <RegenerateTextFieldStyled placeholder="Enter your reason here..." variant="outlined" style={{width: '100%'}} value={discardPromptText} onChange={(e) => setDiscardPromptText(e.target.value)} multiline={true} minRows={3} maxRows={3}/>
        <Box style={{display: 'flex', justifyContent: 'flex-end', gap: `${theme.sizing.xSmPadding}px`}}>
          <DiscardTextStyled>
            Optional
          </DiscardTextStyled>
        </Box>
      </Box>
      <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xSmPadding}px`}}>
        <ButtonStyled onClick={() => handleUpdateExplanation(index, 2, explanation, selectedChips, discardPromptText)} >
          Regenerate
        </ButtonStyled>
      </Box>
    </Box>
  )
}