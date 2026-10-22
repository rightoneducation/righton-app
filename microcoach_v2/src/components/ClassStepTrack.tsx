import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { alpha, styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { FlowStep, FLOW_ORDER } from '../lib/flowProgress';
import { IFlowStep } from '../lib/PipelineModels';
import { StepState } from '../lib/styledcomponents/DashboardStyledComponents';

// A five-step track: numbered circles joined by a line that fills in
// accentBlue up to the current step. Every circle shows its number, done
// ones included (rev2 Stepper); labels sit centred underneath; upcoming steps
// are grey.
//   compact: each Weekly Activity Progress card (rev2 WeeklyActivityProgress)
//   large:   Home's top stepper (rev2 LandingPage), with a 30% navy halo on
//            the current step; completed steps (and Assess) link to their page.
//            The flow pages use it too (FlowStepper), passing `page`.
// fluid: phones. The track takes its container's width instead of the fixed
// pitch, and labels wrap, so five steps fit without scrolling the page.

export type StepTrackSize = 'compact' | 'large';

const GEOMETRY: Record<
  StepTrackSize,
  {
    pitch: number;
    circleSize: number;
    lineWidth: number;
    // How far the current step's halo reaches past its circle.
    haloSpread: number;
    labelSize: number;
  }
> = {
  compact: { pitch: 99, circleSize: 29, lineWidth: 4, haloSpread: 0, labelSize: 12 },
  // Figma: 38px circles in a 50.75px halo, ~159 apart, on a 2px line.
  large: { pitch: 159, circleSize: 38, lineWidth: 2, haloSpread: 6, labelSize: 16 },
};

// The widest first-step label the large track's lead inset leaves room for.
const FIRST_LABEL_ALLOWANCE = 64;

const Track = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexShrink: 0,
});

const Line = styled(Box)({
  position: 'absolute',
});

const columnStyles = {
  position: 'relative' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
};

const Column = styled(Box)(columnStyles);

// A step that links back to its page: same look as Column, but a real button
// so it takes keyboard focus. The label underlines on hover and focus.
const ColumnButton = styled(ButtonBase)({
  ...columnStyles,
  '&:hover .step-label, &.Mui-focusVisible .step-label': {
    textDecoration: 'underline',
  },
});

const STATE_COLOR: Record<StepState, string> = {
  COMPLETE: 'designSystem.foreground.accentBlue',
  CURRENT: 'designSystem.surface.atlanticNavy',
  UPCOMING: 'designSystem.foreground.disabledStroke',
};

interface ClassStepTrackProps {
  // The class's current step. Ignored when `steps` is given.
  step?: FlowStep;
  // Per-step state and links (buildFlowSteps / buildPendingFlowSteps).
  steps?: IFlowStep[];
  size?: StepTrackSize;
  fluid?: boolean;
  // The step whose page this is, so it never links to itself.
  page?: FlowStep;
}

