import React, { useState } from 'react';
import { Typography, Card, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import { ConfidenceLevel, IHostTeamAnswersConfidence, IHostTeamAnswersConfidenceResponse, IHostTeamAnswersResponse } from '@righton/networking';
import ArrowIcon from '../../images/Arrow.svg';
import check from '../../img/Pickedcheck_white.svg';


interface DropdownProps {
  selectedConfidence: IHostTeamAnswersConfidence;
  numPlayers: number;
  // responses for the question, used to map a player's rawAnswer to its multiple-choice letter
  responses: IHostTeamAnswersResponse[];
  isShortAnswerEnabled: boolean;
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


const NameText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  color: 'white',
  // take the row's free space and allow shrinking so a long name ellipsizes
  // rather than pushing the answer off the right edge
  flex: 1,
  minWidth: '32px'
});

// right side of the player row: the (optional) correct-answer check followed by the
// player's answer — its multiple-choice letter, or the raw answer in short-answer mode.
const AnswerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: `${theme.sizing.xSmPadding}px`,
  flexShrink: 0,
}));

const AnswerText = styled(Typography)({
  color: 'white',
  textAlign: 'right',
});

const CountText = styled(Typography)({
  color: '#FFF',
  textAlign: 'right',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '700',
});

const PercentageText = styled(Typography)({
  color: '#FFF',
  textAlign: 'left',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
  paddingLeft: '4px',
});

const NumberContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});


export default function ConfidenceResponseDropdown({
  selectedConfidence,
  numPlayers,
  responses,
  isShortAnswerEnabled,
}: DropdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const ConfidenceLevelDictionary: { [key in ConfidenceLevel]: string } = {
    [ConfidenceLevel.NOT_RATED]: 'Not Rated',
    [ConfidenceLevel.NOT_AT_ALL]: 'Not At All Confident',
    [ConfidenceLevel.KINDA]: 'A Little Confident',
    [ConfidenceLevel.QUITE]: 'Sort Of Confident',
    [ConfidenceLevel.VERY]: 'Very Confident',
    [ConfidenceLevel.TOTALLY]: 'Totally Confident',
  };
  const count = selectedConfidence.correct.length + selectedConfidence.incorrect.length;
  const percentage = numPlayers > 0 ? (count / numPlayers) * 100 : 0;
  // map a player's rawAnswer to its multiple-choice letter (e.g. 'A'); unused in short-answer mode
  const letterByRawAnswer = responses.reduce<Record<string, string>>((acc, response) => {
    acc[response.rawAnswer] = response.multiChoiceCharacter;
    return acc;
  }, {});
  const playerResponse = (
    playerData: IHostTeamAnswersConfidenceResponse,
    isCorrect: boolean,
  ): React.ReactNode => {
    const answerDisplay = isShortAnswerEnabled
      ? playerData.rawAnswer
      : (letterByRawAnswer[playerData.rawAnswer] ?? '-');
    return (
      <PlayerCard key={`${playerData.team}-${playerData.rawAnswer}`}>
        <NameText>{playerData.team}</NameText>
        <AnswerContainer>
          {isCorrect && <img src={check} alt="correct answer" />}
          <AnswerText variant="h4">{answerDisplay}</AnswerText>
        </AnswerContainer>
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
            <Box
              onClick={() => setIsExpanded(!isExpanded)}
              style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', padding: '8px 12px', backgroundColor: '#FFFFFF33' }}
            >
              <Typography sx={{ color: '#FFFFFF', textAlign: 'center', fontSize: '14px', fontWeight: 700, fontFamily: 'Rubik'}}>
                {ConfidenceLevelDictionary[selectedConfidence.level]}
              </Typography>
              <NumberContainer>
                <CountText>
                  {count}
                </CountText>
                <PercentageText>
                  ({Math.round(percentage)}%)
                </PercentageText>
                <img src={ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </NumberContainer>
            </Box>
          </HeaderContainer>
          {isExpanded && (
            <DropDownContainer>
              {sortedPlayers.correct.map((playerData) =>
                playerResponse(playerData, true),
              )}
              {sortedPlayers.incorrect.map((playerData) =>
                playerResponse(playerData, false),
              )}
            </DropDownContainer>
          )}
        </>
      )}
    </Container>
  );
}
