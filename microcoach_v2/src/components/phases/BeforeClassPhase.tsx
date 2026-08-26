import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IActivityPhases } from '../../lib/PipelineModels';
import {
  ContentPanel,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import {
  StudentNamePill,
  NamePillGroup,
} from '../../lib/styledcomponents/MisconceptionModalStyledComponents';

interface Props {
  beforeClass: IActivityPhases['beforeClass'];
}

export default function BeforeClassPhase({ beforeClass }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!beforeClass) {
    return (
      <Typography
        variant="smallBodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('activityDetail.noContent')}
      </Typography>
    );
  }

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <Typography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {beforeClass.title}
      </Typography>

      {beforeClass.checklist.map((item) => (
        <Stack key={item.order} direction="row" spacing={2}>
          <NumberBadge>{item.order}</NumberBadge>
          <Typography
            variant="rubikBody"
            sx={{
              flex: 1,
              minWidth: 0,
              color: 'designSystem.surface.atlanticNavy',
            }}
          >
            {item.title}
          </Typography>
        </Stack>
      ))}

      {beforeClass.groupFormation && (
        <>
          <Typography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {beforeClass.groupFormation.title}
          </Typography>
          <Typography
            variant="smallBodyText"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {beforeClass.groupFormation.guidance}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: `${theme.sizing.space4}px`,
            }}
          >
            {beforeClass.groupFormation.groups.map((group) => (
              <ContentPanel key={group.label}>
                <Typography
                  variant="headingSm"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {group.label}
                </Typography>
                <Typography
                  variant="microLabel"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {group.description}
                </Typography>
                <NamePillGroup>
                  {group.students.map((name) => (
                    <StudentNamePill key={name} tone="understood">
                      {name}
                    </StudentNamePill>
                  ))}
                </NamePillGroup>
              </ContentPanel>
            ))}
          </Box>
        </>
      )}
    </Stack>
  );
}
