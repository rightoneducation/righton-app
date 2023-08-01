import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import MistakeSelector from "./MistakeSelector";

export default function GameAnswers() {
  const classes = useStyles();
  const MistakeSelectorType = { // TODO: conver to enum when upgrading
    TOP3,
    MANUAL
  };
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const mistakesPlaceholder = [
    "4x^4 - x^3 + 7x^2 - 6x",
    "2x^4 + 6x^2 - 3x",
    "No Idea",
    "x^2 - 4x - 12",
    "4x^4 - x^3 + 4x^2 - 3x",
    "2x^4 + 12x^2 - 9x"
  ];

  return(
    <Paper className={classes.background} elevation={10}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
        <RadioGroup defaultValue="A">
          <FormControlLabel 
            className={classes.radioLabel} 
            value="A" 
            control={<Radio className={classes.radioButton} />} 
            label={radioButtonText1} 
          />
          <FormControlLabel 
            className={classes.radioLabel} 
            value="B" 
            control={<Radio className={classes.radioButton} />} 
            label={radioButtonText2} 
          />
        </RadioGroup>
        {mistakesPlaceholder.forEach((mistake, index) => {
          return <MistakeSelector key={index} mistakeText={mistake} MistakeSelectorType={MistakeSelectorType} />
        })}
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
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
