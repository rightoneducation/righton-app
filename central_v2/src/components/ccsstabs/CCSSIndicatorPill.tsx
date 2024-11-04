import React from 'react';
import {  GradeIndicator, CCSSGridItem, CCSSIndicatorPillText } from '../../lib/styledcomponents/CCSSSTabsStyledComponents';

interface CCSSIndicatorPillProps {
  label: string
  onClick: () => void
}

export default function CCSSIndicatorPill ({
  label,
  onClick
}: CCSSIndicatorPillProps){
  return (
    <CCSSGridItem
      item
      sm={6}
      md={3}
    >
      <GradeIndicator
        onClick={() => onClick()}
      >
        <CCSSIndicatorPillText>
          {label}
        </CCSSIndicatorPillText>
      </GradeIndicator>
    </CCSSGridItem>
  );
}