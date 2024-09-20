import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { IHostTeamAnswers, GameSessionState, IPhase, ITeam } from '@righton/networking';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import AnswerResponsesGraph from './AnswerResponsesGraph';

interface AnswerResponsesCardProps {
  sessionData: IHostTeamAnswers
  currentQuestionIndex: number
  currentState: GameSessionState
  currentTeam: ITeam
}

export default function AnswerResponsesCard({
  sessionData,
  currentQuestionIndex,
  currentState,
  currentTeam
}: AnswerResponsesCardProps) {
  const { t } = useTranslation();
  console.log(sessionData);
  const currentQuestion = sessionData.questions[currentQuestionIndex];
  const currentPhase = (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START) ? IPhase.ONE : IPhase.TWO;
  const currentPhaseTeamAnswers = sessionData.questions.find((question) => question.questionId === currentQuestion.questionId)?.[currentPhase] ?? null;
  return(
    <BodyCardStyled>
      <BodyCardContainerStyled>
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.discussanswer.responses')}
        </Typography>
        { currentPhaseTeamAnswers && currentPhaseTeamAnswers.responses &&
          <AnswerResponsesGraph responses={currentPhaseTeamAnswers?.responses} currentTeam={currentTeam}/>
        }
      </BodyCardContainerStyled>
    </BodyCardStyled>
  )
}