import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewHeader.css';

const ReviewHeader = ({ classroomName, sessions = [], selectedSessionId, onSessionChange, onPublish, isPublishing }) => {
  const navigate = useNavigate();
  return (
    <header className="review-header">
      <div className="review-header-content">
        <h1 className="review-header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          RightOn MicroCoach — Review
        </h1>

        <div className="review-header-right">
          {sessions.length > 1 && (
            <select
              value={selectedSessionId ?? ''}
              onChange={(e) => onSessionChange && onSessionChange(e.target.value)}
              className="review-session-dropdown"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {classroomName} — {s.sessionLabel}{s.topic ? ` (${s.topic})` : ''}
                </option>
              ))}
            </select>
          )}
          <button className="review-cancel-btn" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button className="review-publish-btn" onClick={onPublish} disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ReviewHeader;
