import React, { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { PublicPrivateType } from '@righton/networking';
import { GameQuestionType, CallType } from '../lib/CentralModels';

export default function useCallType(): CallType {
  let gameQuestionType = GameQuestionType.GAME;
  let publicPrivateType = PublicPrivateType.PUBLIC;

  const isValidPublicPrivate = (x: any): x is PublicPrivateType =>
    Object.values(PublicPrivateType).includes(x);

  const parseTypeParam = (raw: string | undefined): PublicPrivateType =>
    raw && isValidPublicPrivate(raw) ? raw : PublicPrivateType.PUBLIC;

  const matchViewGame = useMatch('/games/:type/:gameId');
  const matchLibViewGame = useMatch('/library/games/:type/:gameId');
  const matchCloneGame = useMatch('/clone/:type/:gameId');
  const matchEditGame = useMatch('/edit/:type/:gameId');
  const matchCloneQuestion = useMatch('/clone/question/:type/:questionId');
  const matchEditQuestion = useMatch('/edit/question/:type/:questionId');
  
  const candidates = [
    { match: matchViewGame, gqType: GameQuestionType.GAME },
    { match: matchLibViewGame, gqType: GameQuestionType.GAME },
    { match: matchCloneGame, gqType: GameQuestionType.GAME },
    { match: matchEditGame, gqType: GameQuestionType.GAME },
    { match: matchCloneQuestion, gqType: GameQuestionType.QUESTION },
    { match: matchEditQuestion, gqType: GameQuestionType.QUESTION },
  ] as const;

  const matchRoute = candidates.find(({ match }) => {
    const raw = match?.params.type;
    return raw !== undefined && raw.length > 0;
  });

  if (matchRoute) {
    gameQuestionType = matchRoute.gqType;
    publicPrivateType = parseTypeParam(matchRoute.match!.params.type);
  } 

  return { gameQuestionType, publicPrivateType };
}