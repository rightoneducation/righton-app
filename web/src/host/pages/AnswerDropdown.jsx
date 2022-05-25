import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Arrow from '@mui/icons-material/ArrowBackIosNew';
import { withStyles } from "@material-ui/styles";

const Bar = withStyles({
    colorPrimary: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    barColorPrimary: {
        backgroundColor: 'white'
    },
    bar1Determinate: {
        borderRadius: '3px'
    },
    determinate: {
        borderRadius: '3px',
        width: '70%',
        position: 'absolute',
        top: '32px',
        left: '5px'
    },
})(LinearProgress);

export default function AnswerDropdown(props) {
    const classes = useStyles();
    const numberOfStudents = 24;

    const normalise = (value) => ((value - 0) * 100) / (numberOfStudents - 0);

    return(
        <div className={classes.dropdown}>
            <div className={classes.answer}>
                <p>{props.answer}</p>
                <Bar variant="determinate" value={normalise(props.picks)} />
                <Arrow className={classes.arrow} />
            </div>
            <div className={classes.picks}>
                <p>{props.picks}</p>
            </div>
        </div>
    );
}

const useStyles = makeStyles(themes => ({
    dropdown: {
        width: '311px',
        height: '47px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxSizing: 'border-box',
        borderRadius: '12px',
        position: 'relative',
        marginBottom: '10px',
        '& > *': {
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
        },
    },
    answer: {
        display: 'inline-block',
        width: '75%',
        height: '100%',
        '& > p': {
            position: 'absolute',
            top: '-15px',
            left: '7px',
        },
    },
    picks: {
        display: 'inline-block',
        width: '25%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '0px 10px 10px 0px',
        '& > p': {
            position: 'absolute',
            bottom: '-20px',
            left: '240px'
        },
    },
    arrow: {
        position: 'absolute',
        top: '3px',
        left: '200px',
        transform: 'scaleX(-1)',
        // Temp CSS to show how to transform Arrow icon
        '&:hover': {
            transform: 'rotate(-90deg)'
        }
    },
}));