import React from 'react';
import { CCSSType } from '../../lib/CCSSModels';
import {
  GradeIndicator,
  CCSSGridItem,
  CCSSIndicatorPillText,
  CCSSIndicatorDescText,
} from '../../lib/styledcomponents/CCSSSTabsStyledComponents';

interface CCSSIndicatorPillProps {
  label?: string;
  description: string;
  onClick: () => void;
  type: CCSSType;
}

export default function CCSSIndicatorPill({
  label,
  description,
  onClick,
  type,
}: CCSSIndicatorPillProps) {
  return (
    <CCSSGridItem
      item
      sm={type === CCSSType.GRADE ? 6 : undefined}
      md={type === CCSSType.GRADE ? 3 : undefined}
      style={{
        justifyContent: type === CCSSType.GRADE ? 'center' : 'flex-start',
      }}
    >
      <GradeIndicator onClick={() => onClick()}>
        <CCSSIndicatorPillText
          style={{
            gap: type === CCSSType.GRADE ? '0px' : '32px',
            textWrap: type === CCSSType.GRADE ? 'nowrap' : 'wrap',
            alignItems: 'center',
          }}
        >
          {type === CCSSType.GRADE ? (
            description
          ) : (
            <>
              {label}
              <CCSSIndicatorDescText>{description}</CCSSIndicatorDescText>
            </>
          )}
        </CCSSIndicatorPillText>
      </GradeIndicator>
    </CCSSGridItem>
  );
}
