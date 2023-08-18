import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import check from '../../images/Pickedcheck.svg';
import { Tooltip } from '@material-ui/core';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

const useStyles = makeStyles({
    text: {
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
    },
    choiceContainer: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: '800',
        lineHeight: '20px',
        paddingRight: '8px',
    },
    textContainer: {
        color: '#FFF',
        fontFamily: 'Rubik',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '22px',
    },
    titleText:{
        color: '#FFF',
        textAlign: 'left',
        fontFamily: 'Rubik',
        fontSize: '14px',
        fontWeight: '400',
        paddingBottom: '10px',
    }
});

const SelectedAnswer = (props) => {
    const {
        data,
        selectedBarIndex,
        correctChoiceIndex,
        reversedResponses,
        numPlayers,
        teamsPickedChoices,
    } = props;

    const classes = useStyles();

    const showCustomTick = selectedBarIndex === reversedResponses.length - 1 - correctChoiceIndex;


    const rectWidth = 336;
    const rectHeight = 24;

    const rectangleStyle = {
        width: rectWidth,
        height: rectHeight,
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: '16px',
        padding: '10px 16px',
        borderRadius: '22px',
        border: '1px solid #B1BACB',
        position: 'relative',
    };

    const checkIconStyle = {
        position: 'absolute',
        top: '50%',
        right: '16px',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <div>
            {selectedBarIndex === null ? (
                <Typography className={classes.text}>
                    Tap on a response to see more details.
                </Typography>
            ) : (
                <div>
                    <Typography className={classes.titleText}>
                    Showing players who answered:
                    </Typography>
                    <div style={rectangleStyle}>
                        <div className={classes.choiceContainer}>{data[selectedBarIndex].answerChoice}</div>
                        <div className={classes.textContainer}>{data[selectedBarIndex].answerText}</div>
                        {showCustomTick && (
                            <Tooltip title="This is the correct answer" placement="top" >
                                <span style={checkIconStyle}>
                                    <img src={check} alt="correct answer"/>
                                </span>
                            </Tooltip>
                        )}
                    </div>
                    <PlayersSelectedAnswer
                        data={data}
                        selectedBarIndex={selectedBarIndex}
                        numPlayers={numPlayers}
                        teamsPickedChoices={teamsPickedChoices}
                    />
                </div>
            )}
        </div>
    );
};

export default SelectedAnswer;
