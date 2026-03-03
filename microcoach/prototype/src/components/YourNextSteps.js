import React, { useEffect, useMemo, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './YourNextSteps.css';
import './SharedButtons.css';
import NextStepDetailsModal from './NextStepDetailsModal';

const YourNextSteps = ({
  nextSteps = [],
  completedNextSteps = [],
  completedCount = 0,
  sort = 'manual',
  onChangeSort,
  onRemove,
  onMarkComplete,
  onReorder,
  isLoading = false,
}) => {
  const getStandardComponents = (item) => {
    const description = item?.ccssStandards?.targetObjective?.description || '';
    if (!description) return [];
    return description
      .split(/,| and /i)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 3);
  };

  const getPriorityClass = (priority) => {
    if (priority === 'Critical') return 'priority-critical';
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  const [detailsModalId, setDetailsModalId] = useState(null);
  const [detailsActiveTab, setDetailsActiveTab] = useState('overview');
  const draggingIdRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // { id: string, position: 'above' | 'below' }

  const [toast, setToast] = useState(null); // { id: number, message: string } | null
  const toastTimersRef = useRef({ show: null, remove: null, clear: null });
  const completionTimersRef = useRef({ complete: null });
  const [movingToReflectId, setMovingToReflectId] = useState(null);
  const [movingVector, setMovingVector] = useState({ dx: 220, dy: -170 });

  const clearToastTimers = () => {
    const timers = toastTimersRef.current;
    if (timers.show) window.clearTimeout(timers.show);
    if (timers.remove) window.clearTimeout(timers.remove);
    if (timers.clear) window.clearTimeout(timers.clear);
    toastTimersRef.current = { show: null, remove: null, clear: null };
  };

  const showToast = (message) => {
    // Force a remount so we can reliably re-trigger the slide/opacity animation,
    // matching the interaction style from Recommended Next Steps.
    setToast({ id: Date.now(), message });
    clearToastTimers();

    // Let React paint the toast first, then apply the show/removing classes.
    toastTimersRef.current.show = window.setTimeout(() => {
      const el = document.querySelector('.yns-toast');
      if (!el) return;
      el.classList.remove('removing');
      el.classList.add('show');
    }, 50);

    toastTimersRef.current.remove = window.setTimeout(() => {
      const el = document.querySelector('.yns-toast');
      if (el) el.classList.add('removing');
      toastTimersRef.current.clear = window.setTimeout(() => setToast(null), 300);
    }, 2000);
  };

  useEffect(() => {
    const completionTimers = completionTimersRef.current;

    return () => {
      clearToastTimers();
      if (completionTimers.complete) {
        window.clearTimeout(completionTimers.complete);
      }
    };
  }, []);

  const allItemsForDetails = useMemo(() => {
    return [...(nextSteps || []), ...(completedNextSteps || [])];
  }, [nextSteps, completedNextSteps]);

  const detailsItem = useMemo(() => {
    if (!detailsModalId) return null;
    return allItemsForDetails.find((x) => x.id === detailsModalId) ?? null;
  }, [detailsModalId, allItemsForDetails]);

  const setDropTargetIfChanged = (next) => {
    setDropTarget((prev) => {
      if (!prev && !next) return prev;
      if (prev?.id === next?.id && prev?.position === next?.position) return prev;
      return next;
    });
  };

  const plannedItems = useMemo(() => {
    // Be defensive: `nextSteps` should already be planned-only, but older
    // localStorage shapes may still include `status: 'completed'`.
    return (nextSteps || []).filter((x) => x?.status !== 'completed');
  }, [nextSteps]);

  const renderStandardPill = (item) => {
    const standard = item?.targetObjectiveStandard;
    if (!standard) return null;

    const learningComponents = getStandardComponents(item);
    const standardName = item?.ccssStandards?.targetObjective?.description || standard;

    return (
      <span className="yns-standard-pill-wrap">
        <span
          className="ccss-tag target-objective yns-standard-pill"
          aria-label={`Learning objective standard ${standard}`}
          tabIndex={0}
        >
          {standard}
        </span>

        <div className="yns-standard-hover-card" role="tooltip">
          <div className="yns-standard-hover-title">{standardName}</div>
          <div className="yns-standard-hover-subtitle">Learning Components Diagram</div>

          <div className="yns-kg-diagram" aria-label={`Relationship diagram for ${standard}`}>
            <span className="ccss-tag target-objective yns-kg-standard-node">{standard}</span>

            <div className="yns-kg-right">
              {learningComponents.map((component) => (
                <div key={`${standard}-${component}`} className="yns-kg-row">
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

  const handleRemove = (item) => {
    onRemove?.(item.id);
    showToast(`Deleted "${item.moveTitle}" from Saved Next Steps`);
  };

  const getReflectVector = (fromElement) => {
    const reflectTab = document.querySelector('[data-reflect-tab-target="true"]');
    const fromRect = fromElement?.getBoundingClientRect?.();
    const toRect = reflectTab?.getBoundingClientRect?.();

    if (!fromRect || !toRect) {
      return { dx: 220, dy: -170 };
    }

    // Animation transform-origin is `top right`, so compute the motion vector from
    // the card's top-right anchor to a point inside the Reflect tab.
    const fromAnchorX = fromRect.right;
    const fromAnchorY = fromRect.top;

    // Aim for the tab's center-left area (instead of dead-center) so the item
    // visually gets sucked into the tab body rather than overshooting right.
    const toAnchorX = toRect.left + (toRect.width * 0.42);
    const toAnchorY = toRect.top + (toRect.height * 0.5);

    return {
      dx: Math.round(toAnchorX - fromAnchorX),
      dy: Math.round(toAnchorY - fromAnchorY)
    };
  };

  const pulseReflectTab = () => {
    const reflectTab = document.querySelector('[data-reflect-tab-target="true"]');
    if (!reflectTab) return;
    reflectTab.classList.add('yns-reflect-target-glow');
    window.setTimeout(() => reflectTab.classList.remove('yns-reflect-target-glow'), 520);
  };

  const handleComplete = (item, event) => {
    if (movingToReflectId) return;

    const itemElement = event?.currentTarget?.closest('.yns-item');
    setMovingVector(getReflectVector(itemElement));
    pulseReflectTab();
    setMovingToReflectId(item.id);
    showToast(`Moving "${item.moveTitle}" to 3. Reflect...`);

    completionTimersRef.current.complete = window.setTimeout(() => {
      onMarkComplete?.(item.id);
      setMovingToReflectId(null);
    }, 780);
  };

  return (
    <div className="your-next-steps">
      <NextStepDetailsModal
        isOpen={!!detailsItem}
        title={detailsItem?.gapGroupTitle}
        priority={detailsItem?.priority}
        studentCount={detailsItem?.studentCount}
        studentPercent={detailsItem?.studentPercent}
        occurrence={detailsItem?.occurrence}
        misconceptionSummary={detailsItem?.misconceptionSummary}
        ccssStandards={detailsItem?.ccssStandards}
        successIndicators={detailsItem?.successIndicators}
        move={detailsItem?.move}
        activeTab={detailsActiveTab}
        onChangeTab={setDetailsActiveTab}
        onClose={() => {
          setDetailsModalId(null);
          setDetailsActiveTab('overview');
        }}
        actions={null}
      />

      {toast && (
        <div key={toast.id} className="yns-toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <div className="yns-header">
        <div>
          <h3 className="yns-title">Saved Activities</h3>
          <p className="yns-subtitle">
            Review the instructional moves you’ve saved for your class. Mark activities complete after you run them so MicroCoach can track progress over time.
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

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <CircularProgress />
        </div>
      ) : plannedItems.length === 0 && (!completedNextSteps || completedNextSteps.length === 0) ? (
        <div className="yns-empty">
          <div className="yns-empty-title">No next steps yet</div>
          <div className="yns-empty-body">
            Go to <strong>Recommended Next Steps</strong> and click <strong>Add to Saved Next Steps</strong>.
          </div>
        </div>
      ) : (
        <div className="yns-list">
          {plannedItems.length === 0 ? (
            <div className="yns-planned-empty">
              No planned next steps right now.
            </div>
          ) : plannedItems.map((item) => {
            const isMovingToReflect = movingToReflectId === item.id;
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
                    className={`yns-item ${isMovingToReflect ? 'moving-to-reflect' : ''} ${sort === 'manual' ? 'draggable' : ''}`}
                    style={
                      isMovingToReflect
                        ? {
                            '--yns-move-x': `${movingVector.dx}px`,
                            '--yns-move-y': `${movingVector.dy}px`
                          }
                        : undefined
                    }
                    draggable={sort === 'manual' && !isMovingToReflect}
                    onDragStart={(e) => {
                      if (sort !== 'manual') return;
                      if (isMovingToReflect) return;

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
                            {/* 6-dot grip icon (2 columns × 3 rows) */}
                            <span />
                            <span />
                            <span />
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
                          {renderStandardPill(item)}
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
                            className="yns-btn secondary yns-details-btn"
                            type="button"
                            onClick={() => {
                              setDetailsModalId(item.id);
                              setDetailsActiveTab('overview');
                            }}
                            aria-label={`View details for saved next step: ${item.moveTitle}`}
                          >
                            View details
                          </button>

                          <button
                            className="yns-btn primary yns-complete-btn"
                            type="button"
                            onClick={(e) => handleComplete(item, e)}
                            disabled={!!movingToReflectId}
                            aria-disabled={!!movingToReflectId}
                            aria-label={`Complete next step: ${item.moveTitle}`}
                            title="Complete"
                          >
                            {isMovingToReflect ? 'Moving to Reflect...' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="yns-icon-btn yns-trash-btn yns-trash-outside"
                    type="button"
                    onClick={() => handleRemove(item)}
                    disabled={!!movingToReflectId}
                    aria-disabled={!!movingToReflectId}
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
          {sort === 'manual' && plannedItems.length > 0 && draggingId && dropTarget?.id === '__end__' && (
            <div className="yns-drop-indicator" aria-hidden="true" />
          )}
          {sort === 'manual' && plannedItems.length > 0 && (
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

      {/* Completed section */}
      <div className="yns-completed-section" aria-label="Completed next steps">
        <div className="yns-completed-header">
          <div className="yns-completed-title-row">
            <h3 className="yns-completed-title">Completed</h3>
            <div className="yns-completed-count">{completedNextSteps?.length ?? 0}</div>
          </div>
        </div>

        <div className="yns-completed-panel">
          {(!completedNextSteps || completedNextSteps.length === 0) ? (
            <div className="yns-completed-empty">
              Completed items will appear here.
            </div>
          ) : (
            <div className="yns-completed-list">
              {completedNextSteps
                .slice()
                .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                .map((item) => (
                  <div key={item.id} className="yns-completed-item">
                    <div className="yns-completed-item-main">
                      <div className="yns-completed-item-title">{item.moveTitle}</div>
                      <div className="yns-completed-item-meta">
                        {renderStandardPill(item)}
                        <span className="yns-meta-pill">{item.gapGroupTitle}</span>
                        {item.moveFormat && <span className="yns-meta-pill">{item.moveFormat}</span>}
                      </div>
                    </div>

                    <div className="yns-completed-actions">
                      <button
                        className="yns-btn secondary yns-details-btn"
                        type="button"
                        onClick={() => {
                          setDetailsModalId(item.id);
                          setDetailsActiveTab('overview');
                        }}
                        aria-label={`View details for completed next step: ${item.moveTitle}`}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourNextSteps;
