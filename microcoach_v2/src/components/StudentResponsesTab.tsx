import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IQuestionStat } from '../api/Models/IMicroCoachSession';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ErrorBlock,
  ErrorTagChip,
  EvidenceBlock,
  EvidenceSummary,
  EvidenceTitle,
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
  QuestionResponses,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';
import MathText from './MathText';
import MathTypography from './MathTypography';

const optionKey = (questionNumber: number, letter: string) => `${questionNumber}:${letter.toUpperCase()}`;

interface StudentResponsesTabProps {
  misconception: IMicroCoachMisconception;
  questionStats: IQuestionStat[];
  screenSize: ScreenSize;
}

export default function StudentResponsesTab({
  misconception,
  questionStats,
  screenSize,
}: StudentResponsesTabProps) {
  const { t, i18n } = useTranslation();
  const flagged = new Set(misconception.responseEvidence.flatMap((item) =>
    item.answers.map((letter) => optionKey(item.questionNumber, letter)),
  ));
  const explanation = [misconception.description, misconception.consequence]
    .filter(Boolean)
    .join(' ');
  const citedQuestions = misconception.responseEvidence
    .map((item) => questionStats.find((stat) => stat.questionNumber === item.questionNumber))
    .filter((stat): stat is IQuestionStat => !!stat && stat.options.length > 0);
  const answerList = new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' });

  return (
    <>
      {(misconception.responseEvidence.length > 0 || explanation) && (
        <EvidenceSummary>
          {misconception.responseEvidence.length > 0 && (
            <EvidenceBlock>
              <EvidenceTitle>{t('misconceptionModal.evidenceTitle')}</EvidenceTitle>
              <Typography variant="rubikBody">{t('misconceptionModal.evidenceNote')}</Typography>
              <LabelledText>
                {misconception.responseEvidence.map((item) => (
                  <Typography key={item.questionNumber} variant="rubikBody">
                    <Typography component="span" variant="rubikBodyBold">
                      {t('review.questionLabel', { number: item.questionNumber })}:
                    </Typography>
                    {' '}
                    {t('review.evidenceAnswer', {
                      count: item.answers.length,
                      list: answerList.format(item.answers),
                    })}
                  </Typography>
                ))}
              </LabelledText>
            </EvidenceBlock>
          )}
          {explanation && (
            <LabelledText>
              <PanelLabel>{t('misconceptionModal.possibleExplanation')}</PanelLabel>
              <MathTypography variant="rubikBody" text={explanation} />
            </LabelledText>
          )}
        </EvidenceSummary>
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
              <QuestionResponses screenSize={screenSize}>
                <Typography variant="smallBodyText" sx={{ textTransform: 'uppercase' }}>
                  {t('misconceptionModal.howStudentsResponded')}
                </Typography>
                <OptionList>
                  {stat.options.map((option) => {
                    const key = optionKey(stat.questionNumber, option.letter);
                    const isFlagged = flagged.has(key);
                    return (
                      <OptionUnit key={key} isFlagged={isFlagged}>
                        <OptionRow screenSize={screenSize}>
                          <OptionText>
                            <Typography component="span" variant="rubikBodyBold">
                              {option.letter}.
                            </Typography>
                            {option.text && <MathText text={option.text} inline />}
                          </OptionText>
                          {option.isCorrect && (
                            <OptionTag>
                              <CheckIcon fontSize="inherit" />
                              {t('misconceptionModal.correctAnswer')}
                            </OptionTag>
                          )}
                          <OptionPercent>
                            {option.percentChosen != null
                              ? `${Math.round(option.percentChosen * 100)}%`
                              : t('misconceptionModal.percentageUnavailable')}
                          </OptionPercent>
                        </OptionRow>
                      </OptionUnit>
                    );
                  })}
                </OptionList>
              </QuestionResponses>
            </QuestionCard>
          ))
        : misconception.studentWork?.errorsByFrequency.map((bucket) => (
            <ErrorBlock key={`${bucket.errorTag}-${bucket.optionSummary}`}>
              <OptionRow screenSize={screenSize}>
                <OptionText>
                  <MathTypography variant="rubikSubBold" text={bucket.optionSummary} />
                </OptionText>
                <ErrorTagChip>{bucket.errorTag}</ErrorTagChip>
              </OptionRow>
              <MathTypography variant="rubikBody" text={bucket.interpretation} />
              <Typography variant="smallBodyText">
                {t('misconceptionModal.responseCount', { count: bucket.studentCount })}
              </Typography>
            </ErrorBlock>
          ))}
    </>
  );
}
