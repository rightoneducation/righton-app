import React from 'react';
import { useTranslation } from 'react-i18next';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  PhaseTabBar as Bar,
  PhaseTab,
  PhaseTabSeparator,
} from '../lib/styledcomponents/ActivityDetailStyledComponents';

export type PhaseId =
  'before-class' | 'activity' | 'facilitation' | 'discussion';

export const PHASES: { id: PhaseId; labelKey: string }[] = [
  { id: 'before-class', labelKey: 'activityDetail.beforeClass' },
  { id: 'activity', labelKey: 'activityDetail.activity' },
  { id: 'facilitation', labelKey: 'activityDetail.facilitation' },
  { id: 'discussion', labelKey: 'activityDetail.discussion' },
];

const ICONS: Record<PhaseId, React.ReactElement> = {
  'before-class': <DescriptionOutlinedIcon fontSize="small" />,
  activity: <MenuBookOutlinedIcon fontSize="small" />,
  facilitation: <LoopIcon fontSize="small" />,
  discussion: <ChatBubbleOutlineIcon fontSize="small" />,
};

interface PhaseTabBarProps {
  phase: PhaseId;
  onChange: (phase: PhaseId) => void;
}

export default function PhaseTabBar({ phase, onChange }: PhaseTabBarProps) {
  const { t } = useTranslation();

  return (
    <Bar>
      {PHASES.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <PhaseTabSeparator aria-hidden>&gt;</PhaseTabSeparator>}
          <PhaseTab
            isActive={item.id === phase}
            aria-current={item.id === phase ? 'step' : undefined}
            disableElevation
            startIcon={ICONS[item.id]}
            onClick={() => onChange(item.id)}
          >
            {t(item.labelKey)}
          </PhaseTab>
        </React.Fragment>
      ))}
    </Bar>
  );
}
