import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APIClient, GapGroupParser, SavedNextStepParser } from '@righton/microcoach-api';
import CircularProgress from '@mui/material/CircularProgress';
import ReviewHeader from './ReviewHeader';
import RecommendedNextSteps from './RecommendedNextSteps';
import YourNextSteps from './YourNextSteps';
import InterventionPatterns from './InterventionPatterns';
import '../App.css';

// Temporarily disables the grade-level evaluator UI (bell icon, preview, regenerate button).
// Flip to `true` to re-enable. Keep in sync with the same flag in microcoachTeacherUploadGen.
const EVALUATORS_ENABLED = false;

function ReviewPage() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [activeOverviewSection, setActiveOverviewSection] = useState('Recommended Next Steps');
  const [classroom, setClassroom] = useState(null);
  const [draftSessions, setDraftSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [nextSteps, setNextSteps] = useState([]);
  const [nextStepsSort, setNextStepsSort] = useState('manual');
  const [nextStepsHistory, setNextStepsHistory] = useState([]);
  const [completedThisSession, setCompletedThisSession] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenComplete, setRegenComplete] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [aiGapGroups, setAiGapGroups] = useState(null);

  const apiClientRef = useRef(null);

  const selectSession = (session, savedItems = []) => {
    let gapGroups = null;
    if (session?.pregeneratedNextSteps) {
      gapGroups = GapGroupParser.fromPregeneratedJson(session.pregeneratedNextSteps);
    }
    setAiGapGroups(gapGroups);

    try {
      setEvaluationResults(session?.evaluationResults ? JSON.parse(session.evaluationResults) : null);
    } catch { setEvaluationResults(null); }

    const enrichCcss = (item) => {
      if (!gapGroups || !item.gapGroupId) return item;
      const match = gapGroups.find((g) => g.id === item.gapGroupId);
      if (match?.ccssStandards) return { ...item, ccssStandards: match.ccssStandards };
      return item;
    };

    const active = savedItems.filter((x) => x.status !== 'completed').map((db) => enrichCcss(SavedNextStepParser.dbToLocal(db)));
    const completed = savedItems.filter((x) => x.status === 'completed').map((db) => enrichCcss(SavedNextStepParser.dbToLocal(db)));
    setNextSteps(active);
    setNextStepsHistory(
      completed.map((item) => ({
        id: `yns-item-${item.id}-${item.completedAt}`,
        completedAt: item.completedAt,
        items: [item],
      }))
    );
    setCompletedThisSession(new Set(completed.map((item) => `${item.gapGroupId}:${item.moveId}`)));
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const client = new APIClient();
      apiClientRef.current = client;

      const classroomData = await client.getClassroom(classroomId);
      if (cancelled || !classroomData) return;
      setClassroom(classroomData);

      const sessions = classroomData.sessions?.items ?? [];
      const drafts = sessions.filter((s) => s.publishStatus === 'DRAFT');
      setDraftSessions(drafts);

      const savedItems = await client.listSavedNextSteps(classroomId);
      if (cancelled) return;

      const sorted = [...(savedItems ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      if (drafts.length > 0) {
        const first = drafts[0];
        setSelectedSessionId(first.id);
        selectSession(first, sorted);
      }

      setIsLoading(false);
    }
    init().catch(console.error);
    return () => { cancelled = true; };
  }, [classroomId]);

  const handleSessionChange = (sessionId) => {
    setSelectedSessionId(sessionId);
    setRegenComplete(false);
    const session = draftSessions.find((s) => s.id === sessionId);
    if (session) selectSession(session);
  };

  const handlePublish = async () => {
    if (!selectedSessionId || isPublishing) return;
    setIsPublishing(true);
    try {
      const client = apiClientRef.current;
      await client.updateSession(selectedSessionId, { publishStatus: 'PUBLISHED' });

      const remaining = draftSessions.filter((s) => s.id !== selectedSessionId);
      setDraftSessions(remaining);

      if (remaining.length > 0) {
        setSelectedSessionId(remaining[0].id);
        selectSession(remaining[0]);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Publish failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRegenerate = async () => {
    if (!EVALUATORS_ENABLED) return;
    if (isRegenerating || !classroom?.grade) return;
    setIsRegenerating(true);
    try {
      const client = apiClientRef.current;
      // Fire-and-forget: Lambda self-invokes async and returns immediately
      await client.regenerateContent(selectedSessionId, classroom.grade);

      // Poll session until evaluationResults changes (regen complete)
      const origEval = evaluationResults;
      const origScore = origEval?.evaluations?.[0]?.score;
      const maxAttempts = 30; // 30 × 5s = 150s max wait
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((r) => setTimeout(r, 5000));
        const updated = await client.getSession(selectedSessionId);
        if (!updated?.evaluationResults) continue;
        const newEval = JSON.parse(updated.evaluationResults);
        const newScore = newEval?.evaluations?.[0]?.score;
        // Check if evaluation changed (different score or different reasoning)
        if (newScore !== origScore || newEval?.evaluations?.[0]?.reasoning !== origEval?.evaluations?.[0]?.reasoning) {
          const session = draftSessions.find((s) => s.id === selectedSessionId);
          if (session) {
            const updatedSession = { ...session, pregeneratedNextSteps: updated.pregeneratedNextSteps, evaluationResults: updated.evaluationResults };
            setDraftSessions((prev) => prev.map((s) => s.id === selectedSessionId ? updatedSession : s));
            selectSession(updatedSession);
          }
          const isAtGrade = newEval?.evaluations?.[0]?.classification === 'atGrade';
          if (isAtGrade) setRegenComplete(true);
          break;
        }
      }
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const addNextStep = (gapGroup, move) => {
    const inferredGaps = Array.isArray(gapGroup?.gaps)
      ? gapGroup.gaps
      : (gapGroup?.title ? [gapGroup.title] : []);

    const normalizedMove = move
      ? { id: move.id, title: move.title, time: move.time, format: move.format, summary: move.summary, aiReasoning: move.aiReasoning, tabs: move.tabs }
      : null;

    const newItem = {
      id: `${gapGroup.id}-${move.id}-${Date.now()}`,
      createdAt: Date.now(),
      status: 'planned',
      gapGroupId: gapGroup.id,
      gapGroupTitle: gapGroup.title,
      targetObjectiveStandard: gapGroup?.ccssStandards?.targetObjective?.standard,
      priority: gapGroup.priority ?? 'Low',
      frequency: gapGroup.frequency ?? null,
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

    const client = apiClientRef.current;
    if (client) {
      const mutationInput = SavedNextStepParser.toMutationInput(classroomId, newItem);
      client.createSavedNextStep(classroomId, mutationInput)
        .catch((err) => console.error('[addNextStep] backend save failed', err));
    }
  };

  const removeNextStep = (id) => {
    setNextSteps((prev) => prev.filter((x) => x.id !== id));
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
    setCompletedThisSession((prev) => new Set([...prev, `${existing.gapGroupId}:${existing.moveId}`]));

    const client = apiClientRef.current;
    if (client) {
      client.updateSavedNextStep(id, {
        status: 'completed',
        completedAt: new Date(completedAt).toISOString(),
      }).catch((err) => console.error('[completeNextStep] backend update failed', err));
    }
  };

  const reorderNextSteps = (dragId, dropId, position = 'below') => {
    if (nextStepsSort !== 'manual') return;
    setNextSteps((prev) => {
      const dragIdx = prev.findIndex((x) => x.id === dragId);
      if (dragIdx < 0) return prev;
      const dropIdx = dropId ? prev.findIndex((x) => x.id === dropId) : prev.length;
      if (dropIdx < 0 || dropIdx === dragIdx) return prev;
      const copy = [...prev];
      const [dragItem] = copy.splice(dragIdx, 1);
      let insertIdx;
      if (!dropId) {
        insertIdx = copy.length;
      } else {
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
      return copy;
    });
  };

  const sortedNextSteps = useMemo(() => {
    if (nextStepsSort === 'manual') return nextSteps;
    const copy = [...nextSteps];
    if (nextStepsSort === 'newest') copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (nextStepsSort === 'priority') {
      const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      copy.sort((a, b) => (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99));
    }
    return copy;
  }, [nextSteps, nextStepsSort]);

  const completedNextStepsCount = useMemo(() => {
    return (nextStepsHistory || []).reduce((sum, h) => sum + ((h?.items?.length || 0)), 0);
  }, [nextStepsHistory]);

  if (isLoading) {
    return (
      <div className="app">
        <ReviewHeader
          classroomName=""
          sessions={[]}
          selectedSessionId=""
          onPublish={() => {}}
          isPublishing={false}
        />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <CircularProgress />
          </div>
        </main>
      </div>
    );
  }

  if (draftSessions.length === 0) {
    return (
      <div className="app">
        <ReviewHeader
          classroomName={classroom?.classroomName ?? ''}
          sessions={[]}
          selectedSessionId=""
          onPublish={() => {}}
          isPublishing={false}
        />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0', color: '#6B7280', fontFamily: 'Rubik, sans-serif' }}>
            No draft sessions to review for this classroom.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <ReviewHeader
        classroomName={classroom?.classroomName ?? ''}
        sessions={draftSessions}
        selectedSessionId={selectedSessionId}
        onSessionChange={handleSessionChange}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        evaluatorEnabled={EVALUATORS_ENABLED}
        evaluationResults={evaluationResults}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
        regenComplete={regenComplete}
      />

      <main className="main-content">
        <div className="overview-content">
          <div className="overview-navigation">
            <nav className="overview-nav-tabs" aria-label="Overview workflow">
              <button
                className={`overview-nav-tab ${activeOverviewSection === 'Recommended Next Steps' ? 'active' : ''}`}
                onClick={() => setActiveOverviewSection('Recommended Next Steps')}
                type="button"
              >
                Understand & Act
              </button>
              <span className="overview-nav-separator" aria-hidden="true">&gt;</span>
              <button
                className={`overview-nav-tab ${activeOverviewSection === 'Saved Next Steps' ? 'active' : ''}`}
                onClick={() => setActiveOverviewSection('Saved Next Steps')}
                type="button"
              >
                Prepare
              </button>
              <span className="overview-nav-separator" aria-hidden="true">&gt;</span>
              <button
                className={`overview-nav-tab ${activeOverviewSection === 'Your Intervention Patterns' ? 'active' : ''}`}
                onClick={() => setActiveOverviewSection('Your Intervention Patterns')}
                type="button"
                data-reflect-tab-target="true"
              >
                Reflect
              </button>
            </nav>
          </div>

          {activeOverviewSection === 'Recommended Next Steps' && (
            <div className="remediation-section">
              <RecommendedNextSteps
                onAddNextStep={addNextStep}
                existingNextSteps={nextSteps}
                completedKeys={completedThisSession}
                gapGroups={aiGapGroups ?? undefined}
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
                isLoading={false}
              />
            </div>
          )}

          {activeOverviewSection === 'Your Intervention Patterns' && (
            <div className="trends-section">
              <InterventionPatterns
                nextSteps={[...nextSteps, ...(nextStepsHistory.flatMap((h) => h.items || []))]}
                gapGroups={aiGapGroups ?? []}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ReviewPage;
