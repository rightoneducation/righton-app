import React from 'react';

export default function ImageUploadDashedBorder () {
  return (
    <svg
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        pointerEvents: 'none'
      }}
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      <rect
        x="2.5"
        y="2.5"
        width="95"
        height="95"
        fill="none"
        stroke="#333"
        strokeWidth="5"
        strokeDasharray="20,20"
        strokeDashoffset="0"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
