import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import './ReviewHeader.css';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ReviewHeader = ({
  classroomName,
  sessions = [],
  selectedSessionId,
  onSessionChange,
  onPublish,
  isPublishing,
  evaluatorEnabled = false,
  evaluationResults,
  onRegenerate,
  isRegenerating,
  regenComplete,
}) => {
  const navigate = useNavigate();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const evalItem = evaluationResults?.evaluations?.[0];
  const summary = evaluationResults?.summary;
  const hasAlert = evalItem && evalItem.classification !== 'atGrade' && !regenComplete;

  useEffect(() => {
    if (!bellOpen) return;
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [bellOpen]);

  const renderBellIcon = () => {
    if (isRegenerating) {
      return <CircularProgress size={20} sx={{ color: '#FFFBF6' }} />;
    }
    return <BellIcon />;
  };

  const renderBadge = () => {
    if (isRegenerating) return null;
    if (regenComplete) return <span className="review-bell-badge review-bell-badge--success"><CheckIcon /></span>;
    if (hasAlert) return <span className="review-bell-badge review-bell-badge--alert" />;
    return null;
  };

  const renderDropdown = () => {
    if (regenComplete) {
      return (
        <div className="review-bell-dropdown">
          <div className="review-bell-status review-bell-status--ok">
            ✓ Regeneration Complete
          </div>
          <p className="review-bell-detail">
            Content has been rewritten for grade band <strong>{summary?.expectedBand}</strong> and re-evaluated.
          </p>
          {evalItem && (
            <p className="review-bell-detail">
              New score: <strong>{evalItem.score}</strong> — {evalItem.classification === 'atGrade' ? 'At Grade Level' : evalItem.classification === 'aboveGrade' ? 'Above Grade Level' : 'Below Grade Level'}
            </p>
          )}
        </div>
      );
    }

    if (hasAlert) {
      return (
        <div className="review-bell-dropdown">
          <div className="review-bell-status review-bell-status--alert">
            ⚠ Some student-facing text is above grade level
          </div>
          <p className="review-bell-detail">
            Content scored at <strong>{evalItem.score}</strong>, expected <strong>{summary.expectedBand}</strong>
          </p>
          <button
            className="review-bell-regen-btn"
            onClick={() => { onRegenerate?.(); setBellOpen(false); }}
            disabled={isRegenerating}
          >
            Regenerate Content
          </button>
        </div>
      );
    }

    return (
      <div className="review-bell-dropdown">
        <div className="review-bell-status review-bell-status--ok">
          ✓ Content is at grade level ({summary?.expectedBand})
        </div>
      </div>
    );
  };

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

          {evaluatorEnabled && evaluationResults && (
            <div className="review-bell-wrapper" ref={bellRef}>
              <button
                className="review-bell-btn"
                onClick={() => !isRegenerating && setBellOpen((prev) => !prev)}
                title={isRegenerating ? 'Regenerating...' : 'Grade Level Evaluation'}
                disabled={isRegenerating}
              >
                {renderBellIcon()}
                {renderBadge()}
              </button>

              {bellOpen && renderDropdown()}
            </div>
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
