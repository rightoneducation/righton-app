import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { ActivitySortOrder } from '../lib/ActivityListModels';
import {
  SortButton,
  sortMenuPaperSx,
} from '../lib/styledcomponents/ActivityListStyledComponents';

// By class is the only option offered; the page opens grouped by week,
// newest first (ActivitySortOrder.RECENT_FIRST).
const SORT_OPTIONS: { order: ActivitySortOrder; labelKey: string }[] = [
  { order: ActivitySortOrder.BY_CLASS, labelKey: 'pastActivities.sortClass' },
];

interface ActivitySortMenuProps {
  sortOrder: ActivitySortOrder;
  onSortChange: (order: ActivitySortOrder) => void;
}

// Past Activities' Sort control. Figma (v2 Dashboard3) draws the menu open
// above the button, right edges aligned.
export default function ActivitySortMenu({
  sortOrder,
  onSortChange,
}: ActivitySortMenuProps) {
  const { t } = useTranslation();
  const [sortAnchor, setSortAnchor] = React.useState<HTMLElement | null>(null);

  return (
    <>
      <SortButton
        startIcon={<SwapVertIcon />}
        aria-label={t('pastActivities.sortLabel')}
        aria-haspopup="menu"
        aria-expanded={!!sortAnchor}
        onClick={(event) => setSortAnchor(event.currentTarget)}
      >
        {t('pastActivities.sort')}
      </SortButton>
      <Menu
        anchorEl={sortAnchor}
        open={!!sortAnchor}
        onClose={() => setSortAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{ paper: { sx: sortMenuPaperSx } }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.order}
            selected={option.order === sortOrder}
            onClick={() => {
              // Picking the active option turns it off, back to the default
              // week view; with one option there is no other way back.
              onSortChange(
                option.order === sortOrder
                  ? ActivitySortOrder.RECENT_FIRST
                  : option.order,
              );
              setSortAnchor(null);
            }}
          >
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
