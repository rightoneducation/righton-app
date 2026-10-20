import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  IMicroCoachMisconception,
  IResponseEvidence,
} from '../api/Models/IMicroCoachMisconception';
import { Translate } from '../lib/activityMarks';
import {
  BadgeRow,
  BlockLabel,
  CardActions,
  CardBadge,
  CardButton,
  CardHeading,
  EvidenceLink,
  LabelledBlock,
  MisconceptionCardSurface,
  PrevalenceTag,
  TagRow,
  HighestFrequencyTag,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { continueTooltipSx } from '../lib/styledcomponents/UploadStyledComponents';
import MathTypography from './MathTypography';

/** "Q2, Answers C & D; Q4, Answer A" — one clause per question. */
export function formatResponseEvidence(
  evidence: IResponseEvidence[],
  t: Translate,
): string {
  return evidence
    .map((item) => {
      const list =
        item.answers.length > 1
          ? `${item.answers.slice(0, -1).join(', ')} ${t('review.and')} ${
              item.answers[item.answers.length - 1]
            }`
          : item.answers.join('');
      return t('review.evidenceQuestion', {
        number: item.questionNumber,
        answers: t('review.evidenceAnswer', { count: item.answers.length, list }),
      });
    })
    .join('; ');
}

interface MisconceptionCardProps {
  misconception: IMicroCoachMisconception;
  // fromEvidence: opened from the evidence line, so the modal starts with the
  // cited options' students shown.
  onViewDetails: (misconceptionId: string, fromEvidence: boolean) => void;
  onSelect: (misconceptionId: string) => void;
  // Side by side at LARGE: the card shares its rows with its neighbours.
  isAligned: boolean;
  // Of the cards shown, this one reaches the most students (rubric:
  // selection.highestFrequency). A tag only; the order is the rubric's.
  isHighestFrequency?: boolean;
}

/**
 * One surfaced misconception (Figma: Misconceptions frames). The recommended
 * one carries a filled badge and an ⓘ explaining the choice; the student-count
 * chip shows its range on hover. "Why it surfaced" and "possible explanation"
 * are merged (both are the model's hypothesis), from description + consequence.
 */
export default function MisconceptionCard({
  misconception,
  onViewDetails,
  onSelect,
  isAligned,
  isHighestFrequency = false,
}: MisconceptionCardProps) {
  const { t } = useTranslation();
  const { isRecommendedFocus } = misconception;
  const evidence = formatResponseEvidence(misconception.responseEvidence, t);

  return (
    <MisconceptionCardSurface isAligned={isAligned}>
      <CardHeading isAligned={isAligned}>
        <BadgeRow>
          <CardBadge isFocus={isRecommendedFocus}>
            {t(isRecommendedFocus ? 'review.recommendedFocus' : 'review.additional')}
          </CardBadge>
          {isRecommendedFocus && (
            <Tooltip
              title={t('review.focusTooltip')}
              placement="bottom-start"
              arrow
              slotProps={continueTooltipSx}
            >
              <IconButton
                size="small"
                aria-label={t('review.focusTooltipLabel')}
                sx={{ color: 'designSystem.surface.black' }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </BadgeRow>
        <MathTypography
          variant="headingMd"
          component="h2"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={misconception.title}
        />
        <TagRow>
          <Tooltip
            title={t(`review.prevalenceRange.${misconception.prevalence.level}`)}
            placement="bottom"
            arrow
            slotProps={continueTooltipSx}
          >
            <PrevalenceTag tabIndex={0}>{misconception.prevalence.label}</PrevalenceTag>
          </Tooltip>
          {isHighestFrequency && (
            <Tooltip
              title={t('review.highestFrequencyTooltip')}
              placement="bottom"
              arrow
              slotProps={continueTooltipSx}
            >
              <HighestFrequencyTag tabIndex={0}>{t('review.highestFrequency')}</HighestFrequencyTag>
            </Tooltip>
          )}
        </TagRow>
      </CardHeading>

      {/* Without evidence the row stays, empty, so the rows below still line up. */}
      {evidence ? (
        <LabelledBlock>
          <BlockLabel>{t('review.responseEvidence')}</BlockLabel>
          <EvidenceLink type="button" onClick={() => onViewDetails(misconception.id, true)}>
            {evidence}
          </EvidenceLink>
        </LabelledBlock>
      ) : (
        isAligned && <span aria-hidden />
      )}

      <LabelledBlock>
        <BlockLabel>{t('review.possibleExplanation')}</BlockLabel>
        <MathTypography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={[misconception.description, misconception.consequence]
            .filter(Boolean)
            .join(' ')}
        />
      </LabelledBlock>

      <CardActions>
        <CardButton disableElevation onClick={() => onViewDetails(misconception.id, false)}>
          {t('review.viewDetails')}
        </CardButton>
        <CardButton
          isPrimary
          disableElevation
          onClick={() => onSelect(misconception.id)}
        >
          {t('review.select')}
        </CardButton>
      </CardActions>
    </MisconceptionCardSurface>
  );
}
