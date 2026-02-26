import React from 'react';
import './GameCard.css';

const GameCard = ({ game }) => {
  // Sample data if none provided
  const defaultGame = {
    id: 1,
    title: "Linear Equations Explorer",
    thumbnail: "",
    gradeLevel: "8th Grade",
    subject: "Algebra",
    playCount: 247,
    averageTime: "12 min",
    lastPlayed: "2 hours ago",
    difficulty: "Medium",
    ccssLabel: "8.EE.C.8"
  };

  const gameData = game || defaultGame;

  return (
    <div className="game-card">
      <div className="game-content">
        <div className="game-header">
          <h3 className="game-title">{gameData.title}</h3>
          <div className="game-tags">
            <span className="tag grade-tag">{gameData.gradeLevel}</span>
            <span className="tag subject-tag">{gameData.subject}</span>
          </div>
        </div>
        
        <div className="game-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Plays:</span>
            <span className="metadata-value">{gameData.playCount}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Avg Time:</span>
            <span className="metadata-value">{gameData.averageTime}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Last Played:</span>
            <span className="metadata-value">{gameData.lastPlayed}</span>
          </div>
          {gameData.ccssLabel && (
            <div className="metadata-item">
              <span className="metadata-label">CCSS:</span>
              <span className="metadata-value">{gameData.ccssLabel}</span>
            </div>
          )}
        </div>
        
        <div className="game-actions">
          <button className="action-btn launch-btn">Launch</button>
          <button className="action-btn view-btn">View</button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
