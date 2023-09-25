import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

export default function LoadingIndicator({
  theme,
  radius,
  timerStartInSecond,
  handleStartGameModalTimerFinished,
  gameCreate,
}) {
  const classes = useStyles();
  const { cos, sin, PI } = Math;
  const tau = 2 * PI;
  const multiply = ([a, b, c, d], x, y) => [a * x + b * y, c * x + d * y];
  const rotate = (x) => [cos(x), -sin(x), sin(x), cos(x)];
  const add = ([a1, a2], b1, b2) => [a1 + b1, a2 + b2];
  const ellipse = (cx, cy, rx, ry, t1, delta, theta) => {
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
    delta = delta % tau;
    const rotMatrix = rotate(theta);
    const [sX, sY] = add(
      multiply(rotMatrix, rx * cos(t1), ry * sin(t1)),
      cx,
      cy,
    );
    const [eX, eY] = add(
      multiply(rotMatrix, rx * cos(t1 + delta), ry * sin(t1 + delta)),
      cx,
      cy,
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

  const Segments = (x, y, r, colors) => {
    let rx = r;
    let ry = r;
    let t1 = 0;
    let phase = 0;
    let spacing = 0.1;
    const segments = 8;
    const evenly = tau / segments;
    const space = evenly * spacing;
    const offset = space + phase;
    const sweepAngle = evenly - space * 2;
    return colors.map((color, i) => (
      <path
        key={color}
        stroke={color}
        d={ellipse(x, y, rx, ry, t1, sweepAngle, i * evenly + offset)}
      />
    ));
  };

  const [colors, setColors] = useState(theme);
  const [remainingSecondsInMilliSeconds, setRemainingSecondsInMilliSeconds] =
    useState(timerStartInSecond * 1000);
  const [remainingTimeInSecond, setRemainingTimeInSecond] =
    useState(timerStartInSecond);
  const [timerFinished, setTimerFinished] = useState(false);

  let timeInterval = 100;

  useEffect(() => {
    let refreshIntervalId = setInterval(() => {
      if (!timerFinished) {
        const c = colors
          .slice(colors.length - 1)
          .concat(colors.slice(0, colors.length - 1));
        setColors(c);

        setRemainingSecondsInMilliSeconds(
          remainingSecondsInMilliSeconds - timeInterval,
        );
        setRemainingTimeInSecond(
          Math.ceil(remainingSecondsInMilliSeconds / 1000),
        );
      }
    }, timeInterval);

    if (timerFinished) {
      return;
    } else if (remainingTimeInSecond <= 0) {
      handleStartGameModalTimerFinished();
      setTimerFinished(true);
      clearInterval(refreshIntervalId);
      return;
    }
    return () => {
      clearInterval(refreshIntervalId);
    };
  });

  return (
    <div className={classes.container}>
      <svg
        width={radius * 2}
        height={radius * 2}
        strokeWidth={7}
        viewBox={'0 0 42 42'}
      >
        {Segments(21, 21, 15.91549430918954, colors)}
      </svg>
      <div className={classes.text}>
        {!gameCreate ? remainingTimeInSecond : null}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    position: 'absolute',
    fontFamily: 'Karla',
    fontWeight: 'bold',
    fontSize: '108px',
  },
}));
