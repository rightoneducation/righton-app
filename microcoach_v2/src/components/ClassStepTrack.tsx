import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { FlowStep, FLOW_ORDER } from '../lib/flowProgress';
import { StepState } from '../lib/styledcomponents/DashboardStyledComponents';

// This Week's compact stepper (dashboard/v2 Dashboard2): five 29px circles on
// a 99px pitch, joined by a 4px line that fills in accentBlue up to the
// current step. Done steps show a check; labels sit centred underneath.

const pitch = 99;
const circleSize = 29;
const lineWidth = 4;

const Track = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexShrink: 0,
});

const Line = styled(Box)({
  position: 'absolute',
  top: (circleSize - lineWidth) / 2,
  left: pitch / 2,
  height: lineWidth,
});

const Column = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space1,
  width: pitch,
}));

const STATE_COLOR: Record<StepState, string> = {
  COMPLETE: 'designSystem.foreground.accentBlue',
  CURRENT: 'designSystem.surface.atlanticNavy',
  UPCOMING: 'designSystem.foreground.disabledStroke',
};

interface ClassStepTrackProps {
  step: FlowStep;
}

export default function ClassStepTrack({ step }: ClassStepTrackProps) {
  const { t } = useTranslation();
  const currentIndex =
    step === FlowStep.DONE ? FLOW_ORDER.length : FLOW_ORDER.indexOf(step);
  const lastIndex = FLOW_ORDER.length - 1;

  return (
    <Track>
      <Line
        sx={{ width: lastIndex * pitch, bgcolor: STATE_COLOR.UPCOMING }}
        aria-hidden
      />
      <Line
        sx={{
          width: Math.min(currentIndex, lastIndex) * pitch,
          bgcolor: STATE_COLOR.COMPLETE,
        }}
        aria-hidden
      />
      {FLOW_ORDER.map((flowStep, index) => {
        let state: StepState = 'UPCOMING';
        if (index < currentIndex) state = 'COMPLETE';
        else if (index === currentIndex) state = 'CURRENT';
        const color = STATE_COLOR[state];

        return (
          <Column
            key={flowStep}
            aria-current={state === 'CURRENT' ? 'step' : undefined}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: circleSize,
                height: circleSize,
                borderRadius: '50%',
                bgcolor: color,
                color: 'designSystem.background.offWhite',
                typography: 'bodyText',
                fontSize: 14.6,
                fontWeight: 600,
              }}
            >
              {state === 'COMPLETE' ? '✓' : index + 1}
            </Box>
            <Box
              component="span"
              sx={{
                color,
                typography: 'rubikBodyBold',
                fontSize: 12,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {t(`dashboard.steps.${flowStep}`)}
            </Box>
          </Column>
        );
      })}
    </Track>
  );
}
