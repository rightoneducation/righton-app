import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { TimerMode } from '../lib/PlayModels';

const TimerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 1,
});

interface RadialTimerProps {
  mode: TimerMode;
  inputColors: string[];
  radius: number;
  timerStartInSeconds: number;
  setIsPregameCountdown?: (isPregameCountdown: boolean) => void;
}

type UndefinedTimer = NodeJS.Timeout | undefined;

export default function RadialTimer({
  mode,
  inputColors,
  radius,
  timerStartInSeconds,
  setIsPregameCountdown,
}: RadialTimerProps) {
  const { cos, sin, PI } = Math;
  const tau = 2 * PI;
  const multiply = ([a, b, c, d]: number[], x: number, y: number) => [
    a * x + b * y,
    c * x + d * y,
  ];
  const rotate = (x: number) => [cos(x), -sin(x), sin(x), cos(x)];
  const add = ([a1, a2]: number[], b1: number, b2: number) => [
    a1 + b1,
    a2 + b2,
  ];
  const ellipse = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    t1: number,
    deltaInput: number,
    theta: number
  ) => {
    /* [
    returns a SVG path element that represent a ellipse.
    cx,cy → center of ellipse
    rx,ry → major minor radius
    t1 → start angle, in radian.
    delta → angle to sweep, in radian. positive.
    theta → rotation on the whole, in radian
    url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
    Version 2019-06-19
    ] */
    const delta = deltaInput % tau;
    const rotMatrix = rotate(theta);
    const [sX, sY] = add(
      multiply(rotMatrix, rx * cos(t1), ry * sin(t1)),
      cx,
      cy
    );
    const [eX, eY] = add(
      multiply(rotMatrix, rx * cos(t1 + delta), ry * sin(t1 + delta)),
      cx,
      cy
    );
    const fA = delta > PI ? 1 : 0;
    const fS = delta > 0 ? 1 : 0;
    const path = [
      'M',
      sX,
      sY,
      'A',
      rx,
      ry,
      (theta / tau) * 360,
      fA,
      fS,
      eX,
      eY,
    ];
    return path.join(' ');
  };

  const Segments = (x: number, y: number, r: number, colors: string[]) => {
    const rx = r;
    const ry = r;
    const t1 = 0;
    const phase = 0;
    const spacing = 0.1;
    const segments = 8;
    const evenly = tau / segments;
    const space = evenly * spacing;
    const offset = space + phase;
    const sweepAngle = evenly - space * 2;
    return colors.map((color, i) => (
      <path
        key={color}
        stroke={color}
        fill="none"
        d={ellipse(x, y, rx, ry, t1, sweepAngle, i * evenly + offset)}
      />
    ));
  };

  const [colors, setColors] = useState(inputColors);
  const timeInterval = 100;
  const [currentTimeMilli, setCurrentTimeMilli] = useState(
    timerStartInSeconds * 1000
  ); // millisecond updates to smooth out progress bar
  const currentTime = Math.ceil(currentTimeMilli / 1000);

  const countdownTimer = () => {
    let timer: NodeJS.Timeout | undefined;
    if (currentTimeMilli > 0) {
      timer = setInterval(() => {
        const color = colors
          .slice(colors.length - 1)
          .concat(colors.slice(0, colors.length - 1));
        setColors(color);
        setCurrentTimeMilli((prevTime) => prevTime - timeInterval);
      }, timeInterval);
    } else if (setIsPregameCountdown) {
      setIsPregameCountdown(false);
    }
    return timer;
  };

  const countupTimer = () => {
    let timer: UndefinedTimer;
    // adding in a stop at 2 minutes so the timer doesn't run indefinitely
    if (currentTimeMilli < 120000) {
      timer = setInterval(() => {
        const color = colors
          .slice(colors.length - 1)
          .concat(colors.slice(0, colors.length - 1));
        setColors(color);
        setCurrentTimeMilli((prevTime) => prevTime + timeInterval);
      }, timeInterval);
    }
    return timer;
  };

  useEffect(() => {
    let timer: UndefinedTimer;
    if (mode === TimerMode.COUNTDOWN) {
      timer = countdownTimer();
    } else {
      timer = countupTimer();
    }
    return () => clearInterval(timer);
  }, [currentTimeMilli]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer>
      <svg
        width={radius * 2}
        height={radius * 2}
        strokeWidth={7}
        viewBox="0 0 42 42"
      >
        {Segments(21, 21, 15.91549430918954, colors)}
      </svg>
      {mode === TimerMode.COUNTDOWN && 
        <Typography
          variant="h1"
          sx={{ position: 'absolute', textAlign: 'center', fontSize: '108px' }}
        >
          {currentTime}
        </Typography>
      }
    </TimerContainer>
  );
}
