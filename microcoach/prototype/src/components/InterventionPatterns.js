import React, { useMemo, useState } from 'react';
import './InterventionPatterns.css';
import './SharedButtons.css';
import LearningGapTrendDetailsModal from './LearningGapTrendDetailsModal';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const LearningGapTrendCard = ({
  moveTitle,
  ccssStandard,
  misconceptionTitle,
  hasResults,
  improvedCount,
  improvementPoints,
  onView,
}) => (
  <div className="ip-gap-card">
    <div className="ip-gap-left">
      <div className="ip-gap-name">{moveTitle}</div>
      <div className="ip-gap-addresses">
        <span className="ip-gap-addresses-label">Addresses:</span>
        {ccssStandard && (
          <span
            className="ccss-tag target-objective"
            aria-label={'Learning objective standard ' + ccssStandard}
          >
            {ccssStandard}
          </span>
        )}
        <span className="ip-gap-misconception">{misconceptionTitle}</span>
      </div>
      <div className="ip-gap-meta">
        {hasResults ? (
          <span>
            <strong>{improvedCount}</strong>
            {' '}
            {improvedCount === 1 ? 'student' : 'students'} showed improvement
          </span>
        ) : (
          <span className="ip-gap-pending">
            Once follow-up quiz results are available, a summary of student learning outcomes will be displayed here.
          </span>
        )}
      </div>
    </div>

    {hasResults && (
      <>
        <div
          className="ip-gap-right"
          aria-label={'Class mastery change: ' + Math.round(improvementPoints) + ' percentage points'}
        >
          <div className="ip-gap-change">
            +{Math.round(improvementPoints)}%
          </div>
          <div className="ip-gap-change-label">class mastery</div>
        </div>

        <div className="ip-gap-actions">
          <button
            className="yns-btn secondary yns-details-btn"
            type="button"
            onClick={onView}
            aria-label={'View drill-down details for ' + misconceptionTitle}
          >
            View details
          </button>
        </div>
      </>
    )}
  </div>
);

const InterventionPatterns = ({ nextSteps = [] }) => {
  const [selectedTrend, setSelectedTrend] = useState(null);

  const completedItems = useMemo(() => {
    const seen = new Set();
    return (nextSteps || [])
      .filter((x) => x != null && x.status === 'completed' && x.moveTitle)
      .filter((x) => {
        const key = x.moveId != null ? x.moveId : (x.moveTitle + '__' + x.gapGroupTitle);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((item) => {
        const beforeCount = item.studentCount != null ? item.studentCount : 0;
        const pct = item.studentPercent;
        const classSize = (pct && pct > 0 && beforeCount > 0)
          ? Math.round(beforeCount / (pct / 100))
          : Math.max(beforeCount, 1);
        const reduction = clamp(2, 0, beforeCount);
        const afterCount = clamp(beforeCount - reduction, 0, classSize);
        const beforePercent = ((classSize - beforeCount) / classSize) * 100;
        const afterPercent = ((classSize - afterCount) / classSize) * 100;
        const improvementPoints = clamp(afterPercent - beforePercent, 0, 100);
        return {
          ...item,
          beforeCount,
          afterCount,
          improvementPoints,
          improvedCount: beforeCount - afterCount,
        };
      });
  }, [nextSteps]);

  return (
    <div className="intervention-patterns">
      <LearningGapTrendDetailsModal
        isOpen={selectedTrend != null}
        gapName={selectedTrend != null ? selectedTrend.gapGroupTitle : null}
        beforeCount={selectedTrend != null ? selectedTrend.beforeCount : 0}
        afterCount={selectedTrend != null ? selectedTrend.afterCount : 0}
        improvementPoints={selectedTrend != null ? selectedTrend.improvementPoints : 0}
        onClose={() => setSelectedTrend(null)}
      />

      <div className="ip-header">
        <h3 className="ip-title">Next Steps You Implemented</h3>
      </div>

      {completedItems.length === 0 ? (
        <div className="ip-empty">
          Once next steps in the <strong>Prepare</strong> tab have been marked complete and follow-up quiz results are available, a summary of student learning outcomes will be displayed here.
        </div>
      ) : (
        <div className="ip-trends" aria-label="Trends in learning goals">
          {completedItems.map((item) => {
            const key = item.moveId != null ? item.moveId : (item.moveTitle + '__' + item.gapGroupTitle);
            return (
              <LearningGapTrendCard
                key={key}
                moveTitle={item.moveTitle}
                ccssStandard={item.targetObjectiveStandard}
                misconceptionTitle={item.gapGroupTitle}
                hasResults={false}
                improvedCount={item.improvedCount}
                improvementPoints={item.improvementPoints}
                onView={() => setSelectedTrend(item)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterventionPatterns;
