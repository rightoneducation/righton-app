import React, { useEffect, useMemo, useRef, useState } from 'react';
import { APIClient } from '@righton/microcoach-api';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import StudentRoster from './components/StudentRoster';
import RecommendedNextSteps from './components/RecommendedNextSteps';
import YourNextSteps from './components/YourNextSteps';
import InterventionPatterns from './components/InterventionPatterns';
import './App.css';


function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeOverviewSection, setActiveOverviewSection] = useState('Recommended Next Steps');
  const [dateRange, setDateRange] = useState('Last 30 days');

  const [nextSteps, setNextSteps] = useState([]);
  const [nextStepsSort, setNextStepsSort] = useState('manual');
  const [nextStepsHistory, setNextStepsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextSteps, setIsLoadingNextSteps] = useState(true);
  const [aiGapGroups, setAiGapGroups] = useState(null);
  const [classroomStudents, setClassroomStudents] = useState(null);

  // Refs so CRUD handlers can reach the API without being inside the fetch useEffect
  const apiClientRef = useRef(null);
  const classroomIdRef = useRef(null);

  // Map a backend SavedNextStep record back to the local item shape used by the UI
  const dbItemToLocal = (db) => ({
    id: db.id,
    createdAt: db.createdAt ? new Date(db.createdAt).getTime() : Date.now(),
    completedAt: db.completedAt ? new Date(db.completedAt).getTime() : undefined,
    status: db.status ?? 'planned',
    gapGroupId: db.misconceptionId,
    gapGroupTitle: db.misconceptionTitle,
    targetObjectiveStandard: db.targetObjectiveStandard,
    priority: db.priority,
    studentCount: db.studentCount,
    studentPercent: db.studentPercent,
    occurrence: db.occurrence,
    misconceptionSummary: db.misconceptionSummary,
    successIndicators: db.successIndicators ?? [],
    ccssStandards: db.targetObjectiveStandard
      ? { targetObjective: { standard: db.targetObjectiveStandard, description: '' }, prerequisiteGaps: [], impactedObjectives: [] }
      : undefined,
    moveId: db.activityId,
    moveTitle: db.activityTitle,
    moveTime: db.activityTime,
    moveFormat: db.activityFormat,
    moveSummary: db.activitySummary,
    aiReasoning: db.aiReasoning,
    evidence: db.evidence ?? null,
    move: {
      id: db.activityId,
      title: db.activityTitle,
      time: db.activityTime,
      format: db.activityFormat,
      summary: db.activitySummary,
      aiReasoning: db.aiReasoning,
      tabs: db.tabs ?? null,
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const client = new APIClient();

        const classrooms = await client.listClassrooms();
        const gr6 = classrooms.find((c) => c.grade === 6);
        if (!gr6 || cancelled) return;

        if (gr6.students?.items?.length) {
          setClassroomStudents(gr6.students.items);
        }

        // Store refs so CRUD handlers outside this effect can reach the API
        apiClientRef.current = client;
        classroomIdRef.current = gr6.id;

        // Load persisted next steps
        const savedItems = (await client.listSavedNextSteps(gr6.id)) ?? [];
        if (!cancelled) {
          if (savedItems.length) {
            const active = savedItems.filter((x) => x.status !== 'completed').map(dbItemToLocal);
            const completed = savedItems.filter((x) => x.status === 'completed').map(dbItemToLocal);
            setNextSteps(active);
            setNextStepsHistory(
              completed.map((item) => ({
                id: `yns-item-${item.id}-${item.completedAt}`,
                completedAt: item.completedAt,
                items: [item],
              }))
            );
          }
          setIsLoadingNextSteps(false);
        }

        // Load pregenerated gap groups for the active week
        const activeSession = (gr6.sessions?.items ?? [])
          .find((s) => s.weekNumber === gr6.currentWeek);
        if (!cancelled && activeSession?.pregeneratedGapGroups) {
          const groups = activeSession.pregeneratedGapGroups;
          setAiGapGroups(typeof groups === 'string' ? JSON.parse(groups) : groups);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingNextSteps(false);
        }
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);



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
      status: 'planned',
      gapGroupId: gapGroup.id,
      gapGroupTitle: gapGroup.title,
      targetObjectiveStandard: gapGroup?.ccssStandards?.targetObjective?.standard,
      priority: gapGroup.priority,
      studentCount: gapGroup.studentCount,
      studentPercent: gapGroup.studentPercent,
      occurrence: gapGroup.occurrence,
      misconceptionSummary: gapGroup.misconceptionSummary,
      successIndicators: gapGroup.successIndicators,
      ccssStandards: gapGroup.ccssStandards,
      gaps: inferredGaps,
      moveId: move.id,
      moveTitle: move.title,
      moveTime: move.time,
      moveFormat: move.format,
      moveSummary: move.summary,
      aiReasoning: move.aiReasoning,
      evidence: gapGroup.evidence,
      move: normalizedMove,
    };

    setNextSteps((prev) => [newItem, ...prev]);

    // Persist to backend (fire-and-forget — UI is already updated optimistically)
    const client = apiClientRef.current;
    const classroomId = classroomIdRef.current;
    if (client && classroomId) {
      client.createSavedNextStep(classroomId, {
        id: newItem.id,
        classroomId,
        status: 'planned',
        misconceptionId: gapGroup.id,
        misconceptionTitle: gapGroup.title,
        targetObjectiveStandard: newItem.targetObjectiveStandard,
        priority: gapGroup.priority,
        studentCount: gapGroup.studentCount,
        studentPercent: gapGroup.studentPercent,
        occurrence: gapGroup.occurrence,
        misconceptionSummary: gapGroup.misconceptionSummary,
        successIndicators: gapGroup.successIndicators ?? [],
        activityId: move.id,
        activityTitle: move.title,
        activityTime: move.time,
        activityFormat: move.format,
        activitySummary: move.summary,
        aiReasoning: move.aiReasoning,
        evidence: gapGroup.evidence ?? undefined,
        tabs: normalizedMove?.tabs ?? undefined,
      }).catch((err) => console.error('[addNextStep] backend save failed', err));
    }
  };

  const removeNextStep = (id) => {
    setNextSteps((prev) => prev.filter((x) => x.id !== id));

    const client = apiClientRef.current;
    if (client) {
      client.deleteSavedNextStep(id)
        .catch((err) => console.error('[removeNextStep] backend delete failed', err));
    }
  };

  const completeNextStep = (id) => {
    const existing = nextSteps.find((x) => x.id === id);
    if (!existing) return;

    const completedAt = Date.now();
    const completedItem = { ...existing, status: 'completed', completedAt };

    setNextStepsHistory((prev) => [
      { id: `yns-item-${id}-${completedAt}`, completedAt, items: [completedItem] },
      ...(prev || [])
    ]);
    setNextSteps((prev) => prev.filter((x) => x.id !== id));

    const client = apiClientRef.current;
    if (client) {
      client.updateSavedNextStep(id, {
        status: 'completed',
        completedAt: new Date(completedAt).toISOString(),
      }).catch((err) => console.error('[completeNextStep] backend update failed', err));
    }
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
                  data-reflect-tab-target="true"
                >
                  3. Reflect
                </button>
              </nav>
            </div>

            {activeOverviewSection === 'Recommended Next Steps' && (
              <div className="remediation-section">
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                    <CircularProgress />
                  </div>
                )}
                {!isLoading && (
                  <RecommendedNextSteps
                    onAddNextStep={addNextStep}
                    existingNextSteps={nextSteps}
                    gapGroups={aiGapGroups ?? undefined}
                  />
                )}
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
                  isLoading={isLoadingNextSteps}
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
            <StudentRoster students={classroomStudents} />
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;
