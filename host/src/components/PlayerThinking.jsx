import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';
import {
  isNullOrUndefined,
} from '@righton/networking';
import CommonWords from "./CommonWords";
import MistakeSelector from "./MistakeSelector";
import ResponsesGraph from "./Responses/ResponsesGraph";

export default function GameAnswers({
  topWords,
  sortedMistakes,
  setSortedMistakes
}) {
  const classes = useStyles();
  const title = "Player Thinking";
  const subtitle = "Players will be asked about their response to the most popular mistake.";
  const selectedCount = sortedMistakes ? sortedMistakes.filter((mistake) => mistake.isSelected).length : 0;
  const [isTop3Mode, setIsTop3Mode] = useState(true);

  const handleSelectMistake = (index) => {
    setSortedMistakes((prev) => {
      const newMistakes = [...prev];
      newMistakes[index].isSelected = !newMistakes[index].isSelected;
      return newMistakes;
    })
  };
  return(
    <Paper className={classes.background} elevation={10}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
        <ResponsesGraph inputArray={topWords} />
        <CommonWords topWords={topWords}/>
    </Paper>
  );
};

const useStyles = makeStyles(({
  background: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: `16px`,
    backgroundColor: '#08458F', 
    boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.40)',
    gap:16,
    margin: '5%' // will be removed when upgraded 
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    textAlign: 'left',
    fontSize: '24px',
    fontWeight: 700,
    width: '100%'
  },
  subtitle: {
    color: '#FFFFFF',
    fontFamily: 'Rubik',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 400,
  },
  radioButton: {
    color: 'rgba(255, 255, 255, 0.60)',
    '&.Mui-checked': {
      color: '#2196F3',
    },
  },
  radioLabel: {
    color: '#FFFFFF',
  }
}));
