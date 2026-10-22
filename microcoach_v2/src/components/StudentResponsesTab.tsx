import React from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IQuestionStat } from '../api/Models/IMicroCoachSession';
import { ScreenSize } from '../lib/MicroCoachModels';
import { formatResponseEvidence } from './MisconceptionCard';
import { displayNames } from '../lib/studentNames';
import {
  ErrorBlock,
  ErrorTagChip,
  LabelledText,
  OptionList,
  OptionPercent,
  OptionRow,
  OptionTag,
  OptionText,
  OptionUnit,
  PanelLabel,
  QuestionCard,
  QuestionHeading,
  ResponderGroup,
  ResponderPill,
  ShowStudentsButton,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';
import MathText from './MathText';
import MathTypography from './MathTypography';

const optionKey = (questionNumber: number, letter: string) => `${questionNumber}:${letter}`;

/**
 * The options a misconception's evidence cites, as `questionNumber:letter`
 * keys. Opening the modal from the evidence link starts with exactly these
 * expanded (Figma: Details 2); View details starts with none.
 */
export function flaggedOptionKeys(misconception: IMicroCoachMisconception): string[] {
  return misconception.responseEvidence.flatMap((item) =>
    item.answers.map((letter) => optionKey(item.questionNumber, letter.toUpperCase())),
  );
}

interface StudentResponsesTabProps {
  misconception: IMicroCoachMisconception;
  questionStats: IQuestionStat[];
  screenSize: ScreenSize;
  initialOpenKeys: string[];
}

/**
 * Student Responses (Figma: Details 1/2): the card's evidence and explanation,
 * then each cited question with every option as one line — what it said, how
 * many chose it — and the names behind a per-option "Show students". The cited
 * options are outlined. Sessions written before per-option data fall back to
 * the pipeline's errors-by-frequency list.
 */
export default function StudentResponsesTab({
  misconception,
  questionStats,
  screenSize,
  initialOpenKeys,
}: StudentResponsesTabProps) {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = React.useState(() => new Set(initialOpenKeys));

  const flagged = new Set(flaggedOptionKeys(misconception));
  const evidence = formatResponseEvidence(misconception.responseEvidence, t);
  const explanation = [misconception.description, misconception.consequence]
    .filter(Boolean)
    .join(' ');
  const citedQuestions = misconception.responseEvidence
    .map((item) => questionStats.find((stat) => stat.questionNumber === item.questionNumber))
    .filter((stat): stat is IQuestionStat => !!stat && stat.options.length > 0);

  // An upload without names still has percentages; with no names anywhere,
  // "Show students" has nothing to show, so it's left out.
  const hasNames = citedQuestions.some((stat) =>
    stat.options.some((option) => option.studentNames.length > 0),
  );
  // Judged across every name in the modal, so a student reads the same way
  // under each question.
  const nameFor = displayNames(
    citedQuestions.flatMap((stat) => stat.options.flatMap((option) => option.studentNames)),
  );

  // Opened from a card's evidence line: the flagged options start open, and
  // the first of them is scrolled into view rather than left below the fold.
  const firstOpenKey = citedQuestions
    .flatMap((stat) =>
      stat.options.map((option) => optionKey(stat.questionNumber, option.letter.toUpperCase())),
    )
    .find((key) => initialOpenKeys.includes(key));
  const firstOpenRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    firstOpenRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  const toggle = (key: string) =>
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <>
      {evidence && (
        <LabelledText>
          <PanelLabel>{t('review.responseEvidence')}</PanelLabel>
          <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {`${evidence}. ${t('misconceptionModal.evidenceNote')}`}
          </Typography>
        </LabelledText>
      )}

      {explanation && (
        <LabelledText>
          <PanelLabel>{t('review.possibleExplanation')}</PanelLabel>
          <MathTypography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={explanation}
          />
        </LabelledText>
      )}

      {citedQuestions.length === 0 && !misconception.studentWork?.errorsByFrequency.length && (
        <Typography variant="smallBodyText" sx={{ color: 'designSystem.surface.ashyGray' }}>
          {t('misconceptionModal.noStudentWork')}
        </Typography>
      )}

      {citedQuestions.length > 0
        ? citedQuestions.map((stat) => (
            <QuestionCard key={stat.questionNumber}>
              <QuestionHeading>
                <span>{t('review.questionLabel', { number: stat.questionNumber })}</span>
                {stat.questionText && <MathText text={stat.questionText} inline />}
              </QuestionHeading>
              <PanelLabel sx={{ typography: 'smallBodyText', color: 'designSystem.background.navyBlue' }}>
                {t('misconceptionModal.howStudentsResponded')}
              </PanelLabel>
              <OptionList>
                {stat.options.map((option) => {
                  const key = optionKey(stat.questionNumber, option.letter.toUpperCase());
                  const isOpen = openKeys.has(key);
                  const isFlagged = flagged.has(key);
                  const panelId = `responders-${key.replace(':', '-')}`;
                  return (
                    <OptionUnit
                      key={key}
                      isFlagged={isFlagged}
                      ref={key === firstOpenKey ? firstOpenRef : undefined}
                    >
                      <OptionRow screenSize={screenSize}>
                        <OptionText>
                          <span>
                            {option.text ? (
                              <>
                                {`${option.letter}. `}
                                <MathText text={option.text} inline />
                              </>
                            ) : (
                              option.letter
                            )}
                          </span>
                          {option.isCorrect && (
                            <OptionTag tone="correct">{t('misconceptionModal.correctAnswer')}</OptionTag>
                          )}
                          {isFlagged && (
                            <OptionTag tone="flagged">{t('misconceptionModal.possibleMistake')}</OptionTag>
                          )}
                        </OptionText>
                        {option.percentChosen != null && (
                          <OptionPercent>{`${Math.round(option.percentChosen * 100)}%`}</OptionPercent>
                        )}
                        {hasNames && (
                        <ShowStudentsButton
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          disabled={option.percentChosen === 0}
                          onClick={() => toggle(key)}
                        >
                          {t(isOpen ? 'misconceptionModal.hideStudents' : 'misconceptionModal.showStudents')}
                          {isOpen ? (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowRightIcon fontSize="small" />
                          )}
                        </ShowStudentsButton>
                        )}
                      </OptionRow>
                      <Collapse in={hasNames && isOpen} unmountOnExit>
                        <ResponderGroup id={panelId}>
                          {option.studentNames.length > 0 ? (
                            option.studentNames.map((name) => (
                              <ResponderPill key={name} title={name}>
                                {nameFor.get(name.trim()) ?? name}
                              </ResponderPill>
                            ))
                          ) : (
                            <Typography variant="microLabel" sx={{ color: 'designSystem.background.navyBlue' }}>
                              {t('misconceptionModal.noStudents')}
                            </Typography>
                          )}
                        </ResponderGroup>
                      </Collapse>
                    </OptionUnit>
                  );
                })}
              </OptionList>
            </QuestionCard>
          ))
        : misconception.studentWork?.errorsByFrequency.map((bucket) => (
            <ErrorBlock key={`${bucket.errorTag}-${bucket.optionSummary}`}>
              <OptionRow screenSize={screenSize}>
                <OptionText>
                  <MathTypography
                    variant="rubikSubBold"
                    sx={{ color: 'designSystem.background.navyBlue' }}
                    text={bucket.optionSummary}
                  />
                </OptionText>
                <ErrorTagChip>{bucket.errorTag}</ErrorTagChip>
              </OptionRow>
              <MathTypography
                variant="smallBodyText"
                sx={{ color: 'designSystem.background.navyBlue' }}
                text={bucket.interpretation}
              />
              <ResponderGroup>
                {bucket.students.map((name) => (
                  <ResponderPill key={name}>{name}</ResponderPill>
                ))}
              </ResponderGroup>
            </ErrorBlock>
          ))}
    </>
  );
}
