import React from 'react';
import { IFlowStep } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import { FlowStep } from '../lib/flowProgress';
import ClassStepTrack from './ClassStepTrack';
import { StepperRow } from '../lib/styledcomponents/DashboardStyledComponents';

interface FlowStepperProps {
  steps: IFlowStep[];
  // The step whose page this is. It never links to itself, even once the
  // class has moved past it.
  page: FlowStep;
  screenSize: ScreenSize;
}

// rev2 Stepper: the flow pages show Home's circle track, so teachers see the
// same steps everywhere. Fits the width on phones; StepperRow scrolls it
// sideways at medium.
export default function FlowStepper({ steps, page, screenSize }: FlowStepperProps) {
  return (
    <StepperRow screenSize={screenSize}>
      <ClassStepTrack
        steps={steps}
        size="large"
        fluid={screenSize === ScreenSize.SMALL}
        page={page}
      />
    </StepperRow>
  );
}
