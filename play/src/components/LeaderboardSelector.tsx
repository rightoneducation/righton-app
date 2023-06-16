import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { monsterMap } from '../lib/PlayModels';

const LeaderboardSelectorContainer = styled(Box)({
  width: '100%',
  minHeight: '75px',
  borderRadius: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  maxWidth: '100%', // overwrite MUI default maxWidth
  overflow: 'hidden',
  position: 'relative',
});

const MonsterAvatar = styled('img')({
  transform: 'translateX(-45%) translateY(5%) rotate(15deg) scale(0.75)',
  position: 'absolute',
  zIndex: 0,
});

const ScoreBox = styled(Box)(({ theme }) => ({
  height: '58px',
  minWidth: '64px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.302)',
  borderRadius: '17px',
  marginRight: `${theme.sizing.extraSmallPadding}px`,
}));

interface LeaderboardSelectorProps {
  teamName: string;
  teamAvatar: number;
  teamScore: number;
}

export default function LeaderboardSelector({
  teamName,
  teamAvatar,
  teamScore,
}: LeaderboardSelectorProps) {
  const theme = useTheme();

  // this reformats the team name to first name and first initial of last name
  const reformatTeamName = (inputText: string) => {
    const spaceLocation = inputText.lastIndexOf(' ');
    let reformattedTeamName = inputText;

    if (spaceLocation !== -1) {
      reformattedTeamName = `${inputText.substring(0, spaceLocation + 2)}.`;
    }
    return reformattedTeamName;
  };

  const teamNameFormatted = reformatTeamName(teamName);

  return (
    <LeaderboardSelectorContainer
      sx={{ background: monsterMap[teamAvatar].gradient }}
    >
      <MonsterAvatar src={monsterMap[teamAvatar].monster} alt="avatar" />
      <Typography
        variant="h1"
        sx={{
          textShadow: '0px 2px 8px rgba(0, 0, 0, 0.7)',
          zIndex: 1,
          paddingLeft: `${theme.sizing.extraLargePadding}px`,
        }}
      >
        {teamNameFormatted}
      </Typography>
      <ScoreBox>
        <Typography
          variant="h1"
          sx={{
            paddingLeft: `${theme.sizing.extraSmallPadding}px`,
            paddingRight: `${theme.sizing.extraSmallPadding}px`,
          }}
        >
          {teamScore}
        </Typography>
      </ScoreBox>
    </LeaderboardSelectorContainer>
  );
}
