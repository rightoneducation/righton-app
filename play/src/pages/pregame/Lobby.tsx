import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { LobbyMode } from '../../lib/PlayModels';
import HowToPlay from './HowToPlay';

interface LobbyProps {
  mode: LobbyMode;
}

export default function Lobby({ mode }: LobbyProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  console.log(mode);
  return (
    <BackgroundContainerStyled>
      {mode === LobbyMode.REJOIN ? (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.mediumPadding}px`,
            }}
          >
            {t('lobby.title')}
          </Typography>
        </Box>
      ) : (
        <HowToPlay mode={mode} />
      )}
    </BackgroundContainerStyled>
  );
}
