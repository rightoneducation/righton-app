import React, { useState } from 'react';
import { Typography, Card, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswersConfidence, IHostTeamAnswersConfidenceResponse } from '@righton/networking';
import ArrowIcon from '../../images/Arrow.svg';


interface DropdownProps {
  graphClickIndex: number | null;
  selectedConfidence: IHostTeamAnswersConfidence;
}

const Container = styled(Box)(({ theme }) => ({
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingBottom: `${theme.sizing.smPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',

}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const DropDownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flexEnd',
  gap: `${theme.sizing.xSmPadding}px`,
  alignSelf: 'stretch',
}));


const PlayerCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: `${theme.sizing.xSmPadding}px`,
  padding: `${theme.sizing.xSmPadding}px`,
  alignSelf: 'stretch',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  background: `${theme.palette.primary.dropdownInfoBackgroundColor}`,
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  textAlign: 'left',
  fontSize: `${theme.typography.h4.fontSize}`,
  fontWeight: `${theme.typography.body1.fontWeight}`,
}));

const ConfidenceLevelText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: 700,
  fontFamily: 'Rubik',
  lineHeight: '100%'
}));


const NameText = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  color: `${theme.palette.primary.main}`,
  textOverflow: 'ellipsis',
  fontFamily: 'Poppins',
  fontSize: `${theme.typography.h5.fontSize}`,
  fontWeight: `${theme.typography.body1.fontWeight}`,
  minWidth: '32px'
}));


export default function ConfidenceResponseDropdown({
  graphClickIndex,
  selectedConfidence,
}: DropdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const ConfidenceLevelDictionary: { [key: number]: string } = {
    0: 'Not Rated',
    1: 'Not At All Confident',
    2: 'Kinda Confident',
    3: 'Quite Confident',
    4: 'Very Confident',
    5: 'Totally Confident',
  };
  const playerResponse = (team: string): React.ReactNode => {
    return (
      <PlayerCard>
        <NameText>{team}</NameText>
      </PlayerCard>
    );
  };

  /**
   * Sorts players based on the Figma criteria:
   * (1) correct players sorted alphabetically
   * (2) incorrect players sorted first by answer frequency, then alphabetically
   * @param selectedData confidence data passed in from parent
   * @returns sorted array of input
   */
  const sortPlayers = (selectedConfidenceInput: IHostTeamAnswersConfidence): {
    correct: IHostTeamAnswersConfidenceResponse[];
    incorrect: IHostTeamAnswersConfidenceResponse[];
  } => {
    const correctPlayers: IHostTeamAnswersConfidenceResponse[] = selectedConfidenceInput.correct;
    const incorrectPlayers: IHostTeamAnswersConfidenceResponse[] = selectedConfidenceInput.incorrect;
    const answerFrequency: Record<string, number> = {};
  
    // sort correct alphabetically
    correctPlayers.sort((a, b) => a.team.localeCompare(b.team));
    incorrectPlayers.sort((a, b) => a.team.localeCompare(b.team));
    return { correct: correctPlayers, incorrect: incorrectPlayers };
  };
  // return both and then render them in the correct order
  const sortedPlayers = sortPlayers(selectedConfidence);
  return (
    <Container>
      {selectedConfidence.correct.length === 0 && selectedConfidence.incorrect.length === 0 ? (
        null
      ) : (
        <>
          <HeaderContainer>
            <HeaderText>
              {t(
                'gamesession.confidenceCard.graph.dropdown.header.containsResponses',
              )}
            </HeaderText>
            <Box
              onClick={() => setIsExpanded(!isExpanded)}
              style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', padding: '8px 12px', backgroundColor: '#FFFFFF33' }}
            >
              <ConfidenceLevelText>
                {graphClickIndex !== null &&
                  ConfidenceLevelDictionary[graphClickIndex]}
              </ConfidenceLevelText>
              <img src={ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </Box>
          </HeaderContainer>
          {isExpanded && (
            <DropDownContainer>
              {sortedPlayers.correct.map((playerData) =>
                playerResponse(playerData.team),
              )}
              {sortedPlayers.incorrect.map((playerData) =>
                playerResponse(playerData.team),
              )}
            </DropDownContainer>
          )}
        </>
      )}
    </Container>
  );
}
