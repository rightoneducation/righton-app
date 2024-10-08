import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { ITeam, IHostTeamAnswersResponse } from '@righton/networking';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import AnswerResponsesGraph from './AnswerResponsesGraph';

interface AnswerResponsesCardProps {
  currentTeam: ITeam
  phaseOneResponses: IHostTeamAnswersResponse[]
  otherResponses: IHostTeamAnswersResponse[] | null
  phaseTwoResponses: IHostTeamAnswersResponse[] | null
  isShortAnswerEnabled: boolean
}

export default function AnswerResponsesCard({
  currentTeam,
  phaseOneResponses,
  phaseTwoResponses,
  otherResponses,
  isShortAnswerEnabled
}: AnswerResponsesCardProps) {
  const { t } = useTranslation();
  return(
    <BodyCardStyled>
      <BodyCardContainerStyled>
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.discussanswer.responses')}
        </Typography>
        { phaseOneResponses &&
          <AnswerResponsesGraph isShortAnswerEnabled={isShortAnswerEnabled} phaseOneResponses={phaseOneResponses} phaseTwoResponses={phaseTwoResponses ?? []} otherResponses={otherResponses ?? []} currentTeam={currentTeam}/>
        }
      </BodyCardContainerStyled>
    </BodyCardStyled>
  )
}