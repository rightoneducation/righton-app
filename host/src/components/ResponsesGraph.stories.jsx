import React from 'react';
import { GameSessionParser } from '@righton/networking';
import MockGameSession from "../mock/MockGameSession.json";
import ResponsesGraph from './ResponsesGraph'; 
import '@material-ui/core/styles/';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Rubik',
    fontSize: '17px'
  },
  titleContainer: {
    marginBottom: '-5%',
    marginTop: '5%',
  },
});

const customTheme = {
  axis: {
    style: {
      axis: { stroke: 'rgba(255, 255, 255, 0.5)' },
      grid: { stroke: 'transparent' },
      tickLabels: {
        padding: 20,
      },
    },
  },
  dependentAxis: {
    style: {
      axis: { stroke: 'transparent' },
      grid: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 0.5 },
      tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400' },
    },
  },
  bar: {
    style: {
      data: {
        fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? 'transparent' : '#FFF'),
        stroke: ({ datum, index }) => (index === reversedResponses.length - 1 && datum.answerCount !== 0 ? '#FFF' : 'transparent'),
        strokeWidth: 1,
      },
      labels: {
        fill: ({ datum, index }) => (index === reversedResponses.length - 1 ? '#FFF' : '#384466'),
        fontFamily: 'Rubik',
        fontWeight: '400',
      },
    },
  },
};

const withStyles = (Story) => {
  const classes = useStyles();
  const theme = createMuiTheme(customTheme);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

export const decorators = [withStyles];


export default {
  title: 'ResponsesGraph',
  component: ResponsesGraph,
};

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(MockGameSession);

const Template = args => <ResponsesGraph {...args} />;

export const differentAnswers = Template.bind({});
differentAnswers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 10 },
    { label: 'B', count: 15 },
    { label: 'C', count: 5 },
    { label: 'D', count: 20 },
  ],
  numPlayers: 55,
  totalAnswers: 50,
  currentState: 'CHOOSE_CORRECT_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 1,
};

export const sameAnswer = Template.bind({});
sameAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 10 },
    { label: 'D', count: 0 },
  ],
  numPlayers: 10,
  totalAnswers: 10,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const oneAnswer = Template.bind({});
oneAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 1,
  totalAnswers: 1,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const noAnswer = Template.bind({});
noAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 0 },
  ],
  numPlayers: 10,
  totalAnswers: 0,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const lessThanFivePlayers = Template.bind({});
lessThanFivePlayers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 3 },
    { label: 'C', count: 0 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 4,
  totalAnswers: 4,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const fivePlayers = Template.bind({});
fivePlayers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 3 },
    { label: 'C', count: 1 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 5,
  totalAnswers: 5,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};