import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IFlowStep } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import { FlowStep, FLOW_ORDER } from '../lib/flowProgress';
import {
  StepperRow,
  StepItem,
  StepButton,
  StepSeparator,
} from '../lib/styledcomponents/DashboardStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
  // The step whose page this is: the one underlined, whatever the class's
  // progress (rev2 Misconceptions underlines Understand on a class that has
  // moved on to Reassess).
  page: FlowStep;
  screenSize: ScreenSize;
}

// A breadcrumb: every step reads the same, the page you are on is underlined.
// Completed steps link back to their page, and so does Assess in any state
// (flowProgress decides via isClickable); otherwise the main button below
// already leads to the current step. The page itself never links to itself.
export default function FlowStepper({ steps, page, screenSize }: FlowStepperProps) {
  const navigate = useNavigate();

  return (
    <StepperRow screenSize={screenSize}>
      {steps.map((step, index) => {
        const label = <span className="step-label">{step.label}</span>;
        const { path } = step;
        const isPage = index === FLOW_ORDER.indexOf(page);
        const ariaCurrent = isPage ? 'page' : undefined;

        return (
          <React.Fragment key={step.order}>
            {index > 0 && <StepSeparator aria-hidden>&gt;</StepSeparator>}
            {step.isClickable && path && !isPage ? (
              <StepButton
                screenSize={screenSize}
                isMarked={false}
                onClick={() => navigate(path)}
                aria-label={`${step.label} (${step.state === 'COMPLETE' ? 'completed' : 'current'})`}
                aria-current={ariaCurrent}
              >
                {label}
              </StepButton>
            ) : (
              <StepItem
                screenSize={screenSize}
                isMarked={isPage}
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
