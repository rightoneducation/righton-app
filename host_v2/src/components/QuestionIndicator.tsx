import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameSessionState } from '@righton/networking';
import {
  PhasePillSelected,
  PhasePillUnselected,
  PhasePillUnplayed,
} from '../lib/styledcomponents/QuestionIndicatorComponents';
import QuestionIndicatorContainer from '../lib/styledcomponents/QuestionIndicatorContainer';

interface QuestionIndicatorProps {
  currentState?: GameSessionState;
} // eslint-disable-line

const PHASE_1_STATES = [
  GameSessionState.CHOOSE_CORRECT_ANSWER,
  GameSessionState.PHASE_1_DISCUSS,
  GameSessionState.PHASE_2_START,
];

const PHASE_2_STATES = [
  GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  GameSessionState.PHASE_2_DISCUSS,
];

// selected = phase currently being played, unselected = phase already played,
// unplayed = phase not yet reached (prepare stage, or phase 2 during phase 1)
const pillFor = (pillState: 'selected' | 'unselected' | 'unplayed') => {
  if (pillState === 'selected') return PhasePillSelected;
  if (pillState === 'unselected') return PhasePillUnselected;
  return PhasePillUnplayed;
};

export default function QuestionIndicator({
  currentState,
}: QuestionIndicatorProps) {
  const { t } = useTranslation();

  const isPrepare = currentState === GameSessionState.TEAMS_JOINING;
  const isPhase1 = currentState != null && PHASE_1_STATES.includes(currentState);
  const isPhase2 = currentState != null && PHASE_2_STATES.includes(currentState);

  // pills only show during prepare and the active gameplay states
  if (!isPrepare && !isPhase1 && !isPhase2) {
    return null;
  }

  // phase 1: selected while in phase 1, unselected once phase 2 starts, otherwise unplayed
  const Phase1Pill = pillFor(isPhase1 ? 'selected' : isPhase2 ? 'unselected' : 'unplayed'); // eslint-disable-line
  // phase 2: selected while in phase 2, otherwise not yet played
  const Phase2Pill = pillFor(isPhase2 ? 'selected' : 'unplayed');

  return (
    <QuestionIndicatorContainer>
      <Phase1Pill>{t('gameinprogress.header.phase1pill')}</Phase1Pill>
      <Phase2Pill>{t('gameinprogress.header.phase2pill')}</Phase2Pill>
    </QuestionIndicatorContainer>
  );
}
