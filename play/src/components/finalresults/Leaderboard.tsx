import React, { useState } from 'react';
import {
  GameSessionState,
  IGameSession,
  ITeam,
  ITeamAnswer,
  IQuestion,
  IChoice,
  ModelHelper,
  isNullOrUndefined,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../HeaderContent';
import ResultsCard from '../ResultsCard';
import FooterContent from '../FooterContent';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaPhaseResultsStyled } from '../../lib/styledcomponents/layout/BodyContentAreaStyled';
import FooterStackContainerStyled from '../../lib/styledcomponents/layout/FooterStackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';

interface LeaderboardProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  teamId: string;
  score: number;
}

export default function Leaderboard({
  teams,
  currentState,
  teamAvatar,
  teamId,
  score,
}: LeaderboardProps) {
  const currentTeam = teams?.find((team) => team.id === teamId);

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={() => {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <BodyContentAreaPhaseResultsStyled container>
          Sup
        </BodyContentAreaPhaseResultsStyled>
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={0}
          score={score}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
