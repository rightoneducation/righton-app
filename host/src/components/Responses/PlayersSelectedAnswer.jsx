import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    titleText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingTop: '16px',
    },
    countText: {
        color: '#FFF',
        textAlign: 'right',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '700',
        paddingTop: '16px',
    },
    textContainer: {
        display: 'flex', // Display elements in a row
        alignItems: 'center', // Align vertically in the center
        justifyContent: 'space-between',
    },
});

const PlayersSelectedAnswer = (props) => {
    const { data, selectedBarIndex, numPlayers, mediumLargePadding, defaultVictoryPadding } = props;

    const classes = useStyles();

    const answerCount = data[selectedBarIndex].answerCount;
    const percentage = (answerCount / numPlayers) * 100;

    return (
        <div className={classes.textContainer}>
            <Typography className={classes.titleText}>
                Players who picked this answer
            </Typography>
            <Typography className={classes.countText}>
                {answerCount} 
            </Typography>
            <Typography className={classes.titleText}>
                ({percentage}%)
            </Typography>
        </div>
    );
};

export default PlayersSelectedAnswer;
