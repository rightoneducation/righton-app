import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IFlowStep } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepperRow,
  StepItem,
  StepButton,
  StepSeparator,
} from '../lib/styledcomponents/HomeStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
  screenSize: ScreenSize;
}

// A breadcrumb: every step reads the same, the current one is underlined.
// Completed steps link back to their page, and so does Assess in any state
// (flowProgress decides via isClickable); otherwise the main button below
// already leads to the current step.
export default function FlowStepper({ steps, screenSize }: FlowStepperProps) {
  const navigate = useNavigate();

  return (
    <StepperRow screenSize={screenSize}>
      {steps.map((step, index) => {
        const label = <span className="step-label">{step.label}</span>;
        const { path } = step;
        const ariaCurrent = step.state === 'CURRENT' ? 'step' : undefined;

        return (
          <React.Fragment key={step.order}>
            {index > 0 && <StepSeparator aria-hidden>&gt;</StepSeparator>}
            {step.isClickable && path ? (
              <StepButton
                screenSize={screenSize}
                stepState={step.state}
                onClick={() => navigate(path)}
                aria-label={`${step.label} (${step.state === 'COMPLETE' ? 'completed' : 'current'})`}
                aria-current={ariaCurrent}
              >
                {label}
              </StepButton>
            ) : (
              <StepItem
                screenSize={screenSize}
                stepState={step.state}
                aria-current={ariaCurrent}
              >
                {label}
              </StepItem>
            )}
          </React.Fragment>
        );
      })}
    </StepperRow>
  );
}
