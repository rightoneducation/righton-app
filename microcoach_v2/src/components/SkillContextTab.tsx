import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ISkill, ISkillContext } from '../lib/PipelineModels';
import {
  SkillBlock,
  SkillCodePill,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';

type SkillTone = 'focus' | 'prerequisite' | 'upcoming';

interface SkillRowProps {
  skill: ISkill;
  tone: SkillTone;
}

function SkillRow({ skill, tone }: SkillRowProps) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={`${theme.sizing.space2}px`}
    >
      <SkillCodePill tone={tone}>{skill.code}</SkillCodePill>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {skill.name && (
          <Typography
            variant="rubikSubBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {skill.name}
          </Typography>
        )}
        <Typography
          variant="smallBodyText"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {skill.description}
        </Typography>
      </Box>
    </Stack>
  );
}

interface SkillContextTabProps {
  skillContext: ISkillContext | null;
}

export default function SkillContextTab({
  skillContext,
}: SkillContextTabProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!skillContext) {
    return (
      <Typography
        variant="smallBodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('misconceptionModal.noSkillContext')}
      </Typography>
    );
  }

  const groups: { tone: SkillTone; label: string; skills: ISkill[] }[] = [
    {
      tone: 'focus',
      label: skillContext.focusSkill.groupLabel,
      skills: [skillContext.focusSkill],
    },
    {
      tone: 'prerequisite',
      label: skillContext.prerequisiteGaps.groupLabel,
      skills: skillContext.prerequisiteGaps.skills,
    },
    {
      tone: 'upcoming',
      label: skillContext.upcomingSkills.groupLabel,
      skills: skillContext.upcomingSkills.skills,
    },
  ];

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      {groups.map((group) => (
        <SkillBlock key={group.tone} tone={group.tone}>
          <Typography
            variant="headingSm"
            sx={{
              color:
                group.tone === 'prerequisite'
                  ? 'designSystem.status.prerequisite'
                  : 'designSystem.surface.atlanticNavy',
            }}
          >
            {group.label}
          </Typography>
          {group.skills.map((skill) => (
            <SkillRow key={skill.code} skill={skill} tone={group.tone} />
          ))}
        </SkillBlock>
      ))}
    </Stack>
  );
}
