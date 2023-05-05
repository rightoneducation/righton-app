import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const TimerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 1
});

interface RadialTimerProps {
  inputColors: string[];
  radius: number;
  timerStartInSeconds: number;
}

export default function RadialTimer({
  inputColors,
  radius,
  timerStartInSeconds,
  // handleTimerFinished
  }: RadialTimerProps) {
    const { cos, sin, PI } = Math;
    const tau = 2 * PI;
    const multiply = ([a, b, c, d]:number[], x:number, y:number) => [a * x + b * y, c * x + d * y];
    const rotate = (x:number) => [cos(x), -sin(x), sin(x), cos(x)];
    const add = ([a1, a2]: number[], b1:number, b2:number) => [a1 + b1, a2 + b2];
    const ellipse = (cx:number, cy:number, rx:number, ry:number, t1:number, deltaInput:number, theta:number) => {
        const delta = deltaInput % tau;
        const rotMatrix = rotate(theta);
        const [sX, sY] = add(multiply(rotMatrix, rx * cos(t1), ry * sin(t1)), cx, cy);
        const [eX, eY] = add(
          multiply(rotMatrix, rx * cos(t1 + delta), ry * sin(t1 + delta)),
          cx,
          cy,
        );
        const fA = delta > PI ? 1 : 0;
        const fS = delta > 0 ? 1 : 0;
        const path = ['M', sX, sY, 'A', rx, ry, (theta / tau) * 360, fA, fS, eX, eY];
        return path.join(' ');
    }

    const Segments = (x:number, y:number, r:number, colors:string[])=> {
        const rx = r;
        const ry = r;
        const t1 = 0;
        const phase =0;
        const spacing = 0.1;
        const segments = 8;
        const evenly = tau / segments;
        const space = evenly * spacing;
        const offset = space + phase;
        const sweepAngle = evenly - space * 2;
        return colors.map((color, i) => (
          <path key={color} stroke={color} d={ellipse(x, y, rx, ry, t1, sweepAngle, i * evenly + offset)}/>
        ));
    }

    
    const [colors, setColors] = useState(inputColors);
    const [remainingSecondsInMilliSeconds, setRemainingSecondsInMilliSeconds] = useState(timerStartInSeconds * 1000);
    const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(timerStartInSeconds);
    const [timerFinished, setTimerFinished] = useState(false);

    const timeInterval = 100;

    useEffect(() => {
      const refreshIntervalId = setInterval(() => {
        if (!timerFinished)
        {
          const c = colors.slice(colors.length - 1).concat(colors.slice(0, colors.length - 1));
          setColors(c);
       
          setRemainingSecondsInMilliSeconds(remainingSecondsInMilliSeconds - timeInterval);
          setRemainingTimeInSeconds(Math.ceil(remainingSecondsInMilliSeconds / 1000));
          console.log(remainingTimeInSeconds);
        }
      }, timeInterval);
 
      if (timerFinished) {
          return;
      }
      if (remainingTimeInSeconds <= 0) {
          // handlePreGameTimerFinished();  
          setTimerFinished(true);
          clearInterval(refreshIntervalId);
          // return;
      }
      // return () => {
      //   clearInterval(refreshIntervalId);
      // }
    },[remainingSecondsInMilliSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <TimerContainer>
        {/* <svg width={radius*2} height={radius*2} strokeWidth={7}  viewBox='0 0 42 42'>
         { Segments(21, 21 , 15.91549430918954, colors) }    
        </svg> */}
       <Typography variant="h1" sx={{position: 'absolute', textAlign: 'center', fontSize: '108px'}}> {remainingTimeInSeconds} </Typography>
      </TimerContainer>
    )
}
