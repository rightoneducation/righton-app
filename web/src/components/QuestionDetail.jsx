import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Divider } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import AnswerDropdown from './AnswerDropdown';

export default function QuestionDetails({gameIndex, gameTitle, questionIndex, question}) {
    const classes = useStyles();
    const history = useHistory();

    const explanation = JSON.parse(JSON.parse(question.instructions));
    const wrongAnswerSet = JSON.parse(JSON.parse(question.wrongAnswers));

    return(
        <Grid container>
            <Grid item xs={12}>
                <Button type="button" onClick={() => history.push(`/games/${gameIndex}`)}>
                    <ArrowBackIcon className={classes.back} />Back to {gameTitle}
                </Button>
            </Grid>

            <Grid container item xs={6}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>
                        Question {Number(questionIndex)+1}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography className={classes.question} gutterBottom>
                        {question.text}
                    </Typography>
                </Grid>

                <Grid container item xs={12} alignItems='center' justify='center'>
                    {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" width={'60%'}/>}
                </Grid>
            </Grid>

            <Grid container item xs={6}>
                <Grid item xs={12}>
                    <Typography className={classes.answerTitle}>
                        Answers
                    </Typography>
                </Grid>

                <AnswerDropdown answer={question.answer} explanation={explanation} correct={true}/>

                <Grid item xs={12}>
                    <Divider className={classes.divider}/>
                </Grid>

                {wrongAnswerSet.map((choice) => {
                    return(
                        <AnswerDropdown answer={choice.wrongAnswer} explanation={choice.reason} correct={false}/>
                    );
                })}
            </Grid>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    back: {
        marginRight: theme.spacing(1),
    },
    title: {
      fontWeight: 700,
      color: '#0075FF',
      textAlign: 'center',
      fontSize: '24px',
    },
    answerTitle: {
        fontWeight: 700,
        color: '#0075FF',
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '10px',
    },
    question: {
        fontWeight: 500,
        color: '#000000',
        textAlign: 'center',
        fontSize: '20px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    image: {
        width: 'auto',
        maxWidth: '70%',
        height: 'auto',
        maxHeight: '90%',
    },
    square: {
        height: '450px',
        width: '450px',
        borderRadius: '10px',
    },
    divider: {
        height: '2px',
        backgroundColor: '#B5B5B5',
        marginBottom: '20px',
    },
  }));