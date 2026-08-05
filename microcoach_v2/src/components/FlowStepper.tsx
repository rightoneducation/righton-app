import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IFlowStep } from '../lib/PipelineModels';
import {
  StepperRow,
  StepCircle,
  StepConnector,
} from '../lib/styledcomponents/HomeStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
}

export default function FlowStepper({ steps }: FlowStepperProps) {
  return (
    <StepperRow>
      {steps.map((step, index) => {
        const isActive = step.state === 'CURRENT';

        return (
          <React.Fragment key={step.order}>
            {index > 0 && <StepConnector />}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: (theme) => `${theme.sizing.space1}px`,
                flexShrink: 0,
              }}
            >
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
                }}
              >
                {step.label}
              </Typography>
            </Box>
          </React.Fragment>
        );
      })}
    </StepperRow>
  );
}
