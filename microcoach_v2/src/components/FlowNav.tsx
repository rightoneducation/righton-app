import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  FlowTab,
  FlowTabSeparator,
  FlowNavAction,
} from '../lib/styledcomponents/FlowNavStyledComponents';
import { ScreenSizeProps } from '../lib/styledcomponents/LandingStyledComponents';

export type FlowTabId = 'understand-act' | 'prepare' | 'reflect';

export const FLOW_TABS: { id: FlowTabId; labelKey: string }[] = [
  { id: 'understand-act', labelKey: 'flowNav.understandAct' },
  { id: 'prepare', labelKey: 'flowNav.prepare' },
  { id: 'reflect', labelKey: 'flowNav.reflect' },
];

interface FlowNavProps extends ScreenSizeProps {
  activeTabId: FlowTabId;
  actionLabelKey?: string;
  onTabSelect: (tabId: FlowTabId) => void;
  onAction: () => void;
}

export default function FlowNav({
  screenSize,
  activeTabId,
  actionLabelKey = 'flowNav.myPlan',
  onTabSelect,
  onAction,
}: FlowNavProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <Stack
      direction={isLarge ? 'row' : 'column'}
      alignItems={isLarge ? 'center' : 'flex-start'}
      justifyContent="space-between"
      spacing={`${theme.sizing.space3}px`}
      sx={{ width: '100%' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={`${theme.sizing.space2}px`}
        component="nav"
      >
        {FLOW_TABS.map((tab, index) => (
          <React.Fragment key={tab.id}>
            {index > 0 && <FlowTabSeparator aria-hidden>&gt;</FlowTabSeparator>}
            <FlowTab
              isActive={tab.id === activeTabId}
              aria-current={tab.id === activeTabId ? 'page' : undefined}
              onClick={() => onTabSelect(tab.id)}
            >
              {t(tab.labelKey)}
            </FlowTab>
          </React.Fragment>
        ))}
      </Stack>
      {activeTabId !== 'prepare' && 
        <FlowNavAction disableElevation onClick={onAction}>
          {t(actionLabelKey)}
        </FlowNavAction>
      }
    </Stack>
  );
}
