import React, { useEffect, useState } from "react";
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

export default function FeaturedMistakes({
  shortAnswerResponses,
  totalAnswers,
  handleOnSelectMistake,
}) {
  const classes = useStyles();
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const [isTop3Mode, setIsTop3Mode] = useState(true);
  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const sortMistakes = (shortAnswerResponses, totalAnswers) => {
    const extractedMistakes = shortAnswerResponses.reduce((acc, shortAnswerResponse) => {
      if (!shortAnswerResponse.isCorrect){
        acc.push({
          answer: shortAnswerResponse.value, 
          percent: Math.round((shortAnswerResponse.count/totalAnswers)*100), 
          isSelected: false
        });
      };
      return acc;
    }, []);
    let sortedMistakes = [];
    if (extractedMistakes.length > 0) {
      sortedMistakes = extractedMistakes.sort((a, b) => {
        return b.percent - a.percent;
      });
      if (isTop3Mode) {
        for (let i = 0; i < Math.min(sortedMistakes.length, 3); i++){
          sortedMistakes[i].isSelected = true;
          handleOnSelectMistake(sortedMistakes[i].answer, true);
        }
      }
    }
    return sortedMistakes ?? [];
  };
  const [sortedMistakes, setSortedMistakes] = useState([]);
  const resetMistakesToTop3 = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < 3){
        handleOnSelectMistake(mistake.answer, true);
        return {...mistake, isSelected: true};
      }
      return {...mistake, isSelected: false};
    })
    setSortedMistakes(resetMistakes);
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
    handleOnSelectMistake(sortedMistakes[index].answer, false);
    setSortedMistakes((prev) => {
      const newMistakes = [...prev];
      newMistakes[index].isSelected = !newMistakes[index].isSelected;
      return newMistakes;
    });
  };

  useEffect(() => {
    setSortedMistakes(sortMistakes(shortAnswerResponses, totalAnswers));
  }, [shortAnswerResponses, totalAnswers]);

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
        {sortedMistakes.length > 0 
          ? <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 10, width: '100%'}}>
            {sortedMistakes.map((mistake, index) => {
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
          : <Box sx={{width: '100%'}}>
              <Typography className={classes.subtitle} style={{fontStyle: 'italic', textAlign: 'center'}}>
                Student responses will appear here
              </Typography>
            </Box>
        }
      
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