import React from 'react';
import {  GradeIndicator, CCSSGridItem, CCSSIndicatorPillText } from '../../lib/styledcomponents/CCSSSTabsStyledComponents';

interface CCSSIndicatorPillProps {
  label: string
}

export default function CCSSIndicatorPill ({
  label
}: CCSSIndicatorPillProps){
  return (
    <CCSSGridItem
      item
      sm={6}
      md={3}
    >
      <GradeIndicator
        onClick={() => {}}
      >
        <CCSSIndicatorPillText>
          {label}
        </CCSSIndicatorPillText>
      </GradeIndicator>
    </CCSSGridItem>
  );
}