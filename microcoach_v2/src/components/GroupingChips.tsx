import React from 'react';
import { useTranslation } from 'react-i18next';
import { GroupingKind, IRunStep } from '../lib/ActivityContentModels';
import {
  GroupingChip,
  GroupingSequence,
  SequenceArrow,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import groupingIndividual from '../images/groupingIndividual.png';
import groupingPairs from '../images/groupingPairs.png';
import groupingTwoGroups from '../images/groupingTwoGroups.png';
import groupingWholeClass from '../images/groupingWholeClass.png';

const GROUPING_ICONS: Record<GroupingKind, string> = {
  INDIVIDUAL: groupingIndividual,
  PAIRS: groupingPairs,
  TWO_GROUPS: groupingTwoGroups,
  WHOLE_CLASS: groupingWholeClass,
};

/** One grouping: its icon and name (Individual, Pairs, Two Groups, Whole Class). */
export function GroupingTag({ kind }: { kind: GroupingKind }) {
  const { t } = useTranslation();

  return (
    <GroupingChip>
      <img src={GROUPING_ICONS[kind]} alt="" />
      {t(`chooseActivity.grouping.${kind}`)}
    </GroupingChip>
  );
}

/**
 * A step's grouping: one chip, or alternatives the teacher chooses between
 * ("Pairs or Whole Class", Math Detective frame).
 */
export function GroupingOptions({ groupings }: { groupings: GroupingKind[] }) {
  const { t } = useTranslation();

  return (
    <>
      {groupings.map((kind, index) => (
        <React.Fragment key={kind}>
          {index > 0 && <SequenceArrow>{t('activityFlow.or')}</SequenceArrow>}
          <GroupingTag kind={kind} />
        </React.Fragment>
      ))}
    </>
  );
}

interface IGroupingRun {
  groupings: GroupingKind[];
  // The step this grouping starts at: unique per run, so it doubles as a key.
  fromStep: number;
}

/**
 * The groupings in run order, a new entry each time the grouping changes:
 * Individual › Pairs › Whole Class. Steps that don't regroup are skipped, as is
 * a step the previous entry already offers: Math Detective's frame reads "Pairs
 * or Whole Class", with no Whole Class after it.
 */
export function groupingSequence(steps: IRunStep[]): IGroupingRun[] {
  return steps.reduce<IGroupingRun[]>((sequence, step, index) => {
    const previous = sequence[sequence.length - 1]?.groupings ?? [];
    const isCovered = step.groupings.every((kind) => previous.includes(kind));
    if (!isCovered) {
      sequence.push({ groupings: step.groupings, fromStep: index });
    }
    return sequence;
  }, []);
}

/**
 * The groupings a run-of-show moves through, in order. Select Activity's
 * cards and Before class both show it.
 */
export function GroupingSequenceChips({ steps }: { steps: IRunStep[] }) {
  const { t } = useTranslation();
  const sequence = groupingSequence(steps);

  if (sequence.length === 0) return null;

  return (
    <GroupingSequence role="group" aria-label={t('chooseActivity.groupingSequence')}>
      {sequence.map(({ groupings, fromStep }, index) => (
        <React.Fragment key={fromStep}>
          {index > 0 && <SequenceArrow aria-hidden>›</SequenceArrow>}
          <GroupingOptions groupings={groupings} />
        </React.Fragment>
      ))}
    </GroupingSequence>
  );
}
