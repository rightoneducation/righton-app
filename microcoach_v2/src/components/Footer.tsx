import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ContentRow from './ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';

interface FooterProps {
  screenSize: ScreenSize;
}

// Height is derived, not declared: one padding token plus the content's own
// height. That lands near the Figma bars (152 vs 160 at 1920, 152 vs 147 at
// 744, 192 vs 196 at 393) and makes mobile taller automatically because the
// two items stack there. Sits in normal flow — not sticky.
const FooterBar = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  paddingTop: theme.sizing.space11,
  paddingBottom: theme.sizing.space11,
  boxSizing: 'border-box',
}));

export default function Footer({ screenSize }: FooterProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = screenSize === ScreenSize.SMALL;

  return (
    <FooterBar component="footer">
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap:
            screenSize === ScreenSize.LARGE
              ? `${theme.sizing.space14}px`
              : `${theme.sizing.space6}px`,
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
