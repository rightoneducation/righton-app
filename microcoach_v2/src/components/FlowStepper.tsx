import React from 'react';
import Typography from '@mui/material/Typography';
import { IFlowStep } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepperRow,
  StepItem,
  StepCircle,
  StepConnector,
} from '../lib/styledcomponents/HomeStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
  screenSize: ScreenSize;
}

export default function FlowStepper({ steps, screenSize }: FlowStepperProps) {
  return (
    <StepperRow screenSize={screenSize}>
      {steps.map((step, index) => {
        const isActive = step.state === 'CURRENT';

        return (
          <React.Fragment key={step.order}>
            {index > 0 && <StepConnector screenSize={screenSize} />}
            <StepItem screenSize={screenSize}>
              <StepCircle isActive={isActive}>
                <Typography variant="stepNumber" component="span">
                  {step.order}
                </Typography>
              </StepCircle>
              <Typography
                variant="stepLabel"
                sx={{
                  color: isActive
                    ? 'designSystem.foreground.accentBlue'
                    : 'designSystem.foreground.mutedGrey',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </Typography>
            </StepItem>
          </React.Fragment>
        );
      })}
    </StepperRow>
  );
}
