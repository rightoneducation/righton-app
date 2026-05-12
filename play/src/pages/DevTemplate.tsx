import React, { useState } from 'react';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';

import monster1Body from '../img/wavingmonsters/monster-1-body.png';
import monster1Arm  from '../img/wavingmonsters/monster-1-arm.png';
import monster2Body from '../img/wavingmonsters/monster-2-body.png';
import monster2Arm  from '../img/wavingmonsters/monster-2-arm.png';
import monster3Body from '../img/wavingmonsters/monster-3-body.png';
import monster3Arm  from '../img/wavingmonsters/monster-3-arm.png';
import monster4Body from '../img/wavingmonsters/monster-4-body.png';
import monster4Arm  from '../img/wavingmonsters/monster-4-arm.png';
import monster5Body from '../img/wavingmonsters/monster-5-body.png';
import monster5Arm  from '../img/wavingmonsters/monster-5-arm.png';
import monster6Body from '../img/wavingmonsters/monster-6-body.png';
import monster6Arm  from '../img/wavingmonsters/monster-6-arm.png';

interface MonsterConfig {
  id: number;
  body: string;
  arm: string;
  bodyW: number;
  bodyH: number;
  armLeft: number;
  armTop: number;
  transformOrigin: string;
  armInFront: boolean;
  armRestAngle: number; // degrees; rest position of arm
  armWaveAmp: number;   // degrees; how far it swings from rest toward the wave peak
}

// armLeft/armTop are px offsets relative to the body container's top-left corner.
// Negative armLeft means the arm extends beyond the body's left edge.
// transformOrigin marks the shoulder pivot within the arm image.
const MONSTERS: MonsterConfig[] = [
  { id: 1, body: monster1Body, arm: monster1Arm, bodyW: 420, bodyH: 410, armLeft: -28, armTop: 165, transformOrigin: 'right bottom', armInFront: false, armRestAngle: -15, armWaveAmp: 18 },
  { id: 2, body: monster2Body, arm: monster2Arm, bodyW: 354, bodyH: 371, armLeft: 35,  armTop: 185, transformOrigin: 'right center', armInFront: false, armRestAngle: -15, armWaveAmp: 18 },
  { id: 3, body: monster3Body, arm: monster3Arm, bodyW: 418, bodyH: 419, armLeft: 90,  armTop: 260, transformOrigin: 'center top',   armInFront: false, armRestAngle:  48, armWaveAmp: 36 },
  { id: 4, body: monster4Body, arm: monster4Arm, bodyW: 273, bodyH: 301, armLeft: 10,  armTop: 155,  transformOrigin: 'center top',   armInFront: false, armRestAngle:   3, armWaveAmp: -36 },
  { id: 5, body: monster5Body, arm: monster5Arm, bodyW: 361, bodyH: 332, armLeft: -57, armTop: 50,  transformOrigin: 'right center', armInFront: false, armRestAngle: -15, armWaveAmp: 18 },
  { id: 6, body: monster6Body, arm: monster6Arm, bodyW: 326, bodyH: 376, armLeft: 60,  armTop: 188, transformOrigin: 'center top',   armInFront: false, armRestAngle:  48, armWaveAmp: -36 },
];

const DURATION = '5s';

const armWaveKeyframes = (m: MonsterConfig) => `
  @keyframes armWave${m.id} {
    0%,  10%  { transform: rotate(${m.armRestAngle}deg); }
    25%        { transform: rotate(${m.armRestAngle - m.armWaveAmp}deg); }
    40%        { transform: rotate(${m.armRestAngle}deg); }
    55%        { transform: rotate(${m.armRestAngle - m.armWaveAmp}deg); }
    70%, 100%  { transform: rotate(${m.armRestAngle}deg); }
  }
`;

const styles = `
  @keyframes monsterSequence {
    0%   { opacity: 0; transform: translateX(0);    animation-timing-function: ease-out; }
    10%  { opacity: 1; transform: translateX(0);    animation-timing-function: linear;   }
    80%  { opacity: 1; transform: translateX(0);    animation-timing-function: ease-in;  }
    100% { opacity: 1; transform: translateX(120%); }
  }
  ${MONSTERS.map(armWaveKeyframes).join('')}
`;

export default function DevTemplate() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playKey, setPlayKey]         = useState(0);

  const monster = MONSTERS[selectedIdx];

  return (
    <BackgroundContainerStyled>
      <style>{styles}</style>

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
          onClick={() => setPlayKey(k => k + 1)}
          style={{ padding: '6px 20px', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
        >
          Play
        </button>
      </div>

      {/* key combines monster + playKey so switching monster or pressing Play both restart */}
      <div
        key={`${selectedIdx}-${playKey}`}
        style={{
          position: 'absolute',
          right: -(monster.bodyW / 2),
          bottom: `calc(30vh - ${monster.bodyH / 2}px)`,
          animation: `monsterSequence ${DURATION} linear both`,
        }}
      >
        <img
          src={monster.arm}
          alt="monster arm"
          style={{
            position: 'absolute',
            top: monster.armTop,
            left: monster.armLeft,
            transformOrigin: monster.transformOrigin,
            animation: `armWave${monster.id} ${DURATION} ease-in-out both`,
            zIndex: monster.armInFront ? 2 : 0,
          }}
        />
        <img
          src={monster.body}
          alt="monster body"
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
        />
      </div>
    </BackgroundContainerStyled>
  );
}
