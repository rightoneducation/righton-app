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

export function sortMistakes (shortAnswerResponses, totalAnswers, isPopularMode, numOfPopularMistakes, setSelectedMistakes){
  console.log(shortAnswerResponses);
  console.log(totalAnswers);
  const extractedMistakes = shortAnswerResponses
    .filter(shortAnswerResponse => !shortAnswerResponse.isCorrect)
    .reduce((mistakes, shortAnswerResponse) => {
      mistakes.push({ 
        answer: shortAnswerResponse.rawAnswer, 
        percent: Math.round((shortAnswerResponse.count/totalAnswers)*100),
        answerType: shortAnswerResponse.answerType,
        answerPrecision: shortAnswerResponse.answerPrecision,
        isSelected: shortAnswerResponse.isSelectedMistake ?? false
      })
      return mistakes;
    }, []);
  let sortedMistakes = extractedMistakes.sort((a, b) => {
    if (a.percent === b.percent) {
      if (a.answerType === 0 && b.answerType === 0){
        const aNum = parseFloat(a.answer);
        const bNum = parseFloat(b.answer);
        console.log(aNum, bNum);
        if (aNum === bNum){
          return a.answerPrecision - b.answerPrecision;
        }
        return parseFloat(a.answer) - parseFloat(b.answer);
      }
      return a.answer.localeCompare(b.answer);
    }
    return b.percent - a.percent;
  });
  if (isPopularMode) {
    for (let i = 0; i < Math.min(sortedMistakes.length, numOfPopularMistakes); i++){
      sortedMistakes[i].isSelected = true;
    }
  }
  console.log(sortedMistakes);
  setSelectedMistakes(sortedMistakes.filter(mistake => mistake.isSelected).map(mistake => mistake.answer));
  return sortedMistakes;
};

export default function FeaturedMistakes({
  shortAnswerResponses,
  totalAnswers,
  onSelectMistake,
  setSelectedMistakes
}) {
  const classes = useStyles();
  const title = "Featured Mistakes";
  const subtitle = "Selected responses will be presented to players as options for popular incorrect answers.";
  const radioButtonText1 = "Use the top 3 answers by popularity";
  const radioButtonText2 = "Manually pick the options";
  const numOfPopularMistakes = 3;
  const [isPopularMode, setIsPopularMode] = useState(true);
  const [sortedMistakes, setSortedMistakes] = useState([]);
  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes){
        onSelectMistake(mistake.answer, true);
        return {...mistake, isSelected: true};
      }
      return {...mistake, isSelected: false};
    })
    setSortedMistakes(resetMistakes);
  };

  const handleModeChange = (event) => {
    if (event.target.value === 'A') {
      resetMistakesToPopular();
      setIsPopularMode(true);
    } else {
      setIsPopularMode(false);
    }
  };

  const handleSelectMistake = (index) => {
    onSelectMistake(sortedMistakes[index].answer, false);
    setSortedMistakes((prev) => {
      const newMistakes = [...prev];
      newMistakes[index].isSelected = !newMistakes[index].isSelected;
      return newMistakes;
    });
  };

  useEffect(() => {
    setSortedMistakes(sortMistakes(shortAnswerResponses, totalAnswers, isPopularMode, numOfPopularMistakes, setSelectedMistakes));
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
                  isPopularMode={isPopularMode} 
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