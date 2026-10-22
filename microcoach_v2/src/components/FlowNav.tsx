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

export type FlowTabId =
  | 'assess'
  | 'understand'
  | 'select-activity'
  | 'reassess'
  | 'reflect';

export const FLOW_TABS: { id: FlowTabId; labelKey: string }[] = [
  { id: 'assess', labelKey: 'flowNav.assess' },
  { id: 'understand', labelKey: 'flowNav.understand' },
  { id: 'select-activity', labelKey: 'flowNav.selectActivity' },
  { id: 'reassess', labelKey: 'flowNav.reassess' },
  { id: 'reflect', labelKey: 'flowNav.reflect' },
];

export function flowTabPath(
  tabId: FlowTabId,
  hasSavedActivity: boolean,
): string {
  switch (tabId) {
    case 'assess':
      return '/upload-miu';
    case 'reassess':
      return '/upload-reassess';
    case 'understand':
      return '/review';
    case 'select-activity':
      return hasSavedActivity ? '/myactivity' : '/review';
    case 'reflect':
    default:
      return '/reflect';
  }
}

interface FlowNavProps extends ScreenSizeProps {
  activeTabId: FlowTabId;
  actionLabelKey?: string;
  compactAction?: boolean;
  onTabSelect: (tabId: FlowTabId) => void;
  onAction?: () => void;
}

export default function FlowNav({
  screenSize,
  activeTabId,
  actionLabelKey = 'flowNav.myActivity',
  compactAction = false,
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
        spacing={`${theme.sizing.space5}px`}
        component="nav"
        sx={{
          width: '100%',
          minWidth: 0,
          paddingLeft: isLarge ? `${theme.sizing.space2}px` : '0px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
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
      {onAction &&
        <FlowNavAction compact={compactAction} disableElevation onClick={onAction}>
          {t(actionLabelKey)}
        </FlowNavAction>
      }
    </Stack>
  );
}
