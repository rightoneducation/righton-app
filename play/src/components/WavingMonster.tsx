import React from 'react';

import monster0Body from '../img/wavingmonsters/monster-0-body.png';
import monster0Arm  from '../img/wavingmonsters/monster-0-arm.png';
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

interface MonsterConfig {
  id: number;
  body: string;
  arm: string;
  bodyW: number;
  bodyH: number;
  armLeft: number;
  armTop: number;
  transformOrigin: string;
  armRestAngle: number;
  armWaveAmp: number;
}

const MONSTERS: MonsterConfig[] = [
  { id: 0, body: monster0Body, arm: monster0Arm, bodyW: 420, bodyH: 410, armLeft: -28, armTop: 165, transformOrigin: 'right bottom', armRestAngle: -15, armWaveAmp:  18 },
  { id: 1, body: monster1Body, arm: monster1Arm, bodyW: 354, bodyH: 371, armLeft: 35,  armTop: 185, transformOrigin: 'right center', armRestAngle: -15, armWaveAmp:  18 },
  { id: 2, body: monster2Body, arm: monster2Arm, bodyW: 418, bodyH: 419, armLeft: 90,  armTop: 260, transformOrigin: 'center top',   armRestAngle:  48, armWaveAmp:  36 },
  { id: 3, body: monster3Body, arm: monster3Arm, bodyW: 273, bodyH: 301, armLeft: 10,  armTop: 155, transformOrigin: 'center top',   armRestAngle:   3, armWaveAmp: -36 },
  { id: 4, body: monster4Body, arm: monster4Arm, bodyW: 361, bodyH: 332, armLeft: -57, armTop: 50,  transformOrigin: 'right center', armRestAngle: -15, armWaveAmp:  18 },
  { id: 5, body: monster5Body, arm: monster5Arm, bodyW: 326, bodyH: 376, armLeft: 60,  armTop: 188, transformOrigin: 'center top',   armRestAngle:  48, armWaveAmp: -36 },
];

const DURATION = '3s';

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
    17%  { opacity: 1; transform: translateX(0);    animation-timing-function: linear;   }
    80%  { opacity: 1; transform: translateX(0);    animation-timing-function: ease-in;  }
    100% { opacity: 1; transform: translateX(120%); }
  }
  ${MONSTERS.map(armWaveKeyframes).join('')}
`;

interface WavingMonsterProps {
  avatarIndex: number;
  onComplete: () => void;
}

export default function WavingMonster({ avatarIndex, onComplete }: WavingMonsterProps) {
  const monster = MONSTERS[avatarIndex] ?? MONSTERS[0];

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          position: 'absolute',
          right: -(monster.bodyW / 2),
          bottom: `calc(30vh - ${monster.bodyH / 2}px)`,
          animation: `monsterSequence ${DURATION} linear both`,
        }}
        onAnimationEnd={(e) => {
          if (e.animationName === 'monsterSequence') onComplete();
        }}
      >
        <img
          src={monster.arm}
          alt=""
          style={{
            position: 'absolute',
            top: monster.armTop,
            left: monster.armLeft,
            transformOrigin: monster.transformOrigin,
            animation: `armWave${monster.id} ${DURATION} ease-in-out both`,
            zIndex: 0,
          }}
        />
        <img
          src={monster.body}
          alt=""
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
        />
      </div>
    </>
  );
}
