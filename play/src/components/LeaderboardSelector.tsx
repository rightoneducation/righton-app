import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { monsterMap } from '../lib/PlayModels';

export const LeaderboardOuterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '340px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: theme.palette.primary.darkPurple,
}));

const LeaderboardSelectorContainer = styled(Box)({
  flex: 1,
  minHeight: '75px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
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
  marginRight: `${theme.sizing.xSmPadding}px`,
}));

interface LeaderboardSelectorProps {
  teamName: string;
  teamAvatar: number;
  teamScore: number;
  position: number;
  cardBorderRadius?: string;
  showPosition?: boolean;
}

export default function LeaderboardSelector({
  teamName,
  teamAvatar,
  teamScore,
  position,
  cardBorderRadius = '8px',
  showPosition = true,
}: LeaderboardSelectorProps) {
  const theme = useTheme();

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
    <Box sx={{ width: '100%', minHeight: '75px', display: 'flex', alignItems: 'center' }}>
      <Typography
        variant="title"
        sx={{
          minWidth: '30px',
          paddingLeft: '8px',
          paddingRight: '8px',
          textAlign: 'center',
          visibility: showPosition ? 'visible' : 'hidden',
        }}
      >
        {position}
      </Typography>
      <LeaderboardSelectorContainer
        sx={{ background: monsterMap[teamAvatar].gradient, borderRadius: cardBorderRadius }}
      >
        <MonsterAvatar src={monsterMap[teamAvatar].monster} alt="avatar" />
        <Typography
          variant="h1"
          sx={{
            textShadow: '0px 2px 8px rgba(0, 0, 0, 0.7)',
            zIndex: 1,
            paddingLeft: `${theme.sizing.xLgPadding}px`,
          }}
        >
          {teamNameFormatted}
        </Typography>
        <ScoreBox>
          <Typography
            variant="h1"
            sx={{
              paddingLeft: `${theme.sizing.xSmPadding}px`,
              paddingRight: `${theme.sizing.xSmPadding}px`,
            }}
          >
            {teamScore}
          </Typography>
        </ScoreBox>
      </LeaderboardSelectorContainer>
    </Box>
  );
}
