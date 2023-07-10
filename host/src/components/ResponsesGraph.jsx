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

const responseLabelStyle = {
  color: 'rgba(255, 255, 255, 0.5)',
  position: 'absolute',
  top: '0%',
  left: '-2%',
  transform: 'translate(-50%, 0)',
  width: '100%',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '800',
  fontFamily: 'Poppins',
};

const verticalLineStyle = {
  position: 'absolute',
  top: '-5px',
  bottom: '0px',
  transform: 'translateX(-50%)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
};

const labelTextStyle = {
  position: 'absolute',
  top: '-15px',
  left: '0',
  transform: 'translateX(-50%)',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '12px',
  fontWeight: 'bold',
};

const ResponsesGraph = ({ responses }) => {
  const maxCount = Math.max(...responses.map(response => response.count));
  const numLines = Math.ceil(maxCount / 5);
  const classes = useStyles();

  return (
    <div style={{ position: 'relative', width: '100%', marginLeft: '3%', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: '30px', color: 'rgba(255, 255, 255, 0.5)' }}>
        <div style={{ display: 'inline-block', fontWeight: 'bold', fontFamily: 'Rubik, sans-serif' }}>Number of Players</div>
      </div>
      <div style={{ position: 'relative' }}>
        {responses.map((response, index) => {
          const barLength = (response.count / maxCount) * 100;
          const progressBarClass = index === 0 ? classes.firstProgressBar : classes.progressBar;
          const countTextStyle = index === 0 ? classes.countTextStyle : '';

          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
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
                    fontFamily: 'Rubik, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    zIndex: 1,
                  }}
                  className={countTextStyle}
                >
                  {response.count}
                </div>
                <div style={responseLabelStyle}>
                  {response.label}
                </div>
              </div>
            </div>
          );
        })}
        {Array.from({ length: numLines + 1 }).map((_, index) => {
          const leftPos = (index * (100 / numLines));
          return (
            <div style={{ ...verticalLineStyle, left: `${leftPos}%` }} key={index}>
              <div style={labelTextStyle}>
                {index * 5}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsesGraph;








