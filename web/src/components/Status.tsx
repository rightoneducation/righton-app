import React from "react";
import { Score, JoinScreen, QuestionScreen, ScorecardScreen } from '../API';

const Join = ({ gameCode }: JoinScreen) => {
  return (
    <form>
      <p>{gameCode}</p>
      <input type="text" />
      <br />
      <br />
      <input type="submit" onClick={() => {}} />
    </form>
  );
};

const Question = ({ answers }: QuestionScreen) => {
  const answersList = answers.map((answer) => (
    <button onClick={() => {}}>{answer}</button>
  ));

  return <ul>{answersList}</ul>;
};

const Scorecard = ({ scores }: ScorecardScreen) => {
  const scoreList = (scores as Score[]).map((score: Score) => (
    <li>
      {score.teamName}: {score.teamScore}
    </li>
  ));

  return <ul>{scoreList}</ul>;
};

const PageMap = {
  JoinScreen: Join,
  QuestionScreen: Question,
  ScorecardScreen: Scorecard,
};

export default function StatusPage({ screen }: any) {
  // @ts-ignore
  const PageComponent = PageMap[screen.screenID] as any; // TODO: fix typing

  return (
    <div>
      <h1>{screen.title}</h1>
      <h3>{screen.text}</h3>
      <PageComponent {...screen} />
    </div>
  );
};