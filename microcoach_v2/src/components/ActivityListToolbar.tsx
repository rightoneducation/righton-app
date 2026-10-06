import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { ActivitySortOrder } from '../lib/ActivityListModels';
import {
  ActivityToolbar,
  AddClassPill,
  SortButton,
  sortMenuPaperSx,
} from '../lib/styledcomponents/ActivityListStyledComponents';

const SORT_OPTIONS: { order: ActivitySortOrder; labelKey: string }[] = [
  { order: ActivitySortOrder.RECENT_FIRST, labelKey: 'thisWeek.sortRecent' },
  { order: ActivitySortOrder.OLDEST_FIRST, labelKey: 'thisWeek.sortOldest' },
  { order: ActivitySortOrder.BY_CLASS, labelKey: 'thisWeek.sortClass' },
];

interface ActivityListToolbarProps {
  sortOrder: ActivitySortOrder;
  onSortChange: (order: ActivitySortOrder) => void;
  onAddClass: () => void;
}

// "Add another class" on the left, Sort on the right. Figma draws the sort
// menu open above the button, right edges aligned.
export default function ActivityListToolbar({
  sortOrder,
  onSortChange,
  onAddClass,
}: ActivityListToolbarProps) {
  const { t } = useTranslation();
  const [sortAnchor, setSortAnchor] = React.useState<HTMLElement | null>(null);

  return (
    <ActivityToolbar>
      <AddClassPill
        disableElevation
        startIcon={<AddIcon />}
        onClick={onAddClass}
      >
        {t('thisWeek.addClass')}
      </AddClassPill>
      <SortButton
        startIcon={<SwapVertIcon />}
        aria-label={t('thisWeek.sortLabel')}
        aria-haspopup="menu"
        aria-expanded={!!sortAnchor}
        onClick={(event) => setSortAnchor(event.currentTarget)}
      >
        {t('thisWeek.sort')}
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
              onSortChange(option.order);
              setSortAnchor(null);
            }}
          >
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </ActivityToolbar>
  );
}
