import React from 'react';
import './ConfidenceLevelChart.css';

const ConfidenceLevelChart = ({ data }) => {
  // Sample data if none provided - showing 3 activities with 1-5 Likert scale confidence levels
  const defaultData = [
    { 
      game: 'Activity 1', 
      confidence1: 8,  // Not confident at all
      confidence2: 12, // Slightly confident
      confidence3: 25, // Moderately confident
      confidence4: 35, // Very confident
      confidence5: 20  // Extremely confident
    },
    { 
      game: 'Activity 2', 
      confidence1: 15,
      confidence2: 20,
      confidence3: 30,
      confidence4: 25,
      confidence5: 10
    },
    { 
      game: 'Activity 3', 
      confidence1: 5,
      confidence2: 10,
      confidence3: 20,
      confidence4: 40,
      confidence5: 25
    }
  ];

  const chartData = data || defaultData;

  return (
    <div className="confidence-chart">
      <div className="chart-container">
        {chartData.map((item, index) => (
          <div key={index} className="chart-row">
            <div className="game-label">{item.game}</div>
            <div className="bar-container">
              <div className="confidence-bar">
                <div 
                  className="bar-segment confidence-1" 
                  style={{ width: `${item.confidence1}%` }}
                ></div>
                <div 
                  className="bar-segment confidence-2" 
                  style={{ width: `${item.confidence2}%` }}
                ></div>
                <div 
                  className="bar-segment confidence-3" 
                  style={{ width: `${item.confidence3}%` }}
                ></div>
                <div 
                  className="bar-segment confidence-4" 
                  style={{ width: `${item.confidence4}%` }}
                ></div>
                <div 
                  className="bar-segment confidence-5" 
                  style={{ width: `${item.confidence5}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color confidence-1"></div>
          <span>1 - Not confident at all</span>
        </div>
        <div className="legend-item">
          <div className="legend-color confidence-2"></div>
          <span>2 - Slightly confident</span>
        </div>
        <div className="legend-item">
          <div className="legend-color confidence-3"></div>
          <span>3 - Moderately confident</span>
        </div>
        <div className="legend-item">
          <div className="legend-color confidence-4"></div>
          <span>4 - Very confident</span>
        </div>
        <div className="legend-item">
          <div className="legend-color confidence-5"></div>
          <span>5 - Extremely confident</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceLevelChart;
