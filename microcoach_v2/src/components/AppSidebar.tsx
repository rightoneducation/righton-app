import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { ISidebarItem } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  Sidebar,
  SidebarItem,
} from '../lib/styledcomponents/HomeStyledComponents';

const icons: Record<string, React.ReactNode> = {
  home: <HomeOutlinedIcon fontSize="small" />,
  'this-week': <CalendarTodayOutlinedIcon fontSize="small" />,
  'past-insights': <HistoryOutlinedIcon fontSize="small" />,
};

interface AppSidebarProps {
  items: ISidebarItem[];
  screenSize: ScreenSize;
  onSelect: (itemId: string) => void;
}

export default function AppSidebar({
  items,
  screenSize,
  onSelect,
}: AppSidebarProps) {
  return (
    <Sidebar screenSize={screenSize} component="nav">
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          isActive={item.isActive}
          startIcon={icons[item.id]}
          onClick={() => onSelect(item.id)}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {item.label}
        </SidebarItem>
      ))}
    </Sidebar>
  );
}
