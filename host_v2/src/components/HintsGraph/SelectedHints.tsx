import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import ArrowIcon from '../../images/Arrow.svg';

const SelectedHintsContainer = styled(Box)({
  textAlign: 'center',
  width: '100%',
  maxWidth: '500px',
});

const TitleText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: 700,
  paddingTop: '16px',
});

const StyledRect = styled(Box)({
  width: '100%',
  color: 'white',
  backgroundColor: '#063772',
  fontSize: '16px',
  padding: '10px 16px',
  borderRadius: '8px',
  // marginBottom: '8px',
  maxWidth: '500px',
  boxSizing: 'border-box'
});

const NameText = styled(Typography)({
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  color: "#FFF"
})

export default function SelectedHints(props: any) {
  const {
    hints,
    gptHints,
    graphClickIndex
  } = props;
  // const hintCount = gptHints[graphClickInfo.selectedIndex].teamCount;
  // const percentage = (hintCount / numPlayers) * 100;
  let selectedGPTTeams: any[] = [];
  let getSelectedHints = [];
  if (graphClickIndex != null) {
    selectedGPTTeams = gptHints[graphClickIndex].teams;
    getSelectedHints = hints.filter((hint: any) => selectedGPTTeams.includes(hint.teamName));
  }
  const [isExpanded, setIsExpanded] = useState(true);
  console.log(gptHints);
  console.log(graphClickIndex);
  console.log(gptHints[graphClickIndex]);
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', width: '100%'}}>
      <SelectedHintsContainer>
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', padding: '8px 12px', backgroundColor: '#FFFFFF33' }}
        >
          <TitleText style={{ paddingTop: 0 }}>
            {gptHints[graphClickIndex].themeText}
          </TitleText>
          <img src={ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: '8px' }} />
        </Box>
      </SelectedHintsContainer>
      {isExpanded && getSelectedHints.map((team: any) => (
        <StyledRect key={uuidv4()}>
          <NameText >
            {team.teamName}
          </NameText>
          <NameText style={{color: 'rgba(255,255,255,0.6)'}}>
            {team.rawHint}
          </NameText>
        </StyledRect>
      ))}
    </Box>
  );
}