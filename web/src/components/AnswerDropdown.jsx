import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, IconButton } from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';
   
export default function AnswerDropdown({answer, explanation, correct}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    return(
        <Grid item xs={12}>
            <Card className={correct ? classes.correctCard : classes.card}>
                <CardContent>
                    <Typography className={classes.answer}>
                        {answer}
                    </Typography>
                
                    <IconButton size='small' className={expanded ? classes.expanded : classes.expand} onClick={() => setExpanded(!expanded)}>
                        <ExpandMore fontSize='large'/>
                    </IconButton>
                </CardContent>

                <Collapse in={expanded}>
                    <CardContent>
                        <Typography className={classes.explanationTitle}>
                            Explanation:
                        </Typography>
                        <Typography className={classes.explanationText}>
                            {explanation}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    card: {
        borderRadius: '10px',
        boxShadow: '1px 4px 10px lightgrey',
        width: '100%',
        marginBottom: '20px',
    },
    correctCard: {
        borderRadius: '10px',
        boxShadow: '1px 4px 10px lightgrey',
        width: '100%',
        border: '5px solid #4DED66',
        marginBottom: '20px',
    },
    answer: {
        fontWeight: 500,
        color: '#384466',
        fontSize: '30px',
        display: 'inline',
    },
    expand: {
        float: 'right',
        color: '#384466',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        float: 'right',
        color: '#384466',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    explanationTitle: {
        fontWeight: 700,
        fontSize: '20px',
        color: '#384466',
    },
    explanationText: {
        fontWeight: 500,
        fontSize: '14px',
        color: '#384466',
    },
  }));