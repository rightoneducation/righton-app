import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button
} from "@material-ui/core";
import { isNullOrUndefined } from "@righton/networking";
import MistakeSelector from "./MistakeSelector";

export default function FeaturedMistakes({
  shortAnswerResponses,
  totalAnswers,
  handleOnSelectMistake,
  handleProcessAnswersClick,
  handleModelChange,
  numPlayers,
  gptAnswers,
  gptModel
}) {
  const numSubmissions = shortAnswerResponses.map((response) => response.teams).reduce((acc, response) => {
    return acc + response.length;
  }, 0);
  const submittedAnswers = shortAnswerResponses
    .map((response) => { 
     return {answer: response.value, team: response.teams}
    })
    .filter((response) => response.team.length > 0);
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
          isSelected: shortAnswerResponse.isSelectedMistake ?? false
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
    handleOnSelectMistake(gptAnswers[index].answer, false);
  };

  useEffect(() => {
    setSortedMistakes(sortMistakes(shortAnswerResponses, totalAnswers));
  }, [shortAnswerResponses, totalAnswers]);
  return(
    <Paper className={classes.background} elevation={0}>
       <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Typography className={classes.title}>{title}</Typography>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            row
            value={gptModel}
            onChange={() => handleModelChange()}
          >
            <FormControlLabel value="gpt-3.5-turbo" control={<Radio
            color="default"
            />} label="GPT-3.5" />
            <FormControlLabel value="gpt-4" control={<Radio color="default" />} label="GPT-4" />
          </RadioGroup>
        </Box>
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
        {!isNullOrUndefined(gptAnswers)  
          ? <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 10, width: '100%'}}>
            {gptAnswers.map((answer, index) => {
                return <MistakeSelector 
                  key={index} 
                  mistakeText={answer.answerText} 
                  mistakePercent={`${(answer.teamsCount/numPlayers)*100}`} 
                  isTop3Mode={isTop3Mode} 
                  isSelected={answer.isSelected} 
                  mistakeIndex={index}
                  handleSelectMistake={handleSelectMistake} 
                  style={{width:'100%'}}  
                />
              })}
            </Box>
          : <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%'}}>
              <Typography className={classes.subtitle} style={{fontStyle: 'italic', textAlign: 'center'}}>
                {numSubmissions} / {numPlayers} have responded
              </Typography>
              <Button
                className={classes.button}
                onClick={() => handleProcessAnswersClick(submittedAnswers)}
               >
                Process Answers
              </Button>
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
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    boxSizing: 'border-box',
    // boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.40)',
    gap:16,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    textAlign: 'left',
    fontSize: '24px',
    fontWeight: 700,
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
  },
  button: {
    border: '4px solid #159EFA',
    background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
    borderRadius: '34px',
    width: '200px',
    height: '24px',
    color: 'white',
    fontSize: '15px',
    bottom: '0',
    fontWeight: '700',
    lineHeight: '30px',
    textTransform: 'none',
  },
}));