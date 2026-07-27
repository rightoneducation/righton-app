import React from 'react';
import { styled } from '@mui/material/styles';
import MonsterIndex0 from '../images/MonsterIndex0.svg';
import MonsterIndex1 from '../images/MonsterIndex1.svg';
import MonsterIndex2 from '../images/MonsterIndex2.svg';
import MonsterIndex3 from '../images/MonsterIndex3.svg';
import MonsterIndex4 from '../images/MonsterIndex4.svg';
import MonsterIndex5 from '../images/MonsterIndex5.svg';

const MonsterContainer = styled('div')({
  display: 'flex',
  borderRadius: '4px',
  flexShrink: 0, // never squeeze the avatar when a long player name competes for the row
});

const MonsterImage = styled('img')({
  display: 'flex',
  borderRadius: '4px',
  width: '26px',
  height: '33px',
});

interface MonsterIconProps {
  index: number;
}

function MonsterIcon({ index }: MonsterIconProps) {
  const backgrounds = ['#67D24D', '#FF9D33', '#02528B', '#921ECE', '#9E1107', '#1F81B3'];
  // drop-shadow tint per monster, derived from its background color (matches NoPlayersLobby's tinted shadows)
  const shadows = [
    'rgba(103, 210, 77, 0.3)',
    'rgba(255, 157, 51, 0.3)',
    'rgba(2, 82, 139, 0.3)',
    'rgba(146, 30, 206, 0.3)',
    'rgba(158, 17, 7, 0.3)',
    'rgba(31, 129, 179, 0.3)',
  ];
  const images = [MonsterIndex0, MonsterIndex1, MonsterIndex2, MonsterIndex3, MonsterIndex4, MonsterIndex5];

  const background = backgrounds[index] || backgrounds[0];
  const shadow = shadows[index] || shadows[0];
  const image = images[index] || images[0];

  return (
    <MonsterContainer style={{ background, filter: `drop-shadow(0px 8px 20px ${shadow})` }}>
      <MonsterImage src={image} alt={`Monster ${index}`} />
    </MonsterContainer>
  );
}

export default MonsterIcon;
