import React from 'react';
import { ThemeProvider, createTheme, makeStyles } from '@material-ui/core/styles';
import { GameSessionParser } from '@righton/networking';
import MockGameSession from "../mock/MockGameSession.json";
import ResponsesGraph from './ResponsesGraph'; 
import {
  Typography,
} from "@material-ui/core";

export default {
  title: 'ResponsesGraph',
  component: ResponsesGraph,
};

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(MockGameSession);

const Template = args => (
  <ThemeProvider theme={theme}>
    <ResponsesGraph {...args} />
  </ThemeProvider>
);

// Define custom styles using makeStyles
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    // Add any other styles you want to apply here
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Rubik',
    fontSize: '17px',
    // Add any other styles you want to apply here
  },
  titleContainer: {
    marginBottom: '-5%',
    marginTop: '5%',
    // Add any other styles you want to apply here
  },
}));

// Define your custom theme for VictoryChart
const customTheme = {
  axis: {
    style: {
      axis: { stroke: 'rgba(255, 255, 255, 0.5)' },
      grid: { stroke: 'transparent' },
      tickLabels: {
        padding: 20,
        // Add any other styles you want to apply here
      },
    },
  },
  dependentAxis: {
    style: {
      axis: { stroke: 'transparent' },
      grid: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 0.5 },
      tickLabels: { fill: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Rubik', fontWeight: '400' },
      // Add any other styles you want to apply here
    },
  },
  bar: {
    style: {
      data: {
        strokeWidth: 1,
      },
      labels: {
        fontFamily: 'Rubik',
        fontWeight: '400',
        // Add any other styles you want to apply here
      },
    },
  },
};

const theme = createTheme({
  // Your Material-UI theme customization goes here
  // For example, you can define your custom typography, colors, etc.
});

const ResponsesGraphWrapper = (props) => {
  const classes = useStyles(); // Apply the useStyles here
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Number of players
        </Typography>
      </div>
      <ResponsesGraph classes={classes} {...props} />
    </div>
  );
};

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