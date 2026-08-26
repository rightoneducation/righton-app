import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { ISidebarItem } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  Sidebar,
  SidebarItem,
  SidebarSelect,
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
  const activeId = items.find((item) => item.isActive)?.id ?? items[0]?.id;

  if (screenSize === ScreenSize.SMALL) {
    return (
      <Sidebar screenSize={screenSize} component="nav">
        <SidebarSelect
          value={activeId}
          onChange={(event) => onSelect(event.target.value)}
        >
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
        </SidebarSelect>
      </Sidebar>
    );
  }

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
