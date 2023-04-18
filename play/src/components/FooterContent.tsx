import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';
import { AvatarMap } from '../lib/PlayModels';
import ScoreIndicator from './ScoreIndicator';
import Icon0 from '../img/MonsterIcon0.svg';
import Icon1 from '../img/MonsterIcon1.svg';
import Icon2 from '../img/MonsterIcon2.svg';
import Icon3 from '../img/MonsterIcon3.svg';
import Icon4 from '../img/MonsterIcon4.svg';
import Icon5 from '../img/MonsterIcon5.svg';

const FooterContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  maxWidth: `${theme.breakpoints.values.sm}px`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: theme.palette.primary.main,
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

const FooterLeftContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const Avatar = styled('img')({
  height: '42px',
  width: 'auto',
  boxShadow: '0px 5px 12px rgba(16, 54, 0, 0.3)',
  borderRadius: '12px',
});

interface HeaderProps {
  avatar: number;
  teamName: string;
  newPoints: number;
  score: number | null;
}



export default function Header({
  avatar,
  teamName,
  newPoints,
  score,
}: HeaderProps) {
  const theme = useTheme();
  const avatarMap: AvatarMap = {
    0: Icon0,
    1: Icon1,
    2: Icon2,
    3: Icon3,
    4: Icon4,
    5: Icon5,
  };

  return (
    <FooterContainer>
      <FooterLeftContainer>
        <Avatar src={avatarMap[avatar]} alt="avatar" />
        <Typography
          variant="h3"
          sx={{ marginLeft: `${theme.sizing.smallPadding}px` }}
        >
          {teamName}
        </Typography>
      </FooterLeftContainer>
      <ScoreIndicator newPoints={newPoints} score={score} />
    </FooterContainer>
  );
}
