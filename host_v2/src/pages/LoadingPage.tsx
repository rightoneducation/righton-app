import React from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import LaunchContainerStyled from '../lib/styledcomponents/launchcontainer/LaunchContainerStyled';
import rightOnLogoLoading from '../img/rightOnLogoLoading.svg';

export default function LaunchContainer() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
      <LaunchContainerStyled>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            // text sits below the indicator on desktop, above it on tablet/mobile
            flexDirection: { xs: 'column-reverse', lg: 'column' },
            // gap between indicator and text: mobile 44px, tablet 32px, desktop 36px
            gap: { xs: '44px', md: '32px', lg: '36px' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress
              size={140}
              sx={{
                color: '#fff',
                position: 'absolute',
                top: 0,
                left: 0,
                '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
              }}
            />
            <Box
              component="img"
              src={rightOnLogoLoading}
              alt="RightOn"
              sx={{
                // inset past the ~12px ring stroke + a 16px gap on each side (2*(12+16)=56)
                width: 'calc(100% - 56px)',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            variant="h2"
            sx={{
              ...theme.typography.designSystem.h2, // 20px Poppins 700 (design system source of truth)
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {t('loadingpage.launching')}
          </Typography>
        </Box>
      </LaunchContainerStyled>
  );
}