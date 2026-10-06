import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IFlowStep } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepperRow,
  StepItem,
  StepButton,
  StepCircle,
  StepConnector,
  stepColor,
} from '../lib/styledcomponents/HomeStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
  screenSize: ScreenSize;
}

// Completed steps are dark blue, the current step accent blue, upcoming grey.
// Completed steps link back to their page, and so does Assess in any state
// (flowProgress decides via isClickable); otherwise the main button below
// already leads to the current step.
export default function FlowStepper({ steps, screenSize }: FlowStepperProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <StepperRow screenSize={screenSize}>
      {steps.map((step, index) => {
        const content = (
          <>
            <StepCircle stepState={step.state}>
              <Typography variant="stepNumber" component="span">
                {step.order}
              </Typography>
            </StepCircle>
            <Typography
              className="step-label"
              variant="stepLabel"
              sx={{
                color: stepColor(theme, step.state),
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </Typography>
          </>
        );
        const { path } = step;

        return (
          <React.Fragment key={step.order}>
            {index > 0 && <StepConnector screenSize={screenSize} />}
            {step.isClickable && path ? (
              <StepButton
                screenSize={screenSize}
                onClick={() => navigate(path)}
                aria-label={`${step.label} (${step.state === 'COMPLETE' ? 'completed' : 'current'})`}
                aria-current={step.state === 'CURRENT' ? 'step' : undefined}
              >
                {content}
              </StepButton>
            ) : (
              <StepItem
                screenSize={screenSize}
                aria-current={step.state === 'CURRENT' ? 'step' : undefined}
              >
                {content}
              </StepItem>
            )}
          </React.Fragment>
        );
      })}
    </StepperRow>
  );
}
