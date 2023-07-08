import React from 'react';
import { LinearProgress } from "@material-ui/core";

const ResponsesGraph = ({ responses }) => {
  const maxCount = Math.max(...responses.map(response => response.count));
  const numLines = Math.ceil(maxCount / 5); // Calculate the number of lines needed

  return (
    <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px',color: 'white', }}>Number of Players</div>
      {responses.map(response => {
        const barLength = (response.count / maxCount) * 100;
        return (
          <div key={response.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{color: 'white', }}>{response.label}</div>
            <div style={{ position: 'relative', width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={barLength}
                style={{ height: '20px', borderRadius: '5px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${barLength}%`,
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: 'white',
                  zIndex: 1,
                }}
              >
                {response.count}
              </div>
            </div>
          </div>
        );
      })}
      {/* Render the vertical lines */}
      {Array.from({ length: numLines + 1 }).map((_, index) => {
        const position = (index * (100 / numLines));
        const isCountMultipleOfFive = index !== 0 && (index * 5) % maxCount === 0;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '0',
              bottom: '0',
              left: `${position}%`,
              transform: 'translateX(-50%)',
              borderLeft: '1px solid white',
              ...(isCountMultipleOfFive && { height: '100%' }),
            }}
          />
        );
      })}
    </div>
  );
};

export default ResponsesGraph;