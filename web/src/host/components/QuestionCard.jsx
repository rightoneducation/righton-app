import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";
import { Grid, Typography, Card, CardHeader, CardContent, Collapse, IconButton, Box, Container} from "@material-ui/core";
import { AddBox } from '@material-ui/icons';

export default function QuestionCard({explanation1, explanation2, question, hints}) {
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    return (
        <Grid container item xs={12}>
            <Card className={classes.questionCard} onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer'}}>
                <Box>
                    <CardContent className={classes.content}>
                        <Box sx={{ display: 'flex',  flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Typography className={classes.fontStyle}>
                                {explanation1}
                            </Typography>
                            <Typography className={classes.fontStyle}>
                                {explanation2}
                            </Typography>
                            <Typography className={classes.questionStyle}>
                                {question}
                            </Typography>
                            <button className={classes.expandButton}>
                                <AddBox fontSize='200px'/>
                                SHOW MORE
                            </button>
                        </Box>
                    </CardContent>
                    <Collapse in={expanded}>
                        <CardContent>
                            <Typography>
                                {hints}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Box>
            </Card>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    fontStyle: {
        fontSize: "14px",
        paddingBottom: "10px"
    },
    questionStyle: {
        fontSize: "14px",
        fontWeight: "bold"
    },
    expandButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: "20px",
        width: "50%",
        color: "white",
        fontSize: "13px",
        backgroundColor: "blue",
        lineHeight: "25px",
        maxWidth: '130px', maxHeight: '50px', minWidth: '100px', minHeight: '25px'
    },
    content: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        marginTop: "10px",
        fontSize: "10px"
    },
    questionCard: {
        display: "flex",
        flexDirection: "row",
        borderRadius: '18px',
        backgroundColor: "white",
        marginLeft: 'auto',
        marginRight: 'auto',
        width: "350px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        position: "relative"
    },
    question: {
        textAlign: "center",
        margin: "auto"
    },
    expandCard: {
        textAlign: "center",
        justify: "center"
    },
    expand: {
        display: "flex",
        float: 'bottom',
        color: 'red',
        transform: 'rotate(270deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        float: 'bottom',
        color: 'red',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
}))
