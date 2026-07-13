import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface LoadingIndicatorProps{
  theme: string[]; 
  radius: number;
  timerStartInSecond: number;
  setIsTimerVisible?: (isTimerVisible: boolean) => void;
  gameCreate: boolean;
}

export default function LoadingIndicator({
  theme,
  radius,
  timerStartInSecond,
  setIsTimerVisible,
  gameCreate,
}:LoadingIndicatorProps) {
  const { cos, sin, asin, sqrt, PI } = Math;
  const tau = 2 * PI;
  const strokeWidth = 7;
  const polar = (cx: number, cy: number, r: number, a: number) => [
    cx + r * cos(a),
    cy + r * sin(a),
  ];
  const roundedSegment = (
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    a0: number,
    a1: number,
    c: number,
  ) => {
    /* [
    returns an SVG path for a filled ring segment (annular sector) with
    rounded corners of radius c.
    cx,cy → center of ring
    rIn,rOut → inner/outer radius
    a0,a1 → start/end angle, in radians
    each corner is an arc of radius c tangent to both the radial edge and
    the inner/outer circle; φ is the angular offset of the tangent point
    ] */
    const co = rOut - c;
    const ci = rIn + c;
    const phiO = asin(c / co);
    const phiI = asin(c / ci);
    const dO = sqrt(co * co - c * c);
    const dI = sqrt(ci * ci - c * c);
    const p1 = polar(cx, cy, dO, a0);
    const p2 = polar(cx, cy, rOut, a0 + phiO);
    const p3 = polar(cx, cy, rOut, a1 - phiO);
    const p4 = polar(cx, cy, dO, a1);
    const p5 = polar(cx, cy, dI, a1);
    const p6 = polar(cx, cy, rIn, a1 - phiI);
    const p7 = polar(cx, cy, rIn, a0 + phiI);
    const p8 = polar(cx, cy, dI, a0);
    return [
      'M', p1[0], p1[1],
      'A', c, c, 0, 0, 1, p2[0], p2[1],
      'A', rOut, rOut, 0, 0, 1, p3[0], p3[1],
      'A', c, c, 0, 0, 1, p4[0], p4[1],
      'L', p5[0], p5[1],
      'A', c, c, 0, 0, 1, p6[0], p6[1],
      'A', rIn, rIn, 0, 0, 0, p7[0], p7[1],
      'A', c, c, 0, 0, 1, p8[0], p8[1],
      'Z',
    ].join(' ');
  };

  const Segments = (x: number, y: number, r: number, colors: string[]) => {
    const segments = 8;
    const evenly = tau / segments;
    // convert rendered px to viewBox units so gap/corners hold at any radius prop
    const scale = (radius * 2) / 42;
    const gapAngle = 6 / scale / r; // 6px visual gap between segments
    const cornerRadius = 6 / scale; // 6px corner radius on each segment
    const rIn = r - strokeWidth / 2;
    const rOut = r + strokeWidth / 2;
    return colors.map((color, i) => (
      <path
        key={color}
        fill={color}
        d={roundedSegment(
          x,
          y,
          rIn,
          rOut,
          i * evenly + gapAngle / 2,
          (i + 1) * evenly - gapAngle / 2,
          cornerRadius,
        )}
      />
    ));
  };

  const [colors, setColors] = useState(theme);
  const [remainingSecondsInMilliSeconds, setRemainingSecondsInMilliSeconds] =
    useState(timerStartInSecond * 1000);
  const [remainingTimeInSecond, setRemainingTimeInSecond] =
    useState(timerStartInSecond);
  const [timerFinished, setTimerFinished] = useState(false);

  const timeInterval = 100;

  useEffect(() => {
    const refreshIntervalId = setInterval(() => {
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

    if (remainingTimeInSecond <= 0) {
      if (setIsTimerVisible)
        setIsTimerVisible(false);
      setTimerFinished(true);
      clearInterval(refreshIntervalId);
    }
    return () => (clearInterval(refreshIntervalId));
  }, [timerFinished, remainingTimeInSecond, colors, remainingSecondsInMilliSeconds, setIsTimerVisible]);

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox='0 0 42 42'
        style={{position: 'absolute', zIndex: 0}}
      >
        {Segments(21, 21, 15.91549430918954, colors)}
      </svg>
      <Typography variant="h2" sx={{fontFamily: 'Rubik', fontWeight: 700, fontSize: '108px', textAlign: 'center', position: 'absolute'}}>
        {!gameCreate ? remainingTimeInSecond : null}
      </Typography>
    </Box>
  );
}