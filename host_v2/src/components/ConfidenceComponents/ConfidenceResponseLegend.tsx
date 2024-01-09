import React from 'react';
import { Typography, makeStyles } from '@mui/material';

export default function Legend() {
  // const classes = useStyles();

  return (
    <div
      // className={classes.legend}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginRight: '12px',
          alignItems: 'center',
        }}
      >
        <svg width={40} height={15}>
          <rect
            width={40}
            height={15}
            style={{
              fill: '#FFF',
              stroke: '#FFF',
              strokeWidth: 2,
            }}
          />
        </svg>

        <Typography
          // className={classes.labels}
          style={{
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            opacity: 0.4,
            paddingLeft: 5,
          }}
        >
          Correct
        </Typography>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginRight: '12px',
          alignItems: 'center',
        }}
      >
        <svg width={40} height={15}>
          <rect
            width={40}
            height={15}
            style={{
              fill: 'transparent',
              stroke: '#FFF',
              strokeWidth: 2,
            }}
          />
        </svg>

        <Typography
          // className={classes.labels}
          style={{
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            opacity: 0.4,
            paddingLeft: 5,
          }}
        >
          Incorrect
        </Typography>
      </div>
    </div>
  );
}

// const useStyles = makeStyles({
//   legend: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
// });
