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
import MistakeSelector from "./MistakeSelector";

export default function GameAnswers() {
  const classes = useStyles();
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const [sortedMistakesPlaceholder, setSortedMistakesPlaceholder] = useState([
    {answer: "4x^4 - x^3 + 7x^2 - 6x", percent: '44%', isSelected: true},
    {answer: "2x^4 + 6x^2 - 3x", percent: '16%', isSelected: true},
    {answer: "No Idea", percent: '13%', isSelected: true},
    {answer: "x^2 - 4x - 12", percent : '12%', isSelected: false},
    {answer: "4x^4 - x^3 + 4x^2 - 3x", percent: '8%', isSelected: false},
    {answer: "2x^4 + 12x^2 - 9x", percent: '7%', isSelected: false},
  ]);
  const [isTop3Mode, setIsTop3Mode] = useState(true);
  const resetMistakesToTop3 = () => {
    const resetMistakes = sortedMistakesPlaceholder.map((mistake, index) => {
      if (index < 3){
        return {...mistake, isSelected: true};
      }
      return {...mistake, isSelected: false};
    })
    setSortedMistakesPlaceholder(resetMistakes);
  };

  const handleModeChange = (event) => {
    if (event.target.value === 'A') {
      resetMistakesToTop3();
      setIsTop3Mode(true);
    } else {
      setIsTop3Mode(false);
    }
  };

  const handleSelectMistake = (index) => {
    setSortedMistakesPlaceholder((prev) => {
      const newMistakes = [...prev];
      newMistakes[index].isSelected = !newMistakes[index].isSelected;
      return newMistakes;
    })
  };
  return(
    <Paper className={classes.background} elevation={0}>
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
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 10, width: '100%'}}>
          {sortedMistakesPlaceholder.map((mistake, index) => {
            return <MistakeSelector 
              key={index} 
              mistakeText={mistake.answer} 
              mistakePercent={mistake.percent} 
              isTop3Mode={isTop3Mode} 
              isSelected={mistake.isSelected} 
              mistakeIndex={index}
              handleSelectMistake={handleSelectMistake} 
              style={{width:'100%'}}  
            />
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
    backgroundColor: 'rgba(0,0,0,0)', 
    // boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.40)',
    gap:16,
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