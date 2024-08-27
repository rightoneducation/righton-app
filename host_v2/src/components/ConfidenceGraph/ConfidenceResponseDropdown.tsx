import React from 'react';
import { Typography, Card, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { IHostTeamAnswersConfidence, IHostTeamAnswersConfidenceResponse } from '@righton/networking';
import check from '../../images/correctAnswerCheck.png';


interface DropdownProps {
  graphClickIndex: number | null;
  selectedConfidence: IHostTeamAnswersConfidence;
}

const Container = styled(Box)(({ theme }) => ({
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingBottom: `${theme.sizing.smPadding}px`,
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

const AnswerDataContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${theme.sizing.xSmPadding}px`,
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
  fontSize: `${theme.typography.h5.fontSize}`,
  fontWeight: `${theme.typography.h6.fontWeight}`,
}));

const AnswerLabelText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.playerFeedbackLabelColor}`,
  textAlign: 'right',
  fontSize: `${theme.typography.caption.fontSize}`,
  fontWeight: `${theme.typography.body1.fontWeight}`,
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

const AnswerText = styled(Typography)(({ theme }) => ({
  fontSize: `${theme.typography.h5.fontSize}`,
  color: `${theme.palette.primary.main}`,
  fontWeight: `${theme.typography.h5.fontWeight}`
}));

export default function ConfidenceResponseDropdown({
  graphClickIndex,
  selectedConfidence,
}: DropdownProps) {
  const { t } = useTranslation();
  const ConfidenceLevelDictionary: { [key: number]: string } = {
    0: 'Not Rated',
    1: 'Not At All Confident',
    2: 'Kinda Confident',
    3: 'Quite Confident',
    4: 'Very Confident',
    5: 'Totally Confident',
  };
  const playerResponse = (team: string, answer: string, isCorrect: boolean): React.ReactNode => {
    return (
      <PlayerCard>
        <NameText>{team}</NameText>
        <AnswerDataContainer>
          {isCorrect && <img src={check} width={18} height={24} alt="" />}
          <AnswerText>{answer}</AnswerText>
        </AnswerDataContainer>
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
        <HeaderText>
          {t('gamesession.confidenceCard.graph.dropdown.header.noResponses')}
        </HeaderText>
      ) : (
        <>
          <HeaderContainer>
            <HeaderText>
              {t(
                'gamesession.confidenceCard.graph.dropdown.header.containsResponses',
              )}
            </HeaderText>
            <ConfidenceLevelText>
              {graphClickIndex !== null &&
                ConfidenceLevelDictionary[graphClickIndex]}
            </ConfidenceLevelText>
            <AnswerLabelText>
              {t('gamesession.confidenceCard.graph.dropdown.answerLabel')}
            </AnswerLabelText>
          </HeaderContainer>
          <DropDownContainer>
            {sortedPlayers.correct.map((playerData) =>
              playerResponse(playerData.team, playerData.rawAnswer, true),
            )}
            {sortedPlayers.incorrect.map((playerData) =>
              playerResponse(playerData.team, playerData.rawAnswer, false),
            )}
          </DropDownContainer>
        </>
      )}
    </Container>
  );
}
