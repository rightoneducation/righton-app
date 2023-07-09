import React from 'react';
import { LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    progressBar: {
        backgroundColor: 'white',
        borderRadius: '0 5px 5px 0',
        '& .MuiLinearProgress-bar': {
            borderRadius: '0 5px 5px 0',
        },
    },
    firstProgressBar: {
        backgroundColor: 'transparent',
        borderRadius: '5px',
        border: '1px solid white',
        '& .MuiLinearProgress-bar': {
            borderRadius: '5px',
        },
    },
    countTextStyle: {
        color: 'white',
    },
});

const ResponsesGraph = ({ responses }) => {
    const maxCount = Math.max(...responses.map(response => response.count));
    const numLines = Math.ceil(maxCount / 5);
    const classes = useStyles();

    return (
        <div style={{ position: 'relative', width: '100%', marginLeft: '3%', marginTop: '3%', textAlign: 'center', fontFamily: 'Rubik, sans-serif' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>Number of Players</div>
            {responses.map((response, index) => {
                const barLength = (response.count / maxCount) * 100;
                const progressBarClass = index === 0 ? classes.firstProgressBar : classes.progressBar;
                const countTextStyle = index === 0 ? classes.countTextStyle : ''; 

                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <LinearProgress
                                variant="determinate"
                                value={barLength}
                                classes={{
                                    bar: progressBarClass,
                                }}
                                style={{
                                    height: '20px',
                                    marginBottom: '5px',
                                    backgroundColor: 'transparent',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: `${barLength - 1}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    zIndex: 1,
                                }}
                                className={countTextStyle}
                            >
                                {response.count}
                            </div>
                            <div
                                style={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    position: 'absolute',
                                    top: '0%',
                                    left: '-2%',
                                    transform: 'translate(-50%, 0)',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    fontFamily: 'Poppins'
                                }}
                            >
                                {response.label}
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* Render the vertical lines */}
            {Array.from({ length: numLines + 1 }).map((_, index) => {
                const leftPos = (index * (100 / numLines));
                return (
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            bottom: '10px',
                            left: `${leftPos}%`,
                            transform: 'translateX(-50%)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '0',
                                transform: 'translateX(-50%)',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {index * 5}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ResponsesGraph;







