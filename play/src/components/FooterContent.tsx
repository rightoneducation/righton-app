import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';
import ScoreIndicator from './ScoreIndicator';
import Icon from '../img/MonsterIcon1.svg';
import Icon2 from '../img/MonsterIcon2.svg';
import Icon3 from '../img/MonsterIcon3.svg';
import Icon4 from '../img/MonsterIcon4.svg';
import Icon5 from '../img/MonsterIcon5.svg';
import Icon6 from '../img/MonsterIcon6.svg';

const FooterContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: theme.palette.primary.main,
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

interface AvatarMap {
  [key: number]: string;
}

export default function Header({
  avatar,
  teamName,
  newPoints,
  score,
}: HeaderProps) {
  const avatarMap: AvatarMap = {
    0: Icon,
    1: Icon2,
    2: Icon3,
    3: Icon4,
    4: Icon5,
    5: Icon6,
  };

  return (
    <FooterContainer maxWidth="sm">
      <FooterLeftContainer>
        <Avatar src={avatarMap[avatar]} alt="avatar" />
        <Typography variant="h3" sx={{ marginLeft: '12px' }}>
          {teamName}
        </Typography>
      </FooterLeftContainer>
      <ScoreIndicator newPoints={newPoints} score={score} />
    </FooterContainer>
  );
}
