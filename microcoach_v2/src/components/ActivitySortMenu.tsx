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

// rev2 PastActivities: the page opens newest first.
const SORT_OPTIONS: { order: ActivitySortOrder; labelKey: string }[] = [
  {
    order: ActivitySortOrder.RECENT_FIRST,
    labelKey: 'pastActivities.sortNewest',
  },
  {
    order: ActivitySortOrder.OLDEST_FIRST,
    labelKey: 'pastActivities.sortOldest',
  },
  { order: ActivitySortOrder.BY_CLASS, labelKey: 'pastActivities.sortClass' },
];

interface ActivitySortMenuProps {
  sortOrder: ActivitySortOrder;
  onSortChange: (order: ActivitySortOrder) => void;
}

// Past Activities' Sort control. Figma (rev2 PastActivities) draws the menu open
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
        // A menu needn't lock the page: locking hid the scrollbar and shifted
        // the page while it was open (dev QA 2026-10-30).
        disableScrollLock
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{ paper: { sx: sortMenuPaperSx } }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.order}
            selected={option.order === sortOrder}
            onClick={() => {
              onSortChange(option.order);
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
