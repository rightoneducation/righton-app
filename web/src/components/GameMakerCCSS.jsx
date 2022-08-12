import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import GameHelper from './GameHelper';

// GameCCSS Function Logic
// If all grade attributes in questions array are the saame, game ccss is that value. if not the value is NULL, empty, or otherwise not there/displayed
// If all domain attributes in questions array are the saame, game ccss is that value. if not it is "Misc" no exceptions
export default function GameCCSS({questions, handleCCSS, currentGameGrade}) {
    const allEqual = (arr) => {
        return arr.every(val => val === arr[0])
    };

    const gameGrade = () => {
        const gradeSet = questions.map((question) => {
          return question.grade;
        });
        if (gradeSet[0] !== null && allEqual(gradeSet)) {
          return questions[0].grade;
        }
        else {
          return 'Misc';
        }
    };
    const gameDomain = () => {
        const domainSet = questions.map((question) => {
        return question.domain;
        });
        if (domainSet[0] !== null && allEqual(domainSet)) {
          return questions[0].domain;
        }
        else {
          return 'Misc';
        }
    };
    const gameCluster = () => {
      const clusterSet = questions.map((question) => {
      return question.cluster;
      });
      if (clusterSet[0] !== null && allEqual(clusterSet)) {
          return questions[0].cluster;
      }
      else {
          return 'Misc';
      }
  };

    const gameStandard = () => {
      const standardSet = questions.map((question) => {
      return question.standard;
      });
      if (standardSet[0] !== null && allEqual(standardSet)) {
        return questions[0].standard;
      }
      else {
        return 'Misc';
      }
  };

    const checker = () => {
        if (questions === []) {
            return 'N/A'
        }
        if (gameGrade() === 'Misc' && gameDomain() === 'Misc' && gameCluster() === 'Misc' && gameStandard() === 'Misc') {
          handleCCSS('Mashup', 'Misc', 'Misc', 'Misc');
          return 'Mashup';
        }
        handleCCSS(gameGrade(), gameDomain(), gameCluster(), gameStandard());
        return gameGrade() + '.' + gameDomain() + '.' + gameCluster() + '.' + gameStandard();
    }

    const [check, setCheck] = useState(
    () => {
        if (currentGameGrade === 'Mashup') {
            return false;
        }
        else {
            return true;
        }
    });
    const [CCSS, setCCSS] = useState(checker);

    const handleCheck = (checkmark) => {
        setCheck(checkmark)
        if (checkmark === false) {
            setCCSS('Mashup');
            handleCCSS('Mashup', '');
        }
        else {
            setCCSS(checker);
        }
    }
    
    useEffect(() => {
        if (currentGameGrade === 'Mashup') {
            handleCheck(false)
        }
    }, [])

    return(
        <Grid container item xs={12}>
            <Grid container item xs={7} justifyContent='flex-start'>
                <Typography style={{fontWeight: 400, fontSize: '20px', paddingTop: '9px'}}>
                    CCSS Suggestion: {CCSS}
                </Typography>
                <GameHelper text='Suggested Common Core Standard code. This is to help teachers accurately find your content.'/>
            </Grid>

            <Grid container item xs={5} justifyContent='flex-end'>
                <FormControlLabel control={<Checkbox checked={check} onClick={() => handleCheck(!check)}/>} label='Standards Aligned?' style={{marginRight: '0px'}} />
                <GameHelper text='Only check this box if the content of your game aligns with Common Core Standards.'/>
            </Grid>
        </Grid>
    );
}