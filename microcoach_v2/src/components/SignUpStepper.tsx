import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FlowTabSeparator } from '../lib/styledcomponents/FlowNavStyledComponents';

/**
 * The "Step 1 > Step 2 > Step 3" breadcrumb above steps 1-3.
 *
 * Reuses FlowNav's separator so the chevron matches the one in the activity
 * flow; the labels differ only by weight of colour, so they need no chip.
 */

export const SIGNUP_STEP_COUNT = 3;

interface Props {
  /** 1-based, matching the labels the frames print. */
  current: number;
}

export default function SignUpStepper({ current }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={`${theme.sizing.space2}px`}
      component="nav"
    >
      {Array.from({ length: SIGNUP_STEP_COUNT }, (unused, i) => i + 1).map(
        (step) => (
          <React.Fragment key={step}>
            {step > 1 && <FlowTabSeparator aria-hidden>&gt;</FlowTabSeparator>}
            <Typography
              variant="rubikSubBold"
              aria-current={step === current ? 'step' : undefined}
              sx={{
                // Figma marks the active step in atlanticNavy and leaves the
                // rest in accentBlue; there is no other difference.
                color:
                  step === current
                    ? 'designSystem.surface.atlanticNavy'
                    : 'designSystem.foreground.accentBlue',
              }}
            >
              {t('signup.step', { number: step })}
            </Typography>
          </React.Fragment>
        ),
      )}
    </Stack>
  );
}
