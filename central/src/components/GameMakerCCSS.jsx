import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import GameHelper from './GameHelper';

// GameCCSS Function Logic
// If all grade attributes in questions array are the saame, game ccss is that value. if not the value is NULL, empty, or otherwise not there/displayed
// If all domain attributes in questions array are the same, game ccss is that value. if not it is "Misc" no exceptions
export default function GameCCSS({CCSS, handleCCSS}) {
    const [check, setCheck] = useState(true);
    const handleCheck = (isChecked) => {
        handleCCSS(isChecked);
        setCheck(isChecked);
    }
    
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