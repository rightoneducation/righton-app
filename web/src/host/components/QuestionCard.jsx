import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";
import { Grid, Typography, Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Box, Container, Button } from "@material-ui/core";
import { AddBox, IndeterminateCheckBox, IndeterminateCheckBoxSharp } from '@material-ui/icons';
import "@fontsource/karla";


const useStyles = makeStyles(theme => ({

    fontStyle: {
        paddingBottom: "10px",
        fontFamily: 'Karla',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '16px'
    },
    questionStyle: {
        fontSize: "14px",
        fontWeight: "bold"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        marginTop: "10px",
        fontSize: "10px",
        width: "240px"
    },
    questionCard: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        padding: "0px",
        backgroundColor: "white",
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '309px',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        position: "relative"
    },
    expand: {
        display: "flex",
        width: '100%',
        height: '50px',
        padding: '0px',
        float: 'bottom',
        color: '#1C55FD',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    centerContent: {
        display: "flex",
        justifyContent: "center"
    },
    expandButton: {
        display: "flex",
        justifyContent: "center",
        padding: "0px",
        background: "#F4F4F4"
    }
}))

export default function QuestionCard({ explanation1, explanation2, question, hints }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [stat, setStat] = React.useState(0)
    const hideaway = ['Show More', 'Show Less'];
    const box = [<AddBox />, <IndeterminateCheckBox />];

    const handleExpandClick = () => {
        if (expanded === true) {
            setStat(0)
        }
        if (expanded === false) {
            setStat(1)
        }
        setExpanded(!expanded);
    };
    return (
        <Grid container item xs={12}
            className={classes.centerContent}>
            <Card className={classes.QuestionCard} style={{ borderRadius: "18px" }}>
                <CardContent className={classes.content}>
                    <Typography className={classes.fontStyle}>
                        {explanation1}
                    </Typography>
                    <Typography className={classes.fontStyle}>
                        {explanation2}
                    </Typography>
                    <Typography className={classes.questionStyle}>
                        {question}
                    </Typography>
                </CardContent>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent className={classes.centerContent}>
                        <Typography>
                            {hints}
                        </Typography>
                    </CardContent>
                </Collapse>
                <CardActions disableSpacing className={classes.expandButton}>
                    <Button
                        className={classes.expand}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <p className={classes.centerContent}>
                            {box[stat]}
                            {hideaway[stat]}
                        </p>
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
