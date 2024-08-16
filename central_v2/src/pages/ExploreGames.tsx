import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ExploreGamesProps {
  sampleProp: string;
}

const ExploreGamesContainer = styled(Box)(({ theme }) => ({
  height: '100vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  backgroundColor: '#02215F' 
}));

export default function ExploreGames({ sampleProp }: ExploreGamesProps) {
  const theme = useTheme(); 
  const { t } = useTranslation();
  return (
    <ExploreGamesContainer>
      <Typography variant="h1"> 🎠 carousel to go here 🎠 </Typography>
    </ExploreGamesContainer>
  );
}
