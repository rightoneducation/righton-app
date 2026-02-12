import React, { useMemo, useRef, useState } from 'react';
import './YourNextSteps.css';

const formatTime = (ms) => {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return '';
  }
};

const YourNextSteps = ({
  nextSteps = [],
  completedCount = 0,
  sort = 'manual',
  onChangeSort,
  onRemove,
  onMarkComplete,
  onReorder
}) => {
  const getPriorityClass = (priority) => {
    if (priority === 'Critical') return 'priority-critical';
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  const [expandedId, setExpandedId] = useState(null);
  const draggingIdRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // { id: string, position: 'above' | 'below' }

  const setDropTargetIfChanged = (next) => {
    setDropTarget((prev) => {
      if (!prev && !next) return prev;
      if (prev?.id === next?.id && prev?.position === next?.position) return prev;
      return next;
    });
  };

  const summary = useMemo(() => {
    const planned = nextSteps.filter((x) => x.status !== 'completed').length;
    const completedInList = nextSteps.filter((x) => x.status === 'completed').length;
    const completed = nextSteps.length === 0 ? completedCount : completedInList;
    return { planned, completed, total: nextSteps.length };
  }, [nextSteps, completedCount]);

  return (
    <div className="your-next-steps">
      <div className="yns-header">
        <div>
          <h3 className="yns-title">Your Next Steps</h3>
          <p className="yns-subtitle">
            Saved instructional moves you plan to run. ({summary.planned} planned • {summary.completed} completed)
          </p>
        </div>

        <div className="yns-controls">
          <label className="yns-sort">
            Sort
            <select value={sort} onChange={(e) => onChangeSort?.(e.target.value)}>
              <option value="manual">Manual</option>
              <option value="newest">Newest</option>
              <option value="priority">Priority</option>
            </select>
          </label>
        </div>
      </div>

      {nextSteps.length === 0 ? (
        <div className="yns-empty">
          <div className="yns-empty-title">No next steps yet</div>
          <div className="yns-empty-body">
            Go to <strong>Recommended Next Steps</strong> and click <strong>Add to Your Next Steps</strong>.
          </div>
        </div>
      ) : (
        <div className="yns-list">
          {nextSteps.map((item) => {
            const expanded = expandedId === item.id;
            const isCompleted = item.status === 'completed';
            const showDropAbove =
              sort === 'manual' &&
              !!draggingId &&
              draggingId !== item.id &&
              dropTarget?.id === item.id &&
              dropTarget?.position === 'above';
            const showDropBelow =
              sort === 'manual' &&
              !!draggingId &&
              draggingId !== item.id &&
              dropTarget?.id === item.id &&
              dropTarget?.position === 'below';

            return (
              <React.Fragment key={item.id}>
                {showDropAbove && <div className="yns-drop-indicator" aria-hidden="true" />}

                <div className="yns-row" data-itemid={item.id}>
                  <div
                    className={`yns-item ${isCompleted ? 'completed' : ''} ${sort === 'manual' ? 'draggable' : ''}`}
                    draggable={sort === 'manual'}
                    onDragStart={(e) => {
                      if (sort !== 'manual') return;

                      // Avoid starting a drag when interacting with buttons/controls.
                      const isInteractive = !!e.target.closest('button, a, input, select, textarea');
                      const isHandle = !!e.target.closest('.yns-drag-handle');
                      if (isInteractive && !isHandle) return;

                      draggingIdRef.current = item.id;
                      setDraggingId(item.id);
                      setDropTarget(null);
                      // Required in some browsers for drag to start.
                      e.dataTransfer.setData('text/plain', item.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => {
                      if (sort !== 'manual') return;
                      draggingIdRef.current = null;
                      setDraggingId(null);
                      setDropTarget(null);
                    }}
                    onDragOver={(e) => {
                      if (sort !== 'manual') return;
                      if (!draggingIdRef.current) return;
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const midY = rect.top + rect.height / 2;
                      const position = e.clientY < midY ? 'above' : 'below';
                      setDropTargetIfChanged({ id: item.id, position });
                    }}
                    onDrop={(e) => {
                      if (sort !== 'manual') return;
                      e.preventDefault();
                      const dragId = draggingIdRef.current;
                      const dropId = item.id;
                      const position = dropTarget?.id === dropId ? dropTarget.position : 'below';
                      draggingIdRef.current = null;
                      setDraggingId(null);
                      setDropTarget(null);
                      if (!dragId || dragId === dropId) return;
                      onReorder?.(dragId, dropId, position);
                    }}
                  >
                    <div className="yns-item-top">
                      <div className="yns-drag-col">
                        <button
                          className="yns-drag-handle"
                          type="button"
                          draggable={false}
                          aria-label={
                            sort === 'manual'
                              ? `Drag to reorder: ${item.moveTitle}`
                              : 'Switch sort to Manual to reorder'
                          }
                          title={
                            sort === 'manual'
                              ? 'Drag to reorder'
                              : 'Switch sort to Manual to reorder'
                          }
                        >
                          <span className="yns-grip" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        </button>
                      </div>

                      <div className="yns-item-main">
                        <div className="yns-item-title-row">
                          <div className="yns-item-title">
                            {item.moveTitle}
                            {item.moveTime ? (
                              <span className="yns-title-time">
                                <span className="yns-title-sep" aria-hidden="true">|</span>
                                <span className="yns-title-time-text">{item.moveTime}</span>
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="yns-item-meta">
                          <span className={`students-pill ${getPriorityClass(item.priority)} yns-students-pill`}>
                            {item.studentCount} students ({item.studentPercent}%)
                          </span>
                          <span className="yns-meta-pill">{item.gapGroupTitle}</span>
                          {item.moveFormat && <span className="yns-meta-pill">{item.moveFormat}</span>}
                        </div>
                      </div>

                      <div className="yns-item-actions">
                        <div className="yns-item-actions-top">
                          <button
                            className="yns-details-toggle"
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : item.id)}
                            aria-expanded={expanded}
                            aria-controls={`yns-details-${item.id}`}
                          >
                            <span>{expanded ? 'Hide details' : 'View details'}</span>
                            <span className={`yns-caret ${expanded ? 'up' : 'down'}`} aria-hidden="true" />
                          </button>

                          <button
                            className="yns-btn primary yns-complete-btn"
                            type="button"
                            onClick={() => onMarkComplete?.(item.id)}
                            aria-label={`Complete next step: ${item.moveTitle}`}
                            title="Complete"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>

                    {expanded && (
                      <div className="yns-details" id={`yns-details-${item.id}`}>
                        <div className="yns-details-row">
                          <div className="yns-details-label">Summary</div>
                          <div className="yns-details-value">{item.moveSummary}</div>
                        </div>

                        <div className="yns-details-row">
                          <div className="yns-details-label">AI reasoning</div>
                          <div className="yns-details-value">{item.aiReasoning}</div>
                        </div>

                        <div className="yns-details-row">
                          <div className="yns-details-label">Addresses</div>
                          <div className="yns-details-value">
                            <ul className="yns-gap-list">
                              {(item.gaps || []).map((g, idx) => <li key={idx}>{g}</li>)}
                            </ul>
                          </div>
                        </div>

                        {item.evidence && (
                          <div className="yns-details-evidence">
                            <div className="yns-evidence-title">Evidence</div>
                            <div className="yns-evidence-grid">
                              <div>
                                <div className="yns-ev-label">Data source</div>
                                <div className="yns-ev-value">{item.evidence.source}</div>
                              </div>
                              <div>
                                <div className="yns-ev-label">Most common error</div>
                                <div className="yns-ev-value">{item.evidence.mostCommonError}</div>
                              </div>
                              <div className="yns-ev-wide">
                                <div className="yns-ev-label">AI thinking pattern</div>
                                <div className="yns-ev-value">{item.evidence.aiThinkingPattern}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="yns-details-row">
                          <div className="yns-details-label">Created</div>
                          <div className="yns-details-value">{formatTime(item.createdAt)}</div>
                        </div>

                        {item.completedAt && (
                          <div className="yns-details-row">
                            <div className="yns-details-label">Completed</div>
                            <div className="yns-details-value">{formatTime(item.completedAt)}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    className="yns-icon-btn yns-trash-btn yns-trash-outside"
                    type="button"
                    onClick={() => onRemove?.(item.id)}
                    aria-label={`Delete next step: ${item.moveTitle}`}
                    title="Delete"
                  >
                    <svg
                      className="yns-trash-icon"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M9 3h6l1 2h5v2H3V5h5l1-2Zm1 7h2v9h-2v-9Zm4 0h2v9h-2v-9ZM7 10h2v9H7v-9Zm-1 12h12a2 2 0 0 0 2-2V8H4v12a2 2 0 0 0 2 2Z"
                      />
                    </svg>
                  </button>
                </div>
              
                {showDropBelow && <div className="yns-drop-indicator" aria-hidden="true" />}
              </React.Fragment>
            );
          })}

          {/* Drop zone to allow reordering to the end, with a clear slot indicator line */}
          {sort === 'manual' && draggingId && dropTarget?.id === '__end__' && (
            <div className="yns-drop-indicator" aria-hidden="true" />
          )}
          {sort === 'manual' && (
            <div
              className="yns-drop-end-zone"
              onDragOver={(e) => {
                if (!draggingIdRef.current) return;
                e.preventDefault();
                setDropTargetIfChanged({ id: '__end__', position: 'below' });
              }}
              onDrop={(e) => {
                e.preventDefault();
                const dragId = draggingIdRef.current;
                draggingIdRef.current = null;
                setDraggingId(null);
                setDropTarget(null);
                if (!dragId) return;
                onReorder?.(dragId, null, 'below');
              }}
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default YourNextSteps;
