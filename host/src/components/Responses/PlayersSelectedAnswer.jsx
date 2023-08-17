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
    percentageText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingTop: '16px',
        paddingLeft: '4px',
    },
    countText: {
        color: '#FFF',
        textAlign: 'right',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '700',
        paddingTop: '16px',
    },
    nameText: {
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '8px'
    },
    numberContainer: {
        display: 'flex',
        alignItems: 'center'
    }
});

const PlayersSelectedAnswer = (props) => {
    const { data, selectedBarIndex, numPlayers, teamsPickedChoices, defaultVictoryPadding } = props;

    const classes = useStyles();

    const rectWidth = 336;
    const rectHeight = 24;

    const rectangleStyle = {
        width: rectWidth,
        height: rectHeight,
        color: 'white',
        backgroundColor: '#063772',
        fontSize: '16px',
        padding: '10px 16px',
        borderRadius: '8px',
        marginBottom: '8px'
    };


    const answerCount = data[selectedBarIndex].answerCount;
    const percentage = (answerCount / numPlayers) * 100;

    // Filter the teamsPickedChoices array based on the answerText
    const selectedBarAnswerText = data[selectedBarIndex].answerText;
    const teamsWithSelectedAnswer = teamsPickedChoices.filter(teamChoices =>
        teamChoices.some(choice => choice.choiceText === selectedBarAnswerText)
    );
    //console.log(teamsPickedChoices);
    //console.log(teamsWithSelectedAnswer);

    // // Console log the team names
    // teamsWithSelectedAnswer.forEach(teamChoices => {
    //     console.log(`Team: ${teamChoices[0].teamName}`);
    // });

    return (
        <div>
            <div className={classes.textContainer}>
                <Typography className={classes.titleText}>
                    Players who picked this answer
                </Typography>
                <div className={classes.numberContainer}>
                    <Typography className={classes.countText}>
                        {answerCount}
                    </Typography>
                    <Typography className={classes.percentageText}>
                        ({Math.round(percentage)}%)
                    </Typography>
                </div>
            </div>
            {teamsWithSelectedAnswer.map((teamChoices, index) => (
                <div key={index} style={rectangleStyle}>
                    <Typography className={classes.nameText}>
                        {teamChoices[0].teamName}
                    </Typography>
                </div>
            ))}
        </div>
    );
};

export default PlayersSelectedAnswer;
