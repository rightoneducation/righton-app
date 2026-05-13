import React, { useState, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { PlayButtonBlock, ButtonType } from '@righton/networking';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';

import stand from '../img/celebratingmonsters/stand.png';
import monster0 from '../img/celebratingmonsters/monster-0-celebrate.png';
import monster1 from '../img/celebratingmonsters/monster-1-celebrate.png';
import monster2 from '../img/celebratingmonsters/monster-2-celebrate.png';
import monster4 from '../img/celebratingmonsters/monster-4-celebrate.png';
import monster5 from '../img/celebratingmonsters/monster-5-celebrate.png';

interface MonsterConfig {
  id: number;
  src: string;
}

const MONSTERS: MonsterConfig[] = [
  { id: 0, src: monster0 },
  { id: 1, src: monster1 },
  { id: 2, src: monster2 },
  { id: 4, src: monster4 },
  { id: 5, src: monster5 },
];

const SCORE = 100;

const styles = `
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes standSlideSpring {
    0%   { transform: translateY(100%); }
    55%  { transform: translateY(-8px); }
    70%  { transform: translateY(4px); }
    82%  { transform: translateY(-2px); }
    91%  { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }
  @keyframes monsterSlideSpring {
    0%   { transform: translateY(100%); }
    55%  { transform: translateY(-8px); }
    70%  { transform: translateY(4px); }
    82%  { transform: translateY(-2px); }
    91%  { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }
`;

export default function DevTemplate() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const [textDone, setTextDone] = useState(false);
  const standRef = useRef<HTMLImageElement>(null);
  const [standHeight, setStandHeight] = useState(0);

  return (
    <BackgroundContainerStyled>
      <style>{styles}</style>

      {/* Pre-rendered stand to measure height before animation starts */}
      <img
        ref={standRef}
        src={stand}
        alt=""
        style={{ position: 'absolute', bottom: 0, width: '100%', visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={() => setStandHeight(standRef.current?.offsetHeight ?? 0)}
      />

      <div style={{ textAlign: 'center', paddingTop: 32, overflow: 'hidden' }}>
        <div
          key={playKey}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 0.5s ease-out both' }}
          onAnimationEnd={() => setTextDone(true)}
        >
          <Typography variant="title">Congrats!</Typography>
          <Typography variant="h2">{`You have scored ${SCORE} points!`}</Typography>
        </div>
      </div>

      {textDone && (
        <>
          <Box
            key={`monster-${playKey}`}
            style={{
              position: 'absolute',
              bottom: standHeight - 40,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              animation: 'monsterSlideSpring 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
              zIndex: 1,
            }}
          >
            <img src={MONSTERS[selectedIdx].src} alt="monster" style={{ display: 'block', maxWidth: '100%' }} />
          </Box>

          <Box
            key={`stand-${playKey}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              animation: 'standSlideSpring 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
              zIndex: 0,
            }}
          >
            <img src={stand} alt="stand" style={{ width: '100%', display: 'block' }} />
          </Box>
        </>
      )}

      <Box
        style={{
          position: 'absolute',
          bottom: 40,
          left: 32,
          right: 32,
          display: 'flex',
          justifyContent: 'center',
          animation: textDone ? 'fadeIn 0.5s ease-out both' : 'none',
          opacity: textDone ? undefined : 0,
        }}
      >
        <PlayButtonBlock
          buttonType={ButtonType.LEADERBOARD}
          label="View Leaderboard"
          isEnabled
          onClick={() => {}}
        />
      </Box>

      <div style={{
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        zIndex: 10,
      }}>
        <select
          value={selectedIdx}
          onChange={e => setSelectedIdx(Number(e.target.value))}
          style={{ padding: '6px 12px', borderRadius: 6, fontSize: 16 }}
        >
          {MONSTERS.map((m, i) => (
            <option key={m.id} value={i}>Monster {m.id}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => { setPlayKey(k => k + 1); setTextDone(false); }}
          style={{ padding: '6px 20px', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
        >
          Play
        </button>
      </div>
    </BackgroundContainerStyled>
  );
}
