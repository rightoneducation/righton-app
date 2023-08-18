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
    const { data, selectedBarIndex, numPlayers, teamsPickedChoices, statePosition } = props;

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
    
    console.log(statePosition);
    return (
        <div>
            <div className={classes.textContainer}>
                <Typography className={classes.titleText}>
                    Players who picked this answer
                </Typography>
                <div className={classes.numberContainer}>
                    <Typography className={classes.countText}>
                         {/* count from stateposition === 6 saved and displayed here for stateposition === 6 */}
                        {answerCount}
                    </Typography>
                    <Typography className={classes.percentageText}>
                        {/* percentage from  stateposition === 6saved and displayed here for stateposition === 6 */}
                        ({Math.round(percentage)}%)
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
