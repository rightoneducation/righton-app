import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { continueTooltipSx } from '../lib/styledcomponents/UploadStyledComponents';
import MathTypography from './MathTypography';
import useIsCut from '../hooks/useIsCut';

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
  onViewDetails: (misconceptionId: string) => void;
  onSelect: (misconceptionId: string) => void;
  // Side by side at LARGE: the card shares its rows with its neighbours.
  isAligned: boolean;
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
}: MisconceptionCardProps) {
  const { t } = useTranslation();
  const { isRecommendedFocus } = misconception;
  const evidence = formatResponseEvidence(misconception.responseEvidence, t);
  const explanationRef = React.useRef<HTMLDivElement>(null);
  const isExplanationCut = useIsCut(explanationRef);

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
              placement="bottom"
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
          // rev3 PaddingReference: the two-line titles are set 24 apart.
          sx={{ color: 'designSystem.surface.atlanticNavy', lineHeight: '24px' }}
          text={misconception.title}
        />
        <Tooltip
          title={t(`review.prevalenceRange.${misconception.prevalence.level}`)}
          placement="bottom"
          arrow
          slotProps={continueTooltipSx}
        >
          <PrevalenceTag tabIndex={0}>{misconception.prevalence.label}</PrevalenceTag>
        </Tooltip>
      </CardHeading>

      {/* Without evidence the row stays, empty, so the rows below still line up. */}
      {evidence ? (
        <LabelledBlock>
          <BlockLabel>{t('review.responseEvidence')}</BlockLabel>
          <EvidenceLink type="button" onClick={() => onViewDetails(misconception.id)}>
            {evidence}
          </EvidenceLink>
        </LabelledBlock>
      ) : (
        isAligned && <span aria-hidden />
      )}

      <LabelledBlock>
        <BlockLabel>{t('review.possibleExplanation')}</BlockLabel>
        {/* Design note: explanations stop at 5 lines so the cards stay even;
            View details has the rest. Cropped rather than line-clamped: the
            clamp's ellipsis can paint over a KaTeX formula (#2922). The "…"
            sits in the gap above the buttons, so it adds no height. */}
        <Box sx={{ position: 'relative' }}>
          <Box
            ref={explanationRef}
            sx={{ typography: 'rubikBody', maxHeight: '5lh', overflow: 'hidden' }}
          >
            <MathTypography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={[misconception.description, misconception.consequence]
                .filter(Boolean)
                .join(' ')}
            />
          </Box>
          {isExplanationCut && (
            <Typography
              variant="rubikBody"
              aria-hidden
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                color: 'designSystem.surface.atlanticNavy',
              }}
            >
              …
            </Typography>
          )}
        </Box>
      </LabelledBlock>

      <CardActions>
        <CardButton disableElevation onClick={() => onViewDetails(misconception.id)}>
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
