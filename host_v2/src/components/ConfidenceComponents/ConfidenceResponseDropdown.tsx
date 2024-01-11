import React from 'react';
import { Grid, Typography, Card, Box } from '@mui/material';
// TODO: import check
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import check from '../../images/correctAnswerCheck.png';

interface DropdownProps {
  // TODO: change these to their correct types (and make them non-optional)
  graphClickInfo?: any;
  selectedConfidenceData?: any;
}

interface PlayerData {
  name: string;
  answer: string;
  isCorrect: boolean;
}

const Container = styled(Box)(({ theme }) => ({
  paddingTop: `${theme.sizing.smallPadding}px`,
  paddingBottom: `${theme.sizing.smallPadding}px`,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.extraSmallPadding}px`
}));

const DropDownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flexEnd',
  gap: `${theme.sizing.extraSmallPadding}px`,
  alignSelf: 'stretch',
}));

const AnswerDataContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: `${theme.sizing.extraSmallPadding}px`,
  justifyContent: 'center',
  paddingRight: `${theme.sizing.extraSmallPadding}px`,
}));

const PlayerCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: `${theme.sizing.extraSmallPadding}px`,
  alignSelf: 'stretch',
  borderRadius: `${theme.sizing.extraSmallPadding}px`,
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
  lineHeight: `${theme.typography.subtitle1.lineHeight}`,
  paddingLeft: `${theme.sizing.extraSmallPadding}px`,
}));

const AnswerText = styled(Typography)(({ theme }) => ({
  fontSize: `${theme.typography.h5.fontSize}`,
  color: `${theme.palette.primary.main}`,
  fontWeight: `${theme.typography.h5.fontWeight}`,
}));

export default function ConfidenceResponseDropdown({
  graphClickInfo,
  selectedConfidenceData }: DropdownProps
) {
  const { t } = useTranslation();
  const ConfidenceLevelDictionary: any = {
    0: 'Not Rated',
    1: 'Not At All Confident',
    2: 'Kinda Confident',
    3: 'Quite Confident',
    4: 'Very Confident',
    5: 'Totally Confident',
  };
  const playerResponse = ({ name, answer, isCorrect }: PlayerData): any => {
    return (
      <PlayerCard>
        <NameText>{name}</NameText>
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
  const sortPlayers = (selectedData: any) => {
    const correctPlayers: any[] = [];
    const incorrectPlayers: any[] = [];
    const answerFrequency: any = {};
    selectedData.players.forEach((playerData: PlayerData) => {
      // split players into correct and incorrect so .sort is limited to these subsets
      if (playerData.isCorrect) {
        correctPlayers.push(playerData);
      } else {
        incorrectPlayers.push(playerData);
        // if incorrect, also store the frequency of the answer for sorting later
        answerFrequency[playerData.answer] =
          (answerFrequency[playerData.answer] || 0) + 1;
      }
    });
    // sort correct alphabetically
    correctPlayers.sort((a, b) => a.name.localeCompare(b.name));
    incorrectPlayers.sort((a, b) => {
      // sort incorrect by answer frequency, then alphabetically
      const freqDifference =
        answerFrequency[b.answer] - answerFrequency[a.answer];
      return freqDifference !== 0
        ? freqDifference
        : a.name.localeCompare(b.name);
    });
    return { correct: correctPlayers, incorrect: incorrectPlayers };
  };
  // return both and then render them in the correct order
  const sortedPlayers = sortPlayers(selectedConfidenceData);
  return (
    <Container>
      {selectedConfidenceData.players.length === 0 ? (
        <HeaderText>
          {t('gamesession.confidenceCard.graph.dropdown.header.noResponses')}
        </HeaderText>
      ) : (
        <>
          <HeaderContainer>
            <HeaderText>
              {t('gamesession.confidenceCard.graph.dropdown.header.containsResponses')}
            </HeaderText>
            <ConfidenceLevelText>
              {ConfidenceLevelDictionary[graphClickInfo.selectedIndex]}
            </ConfidenceLevelText>
            <AnswerLabelText>{t('gamesession.confidenceCard.graph.dropdown.answerLabel')}</AnswerLabelText>
          </HeaderContainer>
          <DropDownContainer>
            {sortedPlayers.correct.map((playerData) =>
              playerResponse(playerData),
            )}
            {sortedPlayers.incorrect.map((playerData) =>
              playerResponse(playerData),
            )}
          </DropDownContainer>
        </>
      )}
    </Container>
  );
}

