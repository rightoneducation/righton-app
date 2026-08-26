import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { IPlanItem } from '../lib/PipelineModels';
import {
  PlanRow,
  PlanMetaChip,
  PlanMetaSeparator,
  SkillCodePill,
  RowAction,
  RowActionBar,
} from '../lib/styledcomponents/MyPlanStyledComponents';
import removeIcon from '../images/removeIcon.svg';

interface PlanItemRowProps {
  item: IPlanItem;
  onOpenDetails: (item: IPlanItem) => void;
  onMarkDone?: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}

export default function PlanItemRow({
  item,
  onOpenDetails,
  onMarkDone,
  onRemove,
}: PlanItemRowProps) {
  const { t } = useTranslation();

  return (
    <PlanRow
      elevation={item.status === 'COMPLETED' ? 0 : 4}
      isCompleted={item.status === 'COMPLETED'}
    >
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        spacing={1}
        useFlexGap
      >
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {item.activityTitle}
        </Typography>
        <PlanMetaSeparator aria-hidden>|</PlanMetaSeparator>
        <PlanMetaChip>{item.prevalence.label}</PlanMetaChip>
        <PlanMetaChip>{item.grouping.label}</PlanMetaChip>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <SkillCodePill>{item.skillCode}</SkillCodePill>
        <Typography
          variant="rubikSubBold"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {item.misconceptionTitle}
        </Typography>
      </Stack>

      <RowActionBar>
        <RowAction
          tone="quiet"
          disableElevation
          startIcon={<InsertDriveFileOutlinedIcon />}
          onClick={() => onOpenDetails(item)}
        >
          {t('myPlan.openDetails')}
        </RowAction>
        {onMarkDone && (
          <RowAction
            tone="solid"
            disableElevation
            startIcon={<CheckIcon />}
            onClick={() => onMarkDone(item.id)}
          >
            {t('myPlan.markAsDone')}
          </RowAction>
        )}
        {onRemove && (
          <RowAction
            tone="quiet"
            disableElevation
            startIcon={<img src={removeIcon} alt="remove" />}
            onClick={() => onRemove(item.id)}
            sx={{ ml: 'auto' }}
          >
            {t('myPlan.remove')}
          </RowAction>
        )}
      </RowActionBar>
    </PlanRow>
  );
}
