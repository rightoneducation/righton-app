import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ContentRow from './ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';

interface FooterProps {
  screenSize: ScreenSize;
}

// Figma bar heights: 196 at 393 (the two items stack), 147 at 744, 160 at 1920.
// Sits in normal flow — not sticky.
const FooterBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<FooterProps>(({ theme, screenSize }) => ({
  width: '100%',
  minHeight:
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? theme.sizing.footerHeight
      : screenSize === ScreenSize.MEDIUM
        ? 147
        : 196,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  paddingTop: theme.sizing.space5,
  paddingBottom: theme.sizing.space5,
  boxSizing: 'border-box',
}));

export default function Footer({ screenSize }: FooterProps) {
  const { t } = useTranslation();
  const isSmall = screenSize === ScreenSize.SMALL;

  return (
    <FooterBar component="footer" screenSize={screenSize}>
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // Figma: copyright ends at x 1058, "Privacy Policy" starts at 1191.
          columnGap: screenSize === ScreenSize.LARGE ? '133px' : '32px',
          rowGap: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="footer"
          sx={{ color: 'designSystem.surface.white' }}
        >
          {t('footer.copyright')}
        </Typography>
        <Link
          component={RouterLink}
          to="/privacy"
          sx={{
            ...{ typography: 'footer' },
            color: 'designSystem.surface.white',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('footer.privacypolicy')}
        </Link>
      </ContentRow>
    </FooterBar>
  );
}
