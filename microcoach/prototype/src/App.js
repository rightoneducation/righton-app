import React, { useEffect, useMemo, useRef, useState } from 'react';
import { APIClient, GapGroupParser, SavedNextStepParser } from '@righton/microcoach-api';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/Header';
import RecommendedNextSteps from './components/RecommendedNextSteps';
import YourNextSteps from './components/YourNextSteps';
import InterventionPatterns from './components/InterventionPatterns';
import './App.css';


function App() {
  const [activeOverviewSection, setActiveOverviewSection] = useState('Recommended Next Steps');

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [nextSteps, setNextSteps] = useState([]);
  const [nextStepsSort, setNextStepsSort] = useState('manual');
  const [nextStepsHistory, setNextStepsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextSteps, setIsLoadingNextSteps] = useState(true);
  const [aiGapGroups, setAiGapGroups] = useState(null);

  // All classroom data pre-fetched on init, keyed by classroomId.
  // { [classroomId]: { gapGroups: [...] | null, savedNextSteps: [...] } }
  const classroomDataMapRef = useRef({});

  // Refs so CRUD handlers can reach the API without being inside the fetch useEffect
  const apiClientRef = useRef(null);
  const classroomIdRef = useRef(null);


  // Switch to a classroom using pre-fetched data — synchronous, no loading state.
  const selectClassroom = (classroom) => {
    if (!classroom) return;
    classroomIdRef.current = classroom.id;
    const data = classroomDataMapRef.current[classroom.id] ?? { gapGroups: null, savedNextSteps: [] };
    const savedItems = data.savedNextSteps;
    const active = savedItems.filter((x) => x.status !== 'completed').map((db) => SavedNextStepParser.dbToLocal(db));
    const completed = savedItems.filter((x) => x.status === 'completed').map((db) => SavedNextStepParser.dbToLocal(db));
    setNextSteps(active);
    setNextStepsHistory(
      completed.map((item) => ({
        id: `yns-item-${item.id}-${item.completedAt}`,
        completedAt: item.completedAt,
        items: [item],
      }))
    );
    setAiGapGroups(data.gapGroups);
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const client = new APIClient();
      apiClientRef.current = client;

      // Fetch all classrooms (includes sessions + pregeneratedNextSteps).
      const all = await client.listClassrooms();
      if (cancelled) return;
      const unique = [...new Map(all.map((c) => [c.id, c])).values()];
      const sorted = unique.sort((a, b) => a.classroomName.localeCompare(b.classroomName));

      // Fetch saved next steps for all classrooms in parallel.
      const savedByClassroom = await Promise.all(
        sorted.map((c) => client.listSavedNextSteps(c.id).then((items) => ({ id: c.id, items: items ?? [] })))
      );
      if (cancelled) return;

      // Build the data map.
      const map = {};
      for (const classroom of sorted) {
        const activeSession = (classroom.sessions?.items ?? [])
          .find((s) => s.weekNumber === classroom.currentWeek);
        let gapGroups = null;
        if (activeSession?.pregeneratedNextSteps) {
          gapGroups = GapGroupParser.fromPregeneratedJson(activeSession.pregeneratedNextSteps);
        }
        const entry = savedByClassroom.find((x) => x.id === classroom.id);
        const rawItems = entry?.items ?? [];
        const sortedItems = [...rawItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        map[classroom.id] = { gapGroups, savedNextSteps: sortedItems };
      }
      classroomDataMapRef.current = map;

      // console.log('[App] === CLASSROOM DATA DUMP ===');
      // sorted.forEach((classroom) => {
      //   console.log(`[App] ${classroom.classroomName} (id: ${classroom.id})`, JSON.parse(JSON.stringify({
      //     classroom,
      //     gapGroups: map[classroom.id]?.gapGroups,
      //     savedNextSteps: map[classroom.id]?.savedNextSteps,
      //   })));
      // });
      // console.log('[App] === END DUMP ===');

      setClassrooms(sorted);
      setIsLoading(false);
      setIsLoadingNextSteps(false);

      if (sorted[0]) {
        setSelectedClassroomId(sorted[0].id);
        selectClassroom(sorted[0]);
      }
    }
    init().catch(console.error);
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
      priority: gapGroup.priority ?? 'Low',
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

    // DB-shaped record — mirrors createSavedNextStep input shape
    const dbRecord = {
      id: newItem.id,
      createdAt: new Date(newItem.createdAt).toISOString(),
      status: 'planned',
      misconceptionId: gapGroup.id,
      misconceptionTitle: gapGroup.title,
      targetObjectiveStandard: newItem.targetObjectiveStandard,
      priority: gapGroup.priority ?? 'Low',
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
      evidence: gapGroup.evidence ?? null,
      tabs: normalizedMove?.tabs ?? null,
      sortOrder: 0,
    };

    // Update UI state (local-shaped)
    setNextSteps((prev) => [newItem, ...prev]);

    // Update ref (DB-shaped) separately
    const cid = classroomIdRef.current;
    if (cid && classroomDataMapRef.current[cid]) {
      classroomDataMapRef.current[cid].savedNextSteps = [
        dbRecord,
        ...classroomDataMapRef.current[cid].savedNextSteps,
      ];
    }

    // Persist to backend (fire-and-forget — UI is already updated optimistically)
    const client = apiClientRef.current;
    const classroomId = classroomIdRef.current;
    if (client && classroomId) {
      const mutationInput = SavedNextStepParser.toMutationInput(classroomId, newItem);
      client.createSavedNextStep(classroomId, mutationInput)
        .catch((err) => console.error('[addNextStep] backend save failed', err));
    }
  };

  const removeNextStep = (id) => {
    setNextSteps((prev) => prev.filter((x) => x.id !== id));

    const cid = classroomIdRef.current;
    if (cid && classroomDataMapRef.current[cid]) {
      classroomDataMapRef.current[cid].savedNextSteps =
        classroomDataMapRef.current[cid].savedNextSteps.filter((x) => x.id !== id);
    }

    apiClientRef.current?.deleteSavedNextStep(id)
      .catch((err) => console.error('[removeNextStep] backend delete failed', err));
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

    const cid = classroomIdRef.current;
    if (cid && classroomDataMapRef.current[cid]) {
      classroomDataMapRef.current[cid].savedNextSteps =
        classroomDataMapRef.current[cid].savedNextSteps.map((x) =>
          x.id === id
            ? { ...x, status: 'completed', completedAt: new Date(completedAt).toISOString() }
            : x
        );
    }

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

      const client = apiClientRef.current;
      if (client) {
        copy.forEach((item, index) => {
          client.updateSavedNextStep(item.id, { sortOrder: index })
            .catch((err) => console.error('[reorderNextSteps] sortOrder update failed', err));
        });
      }

      const rcid = classroomIdRef.current;
      if (rcid && classroomDataMapRef.current[rcid]) {
        const idToOrder = Object.fromEntries(copy.map((x, i) => [x.id, i]));
        classroomDataMapRef.current[rcid].savedNextSteps =
          classroomDataMapRef.current[rcid].savedNextSteps.map((x) =>
            idToOrder[x.id] !== undefined ? { ...x, sortOrder: idToOrder[x.id] } : x
          );
      }

      return copy;
    });
  };

  const handleOverviewSectionChange = (section) => {
    setActiveOverviewSection(section);
  };

  return (
    <div className="app">
      <Header
        classrooms={classrooms}
        selectedClassroomId={selectedClassroomId}
        onClassChange={(id) => {
          setSelectedClassroomId(id);
          selectClassroom(classrooms.find((c) => c.id === id));
        }}
      />

      <main className="main-content">
        <div className="overview-content">
          <div className="overview-navigation">
            <nav className="overview-nav-tabs" aria-label="Overview workflow">
              <button
                className={`overview-nav-tab ${activeOverviewSection === 'Recommended Next Steps' ? 'active' : ''}`}
                onClick={() => handleOverviewSectionChange('Recommended Next Steps')}
                type="button"
              >
                Understand & Act
              </button>
              <span className="overview-nav-separator" aria-hidden="true">
                &gt;
              </span>
              <button
                className={`overview-nav-tab ${activeOverviewSection === 'Saved Next Steps' ? 'active' : ''}`}
                onClick={() => handleOverviewSectionChange('Saved Next Steps')}
                type="button"
              >
                Prepare
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
                Reflect
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
      </main>
    </div>
  );
}

export default App;
