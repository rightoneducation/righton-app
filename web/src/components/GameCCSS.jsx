import { useState } from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import Helper from './HelperPopover';

// GameCCSS Function Logic
// If all grade attributes in questions array are the saame, game ccss is that value. if not the value is NULL, empty, or otherwise not there/displayed
// If all domain attributes in questions array are the saame, game ccss is that value. if not it is "Misc" no exceptions
export default function GameCCSS({questions}) {
    const allEqual = (arr) => {
        return arr.every(val => val === arr[0])
    };

    const gameGrade = () => {
        const gradeSet = questions.map((question) => {
            return question.grade;
        });
        if (gradeSet[0] !== null) {
            return allEqual(gradeSet);
        }
        else {
            return false;
        }
    };
    const gameDomain = () => {
        const domainSet = questions.map((question) => {
        return question.domain;
        });
        if (domainSet[0] !== null) {
            return allEqual(domainSet);
        }
        else {
            return false;
        }
    };

    const checker = () => {
        if (gameGrade() === true) {
            if (gameDomain() === true) {
                return questions[0].grade + '.' + questions[0].domain;
            }
            else {
                return questions[0].grade + '.Misc.';
            }
        }
        else {
            if (gameDomain() === true) {
                return questions[0].domain;
            }
            else {
                return 'Misc.';
            }
        }
    }

    const [check, setCheck] = useState(true);
    const [CCSS, setCCSS] = useState(checker);

    const handleCheck = (checkmark) => {
        setCheck(checkmark)
        if (checkmark === false) {
            setCCSS('Mashup');
        }
        else {
            setCCSS(checker);
        }
    }

    return(
        <Grid container item xs={12}>
            <Grid container item xs={7} justifyContent='flex-start'>
                <Typography style={{fontWeight: 400, fontSize: '20px', paddingTop: '9px'}}>
                    CCSS Suggestion: {CCSS}
                </Typography>
                <Helper text='Suggested Common Core Standard code. This is to help teachers accurately find your content.'/>
            </Grid>

            <Grid container item xs={5} justifyContent='flex-end'>
                <FormControlLabel control={<Checkbox checked={check} onClick={() => handleCheck(!check)}/>} label='Standards Aligned?' />
                <Helper text='Only check this box if the content of your game aligns with Common Core Standards'/>
            </Grid>
        </Grid>
    );
}