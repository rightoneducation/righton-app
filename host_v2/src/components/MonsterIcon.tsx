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
  const images = [MonsterIndex0, MonsterIndex1, MonsterIndex2, MonsterIndex3, MonsterIndex4, MonsterIndex5];

  const background = backgrounds[index] || backgrounds[0];
  const image = images[index] || images[0];

  return (
    <MonsterContainer style={{ background }}>
      <MonsterImage src={image} alt={`Monster ${index}`} />
    </MonsterContainer>
  );
}

export default MonsterIcon;
