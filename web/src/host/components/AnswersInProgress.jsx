import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, IconButton, LinearProgress, Box } from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    answerCard: {
        width: '280px',
        height: 'auto',
        marginTop: '12px',
        borderRadius: '17px',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        boxShadow: 'none !important'
    },
    incorrectChoice: {
        width: '100%',
        height: '48px',
        padding: '0px !important',
        borderRadius: '14px 0px 0px 14px',
        background: 'rgba(2, 33, 95, 1)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    correctChoice: {
        width: '100%',
        height: '48px',
        padding: '0px !important',
        borderRadius: '14px 0px 0px 14px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    answer: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '18px',
        lineHeight: '27px',
        color: '#FFFFFF',
        paddingLeft: '10px'
    },
    numAnswered: {
        width: '20%',
        height: '45px',
        paddingBottom: '0px !important',
        paddingTop: '0px !important',
        paddingRight: '0px !important',
        paddingLeft: '10px !important',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontFamily: 'Poppins',
        fontWeight: '900',
        fontSize: '18px',
        lineHeight: '27px',
        color: '#FFFFFF'
    },
    expand: {
        display: "flex",
        float: 'right',
        color: 'white',
        height: '25px',
        width: '25px',
        '& svg': {
            fontSize: '39px'
        },
        marginBottom: '3px',
        padding: '0px !important',
        transform: 'rotate(270deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        float: 'right',
        color: 'white',
        height: '25px',
        width: '25px',
        '& svg': {
            fontSize: '39px'
        },
        marginBottom: '3px',
        padding: '0px !important',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    colorPrimary: {
        backgroundColor: "rgba(158, 195, 255, 0.2)",
        width: "92%",
        borderRadius: '2px'
    },
    barColorPrimary: {
        backgroundColor: 'white',
        width: "92%",
        borderRadius: '2px'
    },
    explanationTitle: {
        fontWeight: '700',
        fontSize: '20px',
        color: 'white',
        fontFamily: 'Poppins',
        fontStyle: 'normal'
    },
    explanationText: {
        fontWeight: '600',
        fontSize: '14px',
        color: 'white',
        fontFamily: 'Poppins',
        fontStyle: 'normal'
    }
}))

export default function HostAnswerDropdown({ answer, explanation, correct }) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Grid style={{ display: "flex", justifyContent: "center" }}>
            <Card className={classes.answerCard} onClick={() => setExpanded(!expanded)}>
                <div style={{ width: '80%' }}>
                    <CardContent className={correct ? classes.correctChoice : classes.incorrectChoice}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingTop: '5px', marginBottom: '3px' }}>
                            <Typography className={classes.answer}>
                                {answer}
                            </Typography>
                            <IconButton size='small' className={expanded ? classes.expanded : classes.expand}>
                                <ExpandMore />
                            </IconButton>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }} />
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
                </div>
                <CardContent className={classes.numAnswered}>
                    <h3>2</h3>
                </CardContent>
            </Card>
        </Grid>
    );
}

