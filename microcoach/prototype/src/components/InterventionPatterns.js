import React, { useMemo, useState } from 'react';
import './InterventionPatterns.css';
import './SharedButtons.css';
import './YourNextSteps.css';
import './RecommendedNextSteps.css';
import LearningGapTrendDetailsModal from './LearningGapTrendDetailsModal';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const getStandardComponents = (ccssStandards) => {
  return (ccssStandards?.targetObjective?.learningComponents ?? []).slice(0, 3);
};

const renderStandardPill = (ccssStandard, ccssStandards) => {
  if (!ccssStandard) return null;

  const learningComponents = getStandardComponents(ccssStandards);
  const standardName = ccssStandards?.targetObjective?.description || ccssStandard;

  return (
    <span className="yns-standard-pill-wrap">
      <span
        className="ccss-tag target-objective yns-standard-pill"
        aria-label={`Learning objective standard ${ccssStandard}`}
        tabIndex={0}
      >
        {ccssStandard}
      </span>

      <div className="yns-standard-hover-card" role="tooltip">
        <div className="yns-standard-hover-title">{standardName}</div>
        <div className="yns-standard-hover-subtitle">Related Learning Components</div>

        <div className="yns-kg-diagram" aria-label={`Relationship diagram for ${ccssStandard}`}>
          <span className="ccss-tag target-objective yns-kg-standard-node">{ccssStandard}</span>

          <div className="yns-kg-right">
            {learningComponents.map((component) => (
              <div key={`${ccssStandard}-${component}`} className="yns-kg-row">
                <span className="yns-kg-link" aria-hidden="true" />
                <span className="yns-kg-component-node">{component}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </span>
  );
};

const LearningGapTrendCard = ({
  moveTitle,
  ccssStandard,
  ccssStandards,
  misconceptionTitle,
  hasResults,
  improvedCount,
  classMasteryBefore,
  classMasteryAfter,
  onView,
}) => (
  <div className="ip-gap-card">
    <div className="ip-gap-left">
      <div className="ip-gap-name">{moveTitle}</div>
      <div className="ip-gap-addresses">
        <span className="ip-gap-addresses-label">Addresses:</span>
        {renderStandardPill(ccssStandard, ccssStandards)}
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
          aria-label={`Class mastery: ${classMasteryBefore}% to ${classMasteryAfter}%`}
        >
          <div className="ip-gap-change">
            {classMasteryBefore}% → {classMasteryAfter}%
          </div>
          <div className="ip-gap-change-label">Class mastery improvement</div>
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

const InterventionPatterns = ({ nextSteps = [], gapGroups = [] }) => {
  const [selectedTrend, setSelectedTrend] = useState(null);

  // Build a lookup from gap group title to its postPpqResults
  const postPpqByTitle = useMemo(() => {
    const map = {};
    for (const g of gapGroups) {
      if (g && g.title && g.postPpqResults) map[g.title] = g.postPpqResults;
    }
    return map;
  }, [gapGroups]);

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
        // Check for real post-PPQ results via gap group title
        const ppqResults = item.gapGroupTitle ? postPpqByTitle[item.gapGroupTitle] : null;

        if (ppqResults && ppqResults.hasResults) {
          return {
            ...item,
            postPpqResults: ppqResults,
            beforeCount: ppqResults.beforeCount,
            afterCount: ppqResults.afterCount,
            improvementPoints: ppqResults.improvementPoints,
            improvedCount: ppqResults.improvedCount,
          };
        }

        // Fallback: mock math
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
          postPpqResults: null,
          beforeCount,
          afterCount,
          improvementPoints,
          improvedCount: beforeCount - afterCount,
        };
      });
  }, [nextSteps, postPpqByTitle]);

  return (
    <div className="intervention-patterns">
      <LearningGapTrendDetailsModal
        isOpen={selectedTrend != null}
        gapName={selectedTrend != null ? selectedTrend.gapGroupTitle : null}
        beforeCount={selectedTrend != null ? selectedTrend.beforeCount : 0}
        afterCount={selectedTrend != null ? selectedTrend.afterCount : 0}
        improvementPoints={selectedTrend != null ? selectedTrend.improvementPoints : 0}
        classMasteryBefore={selectedTrend?.postPpqResults?.classMasteryBefore ?? null}
        classMasteryAfter={selectedTrend?.postPpqResults?.classMasteryAfter ?? null}
        studentsImproved={selectedTrend?.postPpqResults?.studentsImproved ?? []}
        studentsStillNeedHelp={selectedTrend?.postPpqResults?.studentsStillNeedHelp ?? []}
        studentsNewlySurfaced={selectedTrend?.postPpqResults?.studentsNewlySurfaced ?? []}
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
                ccssStandards={item.ccssStandards}
                misconceptionTitle={item.gapGroupTitle}
                hasResults={!!item.postPpqResults?.hasResults}
                improvedCount={item.improvedCount}
                classMasteryBefore={item.postPpqResults?.classMasteryBefore ?? null}
                classMasteryAfter={item.postPpqResults?.classMasteryAfter ?? null}
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
