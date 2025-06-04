import React, { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { PublicPrivateType } from '@righton/networking';
import { GameQuestionType, CallType } from '../CentralModels';

interface CallTypeProps {
  callTypeMatches: {
    matchViewGame: ReturnType<typeof useMatch>;
    matchLibViewGame: ReturnType<typeof useMatch>;
    matchCloneGame: ReturnType<typeof useMatch>;
    matchEditGame: ReturnType<typeof useMatch>;
    matchCloneQuestion: ReturnType<typeof useMatch>;
    matchEditQuestion: ReturnType<typeof useMatch>;
  }
}

/*
* This function determines the type of API call required based on the current route.
* This is necessary for certain operations where the type is not immediately obvious.
* ex. refreshing the page when clone a game or question (you only have the id, not the type)
* @param {CallTypeProps} callTypeProps - An object containing the matches for various routes.
* @returns {CallType} An object containing the gameQuestionType and publicPrivateType.
*/

// TODO: but this in the search / sort/ filter functions and pass in open tab and gamequestion switch value as well
// we can then return the call type for those functions from here too.

export default function getCallType({
    callTypeMatches
  }: CallTypeProps): CallType {
  let gameQuestionType = GameQuestionType.GAME;
  let publicPrivateType = PublicPrivateType.PUBLIC;
  const {
    matchViewGame,
    matchLibViewGame,
    matchCloneGame,
    matchEditGame,
    matchCloneQuestion,
    matchEditQuestion
  } = callTypeMatches;

  const isValidPublicPrivate = (x: any): x is PublicPrivateType =>
    Object.values(PublicPrivateType).includes(x);

  const parseTypeParam = (raw: string | undefined): PublicPrivateType =>
    raw && isValidPublicPrivate(raw) ? raw : PublicPrivateType.PUBLIC;

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