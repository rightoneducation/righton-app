import * as React from 'react';

type MistakeCardProps = {
  answer: string;
  bgColor?: string;
} & React.SVGProps<SVGSVGElement>;

export default function MistakeCard({
  answer,
  bgColor = '#E0348B',
  ...svgProps
}: MistakeCardProps) {
  const viewBoxWidth = 252;
  const viewBoxHeight = 302;
  const centerX = viewBoxWidth / 2;   // 126
  const centerY = viewBoxHeight / 2;  // 151
  const radius = 126;
  const questionRadius = radius - 25;

  const ANSWER_TOP_OFFSET = 70;
  const answerY = centerY - radius + ANSWER_TOP_OFFSET;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
      {...svgProps}
    >
      {/* background circle */}
      <circle cx={centerX} cy={centerY} r={radius} fill={bgColor} />

      {/* circular path for question */}
      <defs>
        <path
          id="mc-q-path"
          d={`
            M ${centerX}, ${centerY}
            m -${questionRadius}, 0
            a ${questionRadius},${questionRadius} 0 1,1 ${questionRadius * 2},0
            a ${questionRadius},${questionRadius} 0 1,1 -${questionRadius * 2},0
          `}
          fill="none"
        />
      </defs>

      {/* curved question text */}
      <text fontSize={16} fill="#fff" fontFamily='Poppins' fontWeight="bold">
        <textPath href="#mc-q-path" startOffset="25%" textAnchor="middle">
          What is your favorite mistake?
        </textPath>
      </text>

      {/* answer inside circle */}
      <foreignObject
        x={centerX - 110}
        y={answerY - 10}
        width={220}
        height={160}
      >
        <div
          style={{
            width: '90%',
            height: '100%',
            color: 'white',
            fontSize: '14px',
            lineHeight: '1.3',
            textAlign: 'center',
            fontFamily: 'Poppins',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 10px',
             transform: 'rotate(-10deg)',
      transformOrigin: 'center',
          }}
        >
          {answer}
        </div>
      </foreignObject>
    </svg>
  );
}

