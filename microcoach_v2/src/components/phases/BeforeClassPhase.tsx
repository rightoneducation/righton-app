import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import MathTypography from '../MathTypography';
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
      <MathTypography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
        text={beforeClass.title}
      />

      {beforeClass.checklist.map((item) => (
        <Stack key={item.order} direction="row" spacing={2}>
          <NumberBadge>{item.order}</NumberBadge>
          {/* Same title/body treatment StepListPhase gives facilitation and
              discussion. The generator splits a prep step into a short label
              plus the instruction; the mock writes the whole instruction into
              `title` and carries no body, so the title is only weighted when
              there is a body under it to be a label for. */}
          <Stack
            spacing={`${theme.sizing.space0}px`}
            sx={{ flex: 1, minWidth: 0 }}
          >
            <MathTypography
              variant="rubikBody"
              sx={{
                fontWeight: item.body ? 500 : undefined,
                color: 'designSystem.surface.atlanticNavy',
              }}
              text={item.title}
            />
            {item.body && (
              <MathTypography
                variant="rubikBody"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
                text={item.body}
              />
            )}
          </Stack>
        </Stack>
      ))}

      {beforeClass.groupFormation && (
        <>
          <MathTypography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={beforeClass.groupFormation.title}
          />
          <MathTypography
            variant="smallBodyText"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={beforeClass.groupFormation.guidance}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: `${theme.sizing.space4}px`,
            }}
          >
            {beforeClass.groupFormation.groups.map((group) => (
              <ContentPanel key={group.label}>
                <MathTypography
                  variant="headingSm"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  text={group.label}
                />
                <MathTypography
                  variant="microLabel"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  text={group.description}
                />
                <NamePillGroup>
                  {/* Students are assigned after generation, by
                      injectStudentsIntoGroups in seed/cli/generate.ts. A path that
                      skips injection should render an empty group rather than throw. */}
                  {(group.students ?? []).map((name) => (
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
