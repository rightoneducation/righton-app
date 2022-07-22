import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, IconButton, LinearProgress, Box } from "@material-ui/core";
import { ExpandMore, Check } from '@material-ui/icons';

export default function HostAnswerDropdown({questions: {items: questions}, answer, correct, phase2}) {
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

    

    if (phase2) {
        return (
            <Grid>
                <Card className={correct ? classes.correctCardInPhase2 : classes.correctCard} style={{ cursor: 'pointer'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: "80%", "borderTopLeftRadius": "10px", "backgroundColor": "rgba(0, 27, 73, 0.5)", "borderBottomLeftRadius": "10px" }}>
                        <CardContent>
                            <Box sx={{ display: 'flex',  justifyContent: 'space-between' }}>
                                <Typography className={classes.answer}>
                                    {questions.rightAnswer}
                                </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={progress} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>
                        </CardContent>
                        <Collapse in={expanded}>
                            <CardContent>
                                <Typography className={classes.explanationTitle}>
                                    Explanation:
                                </Typography>
                                <Typography className={classes.explanationText}>
                                    Explanation Text
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Box>
                    <Box className={classes.cardAnswers}>
                        <div>
                            <h3>7</h3>
                        </div>
                    </Box>
                </Card>
            </Grid>
        );
    }


    return (
        <Grid>
            <Card className={correct ? classes.correctCardInPhase2 : classes.card} style={{ cursor: 'pointer'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: "80%", "borderTopLeftRadius": "10px", "backgroundColor": "rgba(0, 27, 73, 0.5)", "borderBottomLeftRadius": "10px" }}>
                    <CardContent>
                        <Box sx={{ display: 'flex',  justifyContent: 'space-between' }}>
                            <Typography className={classes.answer}>
                                {answer}
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>
                    </CardContent>
                    <Collapse in={expanded}>
                        <CardContent>
                            <Typography className={classes.explanationTitle}>
                                Explanation:
                            </Typography>
                            <Typography className={classes.explanationText}>
                                Explanation Text
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Box>
                <Box className={classes.cardAnswers}>
                    <div>
                        <h3>7</h3>
                    </div>
                </Box>
            </Card>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    colorPrimary: {
        backgroundColor: "rgba(158, 195, 255, 0.2)",
        width: "100%"
    },
      barColorPrimary: {
        backgroundColor: 'white',
        width: "100%"
    },    
    card: {
        display: "flex",
        flexDirection: "row",
        borderRadius: '10px',
        backgroundColor: "rgba(158, 195, 255, 0.2)",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        width: '80%',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        position: "relative"
    },
    correctCard: {
        display: "flex",
        flexDirection: "row",
        borderRadius: '10px',
        backgroundColor: "rgba(124, 251, 113, 0.5)",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        width: '80%',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        position: "relative"
    },
    correctCardInPhase2: {
        display: "flex",
        flexDirection: "row",
        borderRadius: '10px',
        backgroundColor: "gray",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        width: '80%',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        position: "relative",
        opacity: "0.5"
    },
    cardAnswers: {
        fontWeight: 500,
        color: "white",
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    answer: {
        fontWeight: 600,
        color: 'white',
        fontSize: '17px',
        display: 'inline',
        flexDirection: 'row'
    },
    expand: {
        display: "flex",
        float: 'right',
        color: 'white',
        transform: 'rotate(270deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        float: 'right',
        color: 'white',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    explanationTitle: {
        fontWeight: 700,
        fontSize: '20px',
        color: 'white',
    },
    explanationText: {
        fontWeight: 600,
        fontSize: '14px',
        color: 'white',
    }
}))