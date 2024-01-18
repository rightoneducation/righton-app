import React from 'react';
import { Typography, Card, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';

interface PopularMistakeOption {
  answerChoice: string;
  answerCorrect: boolean;
  answerCount: number;
  answerTeams: Team[];
  answerText: string;
}

interface DropdownProps {
  graphClickIndex: number | null;
  responseData: PopularMistakeOption[];
  numPlayers: number;
}

interface Team {
  name: any;
}

const PlayerCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: `${theme.sizing.extraSmallPadding}px`,
  alignSelf: 'stretch',
  borderRadius: `${theme.sizing.extraSmallPadding}px`,
  background: `${theme.palette.primary.dropdownInfoBackgroundColor}`,
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

const HeaderText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  textAlign: 'left',
  fontSize: `${theme.typography.h4.fontSize}`,
  fontWeight: `${theme.typography.body1.fontWeight}`,
}));

const PlayerCountText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  textAlign: 'left',
  fontSize: `${theme.typography.h4.fontSize}`,
  fontWeight: `${theme.typography.caption.fontWeight}`,
}));

const PlayerCountContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginLeft: `${theme.sizing.extraSmallPadding}`
}));

const DropDownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flexEnd',
  gap: `${theme.sizing.extraSmallPadding}px`,
  alignSelf: 'stretch',
}));

const Container = styled(Box)(({ theme }) => ({
  paddingTop: `${theme.sizing.smallPadding}px`,
  paddingBottom: `${theme.sizing.smallPadding}px`,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: `${theme.sizing.extraSmallPadding}px`
}));

export default function ResponseDropdown({
  graphClickIndex,
  responseData,
  numPlayers
}: DropdownProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const percentage = graphClickIndex !== null ? Math.round(responseData[graphClickIndex].answerCount / numPlayers * 100) : 0;

  const playerResponse = ({ name }: Team): React.ReactNode => {
    return (
      <PlayerCard>
        <NameText>{name}</NameText>
      </PlayerCard>
    );
  };

  const header = (count: number): string => {
    if (count > 0 && graphClickIndex !== null && responseData[graphClickIndex].answerChoice === theme.sizing.noResponseToken) {
      return t('gamesession.popularMistakeCard.graph.dropdown.header.noResponse');
    }
    return t('gamesession.popularMistakeCard.graph.dropdown.header.containsResponses');
  }


  return (
    <Container>
      {graphClickIndex !== null &&
        <HeaderContainer>
          <HeaderText>
            {header(responseData[graphClickIndex].answerCount)}
          </HeaderText>
          <PlayerCountContainer>
            <PlayerCountText>
              {responseData[graphClickIndex].answerCount}
            </PlayerCountText>
            <HeaderText>
              ({percentage}%)
            </HeaderText>
          </PlayerCountContainer>
        </HeaderContainer>}
      {graphClickIndex !== null &&
        <DropDownContainer>
          {responseData[graphClickIndex].answerTeams.map((teamData: Team) =>
            playerResponse(teamData)
          )}
        </DropDownContainer>}
    </Container>
  );

}