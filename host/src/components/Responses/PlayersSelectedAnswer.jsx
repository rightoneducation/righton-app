import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { ModelHelper } from '@righton/networking';

const useStyles = makeStyles({
    titleText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingTop: '16px',
        opacity: props => (props.statePosition === 6 ? 0.5 : 1),
    },
    percentageText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingTop: '16px',
        paddingLeft: '4px',
        opacity: props => (props.statePosition === 6 ? 0.5 : 1),
    },
    countText: {
        color: '#FFF',
        textAlign: 'right',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '700',
        paddingTop: '16px',
        opacity: props => (props.statePosition === 6 ? 0.5 : 1),
    },
    nameText: {
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
    },
    phaseTwoTitleText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
    },
    phaseTwoPercentageText: {
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingLeft: '4px',
    },
    phaseTwoCountText: {
        color: '#FFF',
        textAlign: 'right',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '700',
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
    },
    phaseTwoNumberContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop:'-20px'
    }
});
const PlayersSelectedAnswer = (props) => {
    const { questions, teams, data, selectedBarIndex, numPlayers, teamsPickedChoices, statePosition } = props;

    const classes = useStyles(props);

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

    const selectedBarAnswerText = data[selectedBarIndex].answerText;
    const teamsWithSelectedAnswer = teamsPickedChoices.filter(teamChoices =>
        teamChoices.choiceText === selectedBarAnswerText
    );
    
    const percentageFromPhaseOne = ModelHelper.calculateBasicModeWrongAnswerScore(teams, selectedBarAnswerText, questions[0].id);
    const countOfPlayers = (percentageFromPhaseOne / 100) * numPlayers;

    teamsWithSelectedAnswer.sort((a, b) => a.teamName.localeCompare(b.teamName));

    return (
        <div>
            <div className={classes.textContainer}>
                <Typography className={classes.titleText}>
                    Players who picked this answer
                </Typography>
                <div className={classes.numberContainer}>
                    <Typography className={classes.countText}>
                        {(statePosition === 2 && answerCount)}
                        {(statePosition === 6 && Math.round(countOfPlayers))}
                    </Typography>
                    <Typography className={classes.percentageText}>
                        {statePosition === 2 && `(${Math.round(percentage)}%)`}
                        {statePosition === 6 && `(${percentageFromPhaseOne}%)`}
                    </Typography>
                </div>
            </div>
            {(statePosition === 6) && (
                <div className={classes.textContainer}>
                    <Typography className={classes.phaseTwoTitleText}>
                        Players who think this is the trickest<br/> answer
                    </Typography>
                    <div className={classes.phaseTwoNumberContainer}>
                        <Typography className={classes.phaseTwoCountText}>
                            {answerCount}
                        </Typography>
                        <Typography className={classes.phaseTwoPercentageText}>
                            ({Math.round(percentage)}%)
                        </Typography>
                    </div>
                </div>
            )}
            {teamsWithSelectedAnswer.map((teamChoice, index) => (
                <div key={index} style={rectangleStyle}>
                    <Typography className={classes.nameText}>
                        {teamChoice.teamName}
                    </Typography>
                </div>
            ))}
        </div>
    );
};

export default PlayersSelectedAnswer;
