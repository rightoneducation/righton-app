import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from "@material-ui/core";
import MistakeSelector from "./MistakeSelector";

export default function GameAnswers() {
  const classes = useStyles();
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const mistakesPlaceholder = [
    {answer: "4x^4 - x^3 + 7x^2 - 6x", percent: '44%'},
    {answer: "2x^4 + 6x^2 - 3x", percent: '12%'},
    {answer: "No Idea", percent: '8%'},
    {answer: "x^2 - 4x - 12", percent : '13%'},
    {answer: "4x^4 - x^3 + 4x^2 - 3x", percent: '16%'},
    {answer: "2x^4 + 12x^2 - 9x", percent: '7%'},
  ];
  const [isTop3Mode, setIsTop3Mode] = React.useState(true);
  const handleModeChange = (event) => {
    if (event.target.value === 'A') {
      setIsTop3Mode(true);
    } else {
      setIsTop3Mode(false);
    }
  };
  return(
    <Paper className={classes.background} elevation={10}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
        <RadioGroup defaultValue="A" onChange={handleModeChange}>
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
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box'}}>
          {mistakesPlaceholder.map((mistake, index) => {
            return <MistakeSelector key={index} mistakeText={mistake.answer} mistakePercent={mistake.percent} isTop3Mode={isTop3Mode} />
          })}
        </Box>
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
