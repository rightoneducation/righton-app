import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import StudentRoster from './components/StudentRoster';
import RecommendedNextSteps, { buildMockGapGroups } from './components/RecommendedNextSteps';
import YourNextSteps from './components/YourNextSteps';
import InterventionPatterns from './components/InterventionPatterns';
import './App.css';

const LS_NEXT_STEPS_KEY = 'microcoach.nextSteps.v1';
const LS_NEXT_STEPS_HISTORY_KEY = 'microcoach.nextSteps.history.v1';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeOverviewSection, setActiveOverviewSection] = useState('Recommended Next Steps');
  const [dateRange, setDateRange] = useState('Last 30 days');

  const [nextSteps, setNextSteps] = useState([]);
  const [nextStepsSort, setNextStepsSort] = useState('manual');
  const [nextStepsHistory, setNextStepsHistory] = useState([]);

  const enrichSavedNextStep = (item) => {
    // Backward compatibility:
    // - Older saved items may not include the rich `move` object (with `tabs`) or
    //   some gap-group fields needed for the Full View modal.
    // - We enrich from the current mock catalog when possible.
    try {
      const gapGroups = buildMockGapGroups();
      const match = gapGroups.find((g) => g.id === item?.gapGroupId && g.move?.id === item?.moveId);

      const fallbackMove = item?.move
        ? item.move
        : {
            id: item?.moveId,
            title: item?.moveTitle,
            time: item?.moveTime,
            format: item?.moveFormat,
            summary: item?.moveSummary,
            aiReasoning: item?.aiReasoning,
            tabs: undefined
          };

      const enrichedMove = match?.move
        ? {
            id: match.move.id,
            title: match.move.title,
            time: match.move.time,
            format: match.move.format,
            summary: match.move.summary,
            aiReasoning: match.move.aiReasoning,
            tabs: match.move.tabs
          }
        : fallbackMove;

      return {
        ...item,
        // Only fill if missing on the saved item
        occurrence: item?.occurrence ?? match?.occurrence,
        misconceptionSummary: item?.misconceptionSummary ?? match?.misconceptionSummary,
        successIndicators: item?.successIndicators ?? match?.successIndicators,
        targetObjectiveStandard:
          item?.targetObjectiveStandard ?? match?.ccssStandards?.targetObjective?.standard,
        // Ensure we always have a `move` object for the modal
        move: enrichedMove
      };
    } catch {
      return item;
    }
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_NEXT_STEPS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setNextSteps(parsed.map(enrichSavedNextStep));
    } catch (e) {
      // no-op (corrupt storage should not break the app)
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_NEXT_STEPS_HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setNextStepsHistory(
          parsed.map((h) => ({
            ...h,
            items: Array.isArray(h?.items) ? h.items.map(enrichSavedNextStep) : h?.items
          }))
        );
      }
    } catch (e) {
      // no-op
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_NEXT_STEPS_KEY, JSON.stringify(nextSteps));
    } catch (e) {
      // no-op (storage may be disabled)
    }
  }, [nextSteps]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_NEXT_STEPS_HISTORY_KEY, JSON.stringify(nextStepsHistory));
    } catch (e) {
      // no-op
    }
  }, [nextStepsHistory]);

  const sortedNextSteps = useMemo(() => {
    if (nextStepsSort === 'manual') return nextSteps;

    const copy = [...nextSteps];
    if (nextStepsSort === 'newest') {
      copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    if (nextStepsSort === 'priority') {
      const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      copy.sort((a, b) => (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99));
    }
    return copy;
  }, [nextSteps, nextStepsSort]);

  const completedNextStepsCount = useMemo(() => {
    return (nextStepsHistory || []).reduce((sum, h) => sum + ((h?.items?.length || 0)), 0);
  }, [nextStepsHistory]);

  const addNextStep = (gapGroup, move) => {
    const inferredGaps = Array.isArray(gapGroup?.gaps)
      ? gapGroup.gaps
      : (gapGroup?.title ? [gapGroup.title] : []);

    // Ensure we persist the same rich “move” object shape used by Recommended Next Steps
    // so Saved Next Steps can open the identical Full View modal.
    const normalizedMove = move
      ? {
          id: move.id,
          title: move.title,
          time: move.time,
          format: move.format,
          summary: move.summary,
          aiReasoning: move.aiReasoning,
          tabs: move.tabs
        }
      : null;

    const newItem = {
      id: `${gapGroup.id}-${move.id}-${Date.now()}`,
      createdAt: Date.now(),
      status: 'planned', // planned | completed
      gapGroupId: gapGroup.id,
      gapGroupTitle: gapGroup.title,
      // Learning objective standard (e.g., "8.EE.7") used as a pill in Saved Next Steps + Intervention Patterns
      targetObjectiveStandard: gapGroup?.ccssStandards?.targetObjective?.standard,
      priority: gapGroup.priority,
      studentCount: gapGroup.studentCount,
      studentPercent: gapGroup.studentPercent,
      occurrence: gapGroup.occurrence,
      misconceptionSummary: gapGroup.misconceptionSummary,
      successIndicators: gapGroup.successIndicators,
      gaps: inferredGaps,
      moveId: move.id,
      moveTitle: move.title,
      moveTime: move.time,
      moveFormat: move.format,
      moveSummary: move.summary,
      aiReasoning: move.aiReasoning,
      evidence: gapGroup.evidence,
      move: normalizedMove
    };
    setNextSteps((prev) => [newItem, ...prev]);
  };

  const removeNextStep = (id) => {
    setNextSteps((prev) => prev.filter((x) => x.id !== id));
  };

  const completeNextStep = (id) => {
    const existing = nextSteps.find((x) => x.id === id);
    if (!existing) return;

    const completedAt = Date.now();
    const completedItem = { ...existing, status: 'completed', completedAt };

    setNextStepsHistory((prev) => [
      {
        id: `yns-item-${id}-${completedAt}`,
        completedAt,
        items: [completedItem]
      },
      ...(prev || [])
    ]);

    // Remove from active list after archiving.
    setNextSteps((prev) => prev.filter((x) => x.id !== id));
  };

  const reorderNextSteps = (dragId, dropId, position = 'below') => {
    // Only makes sense in manual mode.
    if (nextStepsSort !== 'manual') return;

    setNextSteps((prev) => {
      const dragIdx = prev.findIndex((x) => x.id === dragId);
      if (dragIdx < 0) return prev;

      // If dropId is null/undefined, move to end.
      const dropIdx = dropId ? prev.findIndex((x) => x.id === dropId) : prev.length;
      if (dropIdx < 0) return prev;
      if (dropIdx === dragIdx) return prev;

      const copy = [...prev];
      const [dragItem] = copy.splice(dragIdx, 1);
      let insertIdx;
      if (!dropId) {
        insertIdx = copy.length;
      } else {
        // dropIdx was computed from the original array (before splice). After removing the drag item,
        // the target index may shift by -1 if the dragged item was above the target.
        const adjustedDropIdx = dragIdx < dropIdx ? dropIdx - 1 : dropIdx;
        insertIdx = position === 'above' ? adjustedDropIdx : adjustedDropIdx + 1;
      }

      insertIdx = Math.min(Math.max(insertIdx, 0), copy.length);
      copy.splice(insertIdx, 0, dragItem);
      return copy;
    });
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // Here you would typically fetch new data based on the date range
  };

  const handleExportSummary = () => {
    // Handle export functionality
    console.log('Exporting summary...');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') {
      setActiveOverviewSection('Recommended Next Steps');
    }
  };

  const handleOverviewSectionChange = (section) => {
    setActiveOverviewSection(section);
  };

  return (
    <div className="app">
      <Header 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExportSummary={handleExportSummary}
      />
      
      <NavigationTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <main className="main-content">
        {activeTab === 'Overview' && (
          <div className="overview-content">
            <div className="overview-navigation">
              <nav className="overview-nav-tabs" aria-label="Overview workflow">
                <button
                  className={`overview-nav-tab ${activeOverviewSection === 'Recommended Next Steps' ? 'active' : ''}`}
                  onClick={() => handleOverviewSectionChange('Recommended Next Steps')}
                  type="button"
                >
                  1. Understand & Select
                </button>
                <span className="overview-nav-separator" aria-hidden="true">
                  &gt;
                </span>
                <button
                  className={`overview-nav-tab ${activeOverviewSection === 'Saved Next Steps' ? 'active' : ''}`}
                  onClick={() => handleOverviewSectionChange('Saved Next Steps')}
                  type="button"
                >
                  2. Prepare
                </button>
                <span className="overview-nav-separator" aria-hidden="true">
                  &gt;
                </span>
                <button
                  className={`overview-nav-tab ${activeOverviewSection === 'Your Intervention Patterns' ? 'active' : ''}`}
                  onClick={() => handleOverviewSectionChange('Your Intervention Patterns')}
                  type="button"
                >
                  3. Reflect
                </button>
              </nav>
            </div>

            {activeOverviewSection === 'Recommended Next Steps' && (
              <div className="remediation-section">
                <RecommendedNextSteps
                  onAddNextStep={addNextStep}
                  existingNextSteps={nextSteps}
                />
              </div>
            )}

            {activeOverviewSection === 'Saved Next Steps' && (
              <div className="trends-section">
                <YourNextSteps
                  nextSteps={sortedNextSteps}
                  completedNextSteps={nextStepsHistory.flatMap((h) => h.items || [])}
                  completedCount={completedNextStepsCount}
                  sort={nextStepsSort}
                  onChangeSort={setNextStepsSort}
                  onRemove={removeNextStep}
                  onMarkComplete={completeNextStep}
                  onReorder={reorderNextSteps}
                />
              </div>
            )}

            {activeOverviewSection === 'Your Intervention Patterns' && (
              <div className="trends-section">
                <InterventionPatterns
                  nextSteps={[...nextSteps, ...(nextStepsHistory.flatMap((h) => h.items || []))]}
                />
              </div>
            )}

          </div>
        )}
        
        {activeTab === 'Students' && (
          <div className="students-content">
            <StudentRoster />
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;