export default function ClassStepTrack({
  step = FlowStep.ASSESS,
  steps,
  size = 'compact',
  fluid = false,
  page,
}: ClassStepTrackProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pitch, circleSize, lineWidth, haloSpread, labelSize } =
    GEOMETRY[size];
  const rowHeight = circleSize + 2 * haloSpread;
  const lastIndex = FLOW_ORDER.length - 1;

  const stateAt = (index: number): StepState => {
    if (steps) return steps[index]?.state ?? 'UPCOMING';
    const currentIndex =
      step === FlowStep.DONE ? FLOW_ORDER.length : FLOW_ORDER.indexOf(step);
    if (index < currentIndex) return 'COMPLETE';
    if (index === currentIndex) return 'CURRENT';
    return 'UPCOMING';
  };
  // The line fills up to the first step that is not done.
  const filledIndex = FLOW_ORDER.findIndex(
    (_, index) => stateAt(index) !== 'COMPLETE',
  );
  const fillTo = filledIndex === -1 ? lastIndex : filledIndex;

  const lineTop = (rowHeight - lineWidth) / 2;
  // The line runs from the first circle's centre to the last one's: half a
  // column in from each end. Fixed pitch in px; fluid in % of the track.
  const columnShare = 100 / FLOW_ORDER.length;
  const lineLeft = fluid ? `${columnShare / 2}%` : pitch / 2;
  const lineLength = (count: number) =>
    fluid ? `${count * columnShare}%` : count * pitch;

  // rev2 frames (LandingPage, Stepper) put the first step at the content
  // edge, but each circle is centred in a pitch-wide column. At large, pull
  // the track back by the empty part of that first column so the pitch
  // between circles stays as drawn. The first label is centred under its ring
  // and can be wider ("Evaluar" ~60), and the stepper row is a scroller that
  // clips anything left of it, so the pull stops where a 64px label would
  // touch the edge: the ring lands ~7 in rather than flush.
  const leadInset =
    size === 'large' && !fluid ? (pitch - FIRST_LABEL_ALLOWANCE) / 2 : 0;
  let trackSx;
  if (fluid) trackSx = { width: '100%' };
  else if (leadInset > 0) trackSx = { ml: `${-leadInset}px` };

  return (
    <Track sx={trackSx}>
      <Line
        sx={{
          top: lineTop,
          left: lineLeft,
          height: lineWidth,
          width: lineLength(lastIndex),
          bgcolor: STATE_COLOR.UPCOMING,
        }}
        aria-hidden
      />
      <Line
        sx={{
          top: lineTop,
          left: lineLeft,
          height: lineWidth,
          width: lineLength(fillTo),
          bgcolor: STATE_COLOR.COMPLETE,
        }}
        aria-hidden
      />
      {FLOW_ORDER.map((flowStep, index) => {
        const state = stateAt(index);
        const color = STATE_COLOR[state];
        const link = steps?.[index];
        const path =
          link?.isClickable && flowStep !== page ? link.path : undefined;
        const label = t(`dashboard.steps.${flowStep}`);

        const content = (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: rowHeight,
              }}
            >
              <Box
                sx={(theme) => ({
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
                  ...(haloSpread > 0 &&
                    state === 'CURRENT' && {
                      boxShadow: `0 0 0 ${haloSpread}px ${alpha(
                        theme.palette.designSystem.surface.atlanticNavy,
                        0.3,
                      )}`,
                    }),
                })}
              >
                {index + 1}
              </Box>
            </Box>
            <Box
              component="span"
              className="step-label"
              sx={{
                color,
                typography: 'rubikBodyBold',
                // A fluid column is ~70px on a phone: at 16px "Understand"
                // runs into its neighbour, so labels drop to the compact size.
                fontSize: fluid ? GEOMETRY.compact.labelSize : labelSize,
                letterSpacing: '-0.02em',
                whiteSpace: fluid ? 'normal' : 'nowrap',
                textAlign: 'center',
              }}
            >
              {label}
            </Box>
          </>
        );

        // Circle to label: the halo's spread already sits in that space at
        // large, so the gap is smaller there.
        const columnSx = (theme: Theme) => ({
          ...(fluid ? { flex: '1 1 0', minWidth: 0 } : { width: pitch }),
          gap: `${size === 'large' ? theme.sizing.space0 : theme.sizing.space1}px`,
        });
        const ariaCurrent = state === 'CURRENT' ? ('step' as const) : undefined;

        return path ? (
          <ColumnButton
            key={flowStep}
            sx={columnSx}
            onClick={() => navigate(path)}
            aria-current={ariaCurrent}
            aria-label={`${label} (${state === 'COMPLETE' ? 'completed' : 'current'})`}
          >
            {content}
          </ColumnButton>
        ) : (
          <Column key={flowStep} sx={columnSx} aria-current={ariaCurrent}>
            {content}
          </Column>
        );
      })}
    </Track>
  );
}
