import React, {useState} from 'react';
import { Box, useTheme } from '@mui/material';
import CentralButton from '../styledbutton/Button';
import { TextFieldStyled } from '../../lib/styledcomponents/generator/StyledTextField';
import { ChipStyled } from '../../lib/styledcomponents/generator/StyledChip';
import { ButtonType } from '../styledbutton/ButtonModels';
import { 
  DiscardTextStyled
} from '../../lib/styledcomponents/generator/StyledTypography';
import { IChipData } from '../../lib/Models';

interface DiscardOptionsProps {
  index: number;
  packageRegenInputAndSubmit: (index: number, isEditMode: number, discardedExplanation: IChipData | null, promptText?: string) => void;
}

export default function DiscardOptions({
  index,
  packageRegenInputAndSubmit
} : DiscardOptionsProps) {
  const theme = useTheme();
  const [discardPromptText, setDiscardPromptText] = useState<string>('');
  const [selectedChips, setSelectedChips] = useState<IChipData>({
    incorrect: false,
    unclear: false,
    other: false
  });
  const buttonEnabled = selectedChips.incorrect || selectedChips.unclear || selectedChips.other;

  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <DiscardTextStyled style={{fontWeight: 600}}>
        Why do you wish to discard this explanation? 
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
      <TextFieldStyled placeholder="Enter your reason here..." variant="outlined" style={{width: '100%'}} value={discardPromptText} onChange={(e) => setDiscardPromptText(e.target.value)} multiline={true} minRows={5}/>
      <Box style={{display: 'flex', justifyContent: 'flex-end', gap: `${theme.sizing.xSmPadding}px`}}>
        <DiscardTextStyled>
          Optional
        </DiscardTextStyled>
      </Box>
      <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xSmPadding}px`}}>
        <CentralButton buttonType={ButtonType.DISCARD} isEnabled={buttonEnabled} smallScreenOverride buttonWidthOverride='160px' onClick={() => packageRegenInputAndSubmit(index, 2, selectedChips, discardPromptText)}/>                
      </Box>
    </Box>
  )
}