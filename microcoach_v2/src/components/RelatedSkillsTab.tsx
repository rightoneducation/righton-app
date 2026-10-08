import React from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ISkill, ISkillContext } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import { ccssDomainName } from '../lib/ccssDomains';
import { continueTooltipSx } from '../lib/styledcomponents/UploadStyledComponents';
import {
  ComponentList,
  SkillCard,
  SkillCodeChip,
  SkillColumns,
  SkillDetail,
  SkillRowHead,
  SkillRowList,
  SkillRowSurface,
  SkillTone,
  SkillToggle,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';

// Long enough to read a domain name after a tap; a hover leaves as usual.
const TOOLTIP_TOUCH_HOLD_MS = 3000;

interface SkillRowProps {
  skill: ISkill;
  tone: SkillTone;
  learningComponents?: string[];
}

/**
 * One skill: its code chip (the ⓘ explains the code's domain in plain
 * language, on hover or tap) and short name; the name toggles the full
 * standard text below.
 */
function SkillRow({ skill, tone, learningComponents = [] }: SkillRowProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const domain = skill.domainName ?? ccssDomainName(skill.code);
  const detailId = `skill-${tone}-${skill.code.replace(/[^A-Za-z0-9]/g, '-')}`;
  const Chevron = isOpen ? KeyboardArrowDownIcon : KeyboardArrowRightIcon;

  return (
    <SkillRowSurface tone={tone}>
      <SkillRowHead>
        <SkillCodeChip tone={tone} hasInfo={!!domain}>
          {domain && (
            <Tooltip
              title={domain}
              placement="bottom-start"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={TOOLTIP_TOUCH_HOLD_MS}
              slotProps={continueTooltipSx}
            >
              <IconButton
                size="small"
                aria-label={t('misconceptionModal.domainTooltipLabel', { code: skill.code })}
                sx={{ color: 'inherit' }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          {skill.code}
        </SkillCodeChip>
        <SkillToggle
          aria-expanded={isOpen}
          aria-controls={detailId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{skill.name ?? skill.code}</span>
          <Chevron fontSize="small" />
        </SkillToggle>
      </SkillRowHead>
      <Collapse in={isOpen} unmountOnExit>
        <SkillDetail id={detailId}>
          <span>{skill.description}</span>
          {learningComponents.length > 0 && (
            <ComponentList>
              {learningComponents.map((component) => (
                <li key={component}>{component}</li>
              ))}
            </ComponentList>
          )}
        </SkillDetail>
      </Collapse>
    </SkillRowSurface>
  );
}

interface SkillGroupCardProps {
  title: string;
  tone: SkillTone;
  skills: ISkill[];
}

function SkillGroupCard({ title, tone, skills }: SkillGroupCardProps) {
  const { t } = useTranslation();

  return (
    <SkillCard>
      <Typography
        variant="headingSm"
        component="h3"
        sx={{
          color:
            tone === 'prerequisite'
              ? 'designSystem.status.prerequisite'
              : 'designSystem.surface.atlanticNavy',
        }}
      >
        {title}
      </Typography>
      {skills.length > 0 ? (
        <SkillRowList>
          {skills.map((skill) => (
            <SkillRow key={skill.code} skill={skill} tone={tone} />
          ))}
        </SkillRowList>
      ) : (
        <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.ashyGray' }}>
          {t('misconceptionModal.noneIdentified')}
        </Typography>
      )}
    </SkillCard>
  );
}

interface RelatedSkillsTabProps {
  skillContext: ISkillContext | null;
  screenSize: ScreenSize;
}

/**
 * Related Skills (Figma: Related Skills 1): the focus skill full width, with
 * its learning components inside its expansion, then Prerequisite Gaps beside
 * Upcoming Skills — the "before" and "after" around it.
 */
export default function RelatedSkillsTab({ skillContext, screenSize }: RelatedSkillsTabProps) {
  const { t } = useTranslation();

  if (!skillContext) {
    return (
      <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.ashyGray' }}>
        {t('misconceptionModal.noSkillContext')}
      </Typography>
    );
  }

  const { focusSkill } = skillContext;

  return (
    <>
      <Typography variant="headingSm" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
        {t('misconceptionModal.relatedSkillsIntro')}
      </Typography>

      <SkillCard>
        <Typography variant="headingSm" component="h3" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
          {t('misconceptionModal.focusSkill')}
        </Typography>
        <SkillRow
          skill={focusSkill}
          tone="focus"
          learningComponents={focusSkill.learningComponents}
        />
      </SkillCard>

      <SkillColumns screenSize={screenSize}>
        <SkillGroupCard
          title={t('misconceptionModal.prerequisiteGaps')}
          tone="prerequisite"
          skills={skillContext.prerequisiteGaps.skills}
        />
        <SkillGroupCard
          title={t('misconceptionModal.upcomingSkills')}
          tone="upcoming"
          skills={skillContext.upcomingSkills.skills}
        />
      </SkillColumns>
    </>
  );
}
