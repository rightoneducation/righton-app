import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { 
  Container, 
  Title, 
  SectionTitle, 
  StyledTextField, 
  StyledButton, 
  OutputBox, 
  PlaceholderText 
} from './components/Components';
import { APIClient } from '@righton/microcoach-api';
import './App.css';

function App() {
  const [classroomId, setClassroomId] = useState('');
  const [ccss, setCcss] = useState('');
  const [knowledgeGraphSummary, setKnowledgeGraphSummary] = useState<{
    title: string;
    description: string;
    buildsTowards: { statementCode: string; description: string }[];
    hasChild: { statementCode: string; description: string }[];
    learningComponents: { description: string }[];
  } | null>(null);
  const [queryKnowledgeGraphLoading, setQueryKnowledgeGraphLoading] = useState(false);
  const [llmOutput, setLlmOutput] = useState('');
  const [updateOutput, setUpdateOutput] = useState('');
  const [classroomSummary, setClassroomSummary] = useState<{
    name: string;
    sessions: { question: string; correctAnswer: string; answerCount: number }[];
  } | null>(null);
  const [queryClassroomLoading, setQueryClassroomLoading] = useState(false);
  const [classroomData, setClassroomData] = useState<any>(null);
  const [learningScienceData, setLearningScienceData] = useState<any>(null);
  const [queryLLMLoading, setQueryLLMLoading] = useState(false);
  const [analyticsResult, setAnalyticsResult] = useState<string | null>(null);
  const [queryUpdateLoading, setQueryUpdateLoading] = useState(false);
  const [updatedClassroom, setUpdatedClassroom] = useState<any>(null);
  const apiClient = new APIClient();

  const hasContent = (x: any) =>
    x != null &&
    (typeof x === 'string' ? x.length > 0 : Object.keys(x).length > 0);
  const canQueryLLM = hasContent(classroomData) && hasContent(learningScienceData);

  const handleQueryClassroom = async () => {
    setQueryClassroomLoading(true);
    try {
      const classroom = await apiClient.getClassroom(classroomId);
      setClassroomData(classroom ?? null);
      const sessions = classroom?.sessions?.items ?? [];
      setClassroomSummary({
        name: classroom?.userName ?? 'Unnamed classroom',
        sessions: sessions.map((s: { question?: string; correctAnswer?: string; studentAnswer?: { items?: unknown[] } }) => ({
          question: s.question ?? '',
          correctAnswer: s.correctAnswer ?? '',
          answerCount: s.studentAnswer?.items?.length ?? 0,
        })),
      });
    } finally {
      setQueryClassroomLoading(false);
    }
  };

  const handleQueryKnowledgeGraph = async () => {
    setQueryKnowledgeGraphLoading(true);
    try {
      const raw = await apiClient.getLearningScienceDataByCCSS(ccss);
      setLearningScienceData(raw ?? null);
      const data = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : raw;
      const items = data?.data?.standardsFrameworkItems ?? data?.standardsFrameworkItems ?? [];
      const first = Array.isArray(items) ? items[0] : null;
      if (!first) {
        setKnowledgeGraphSummary(null);
        return;
      }
      setKnowledgeGraphSummary({
        title: first.statementCode ?? ccss ?? '—',
        description: first.description ?? '',
        buildsTowards: Array.isArray(first.buildsTowardsStandardsFrameworkItems) ? first.buildsTowardsStandardsFrameworkItems : [],
        hasChild: Array.isArray(first.standardsFrameworkItemshasChild) ? first.standardsFrameworkItemshasChild : [],
        learningComponents: Array.isArray(first.learningComponentssupports) ? first.learningComponentssupports : [],
      });
    } catch {
      setKnowledgeGraphSummary(null);
      setLearningScienceData(null);
    } finally {
      setQueryKnowledgeGraphLoading(false);
    }
  };

  const formatAnalyticsOutput = (result: unknown): string => {
    const data = typeof result === 'string' ? (() => { try { return JSON.parse(result); } catch { return null; } })() : result;
    if (!data || typeof data !== 'object' || !('synthesis' in data)) {
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    }
    const synthesis = (data as { synthesis?: string }).synthesis ?? '';
    const keyFindings = (data as { keyFindings?: string[] }).keyFindings ?? [];
    const abbrev = synthesis.length > 380
      ? synthesis.slice(0, 377).trim().replace(/\s+\S*$/, '') + '…'
      : synthesis;
    const lines = ['Summary', abbrev];
    if (keyFindings.length > 0) {
      lines.push('', 'Key findings');
      keyFindings.forEach((f) => lines.push(`• ${f}`));
    }
    return lines.join('\n');
  };

  const handleQueryLLM = async () => {
    if (!canQueryLLM) return;
    setQueryLLMLoading(true);
    try {
      const result = await apiClient.getAnalytics(classroomData, learningScienceData);
      const raw = typeof result === 'string' ? result : JSON.stringify(result);
      setAnalyticsResult(raw);
      setLlmOutput(formatAnalyticsOutput(result));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : Array.isArray((err as any)?.errors) && (err as any).errors.length > 0
            ? (err as any).errors.map((e: any) => e?.message ?? String(e)).join('; ')
            : (err as any)?.message ?? JSON.stringify(err);
      setLlmOutput(`Error: ${message}`);
    } finally {
      setQueryLLMLoading(false);
    }
  };

  const canUpdateClassroom = hasContent(classroomData) && analyticsResult != null && analyticsResult.length > 0;

  const handleUpdateClassroom = async () => {
    if (!canUpdateClassroom || !classroomData || !analyticsResult) return;
    setQueryUpdateLoading(true);
    setUpdatedClassroom(null);
    setUpdateOutput('');
    try {
      const updated = await apiClient.updateClassroom(classroomData, analyticsResult);
      setUpdatedClassroom(updated ?? null);
      if (updated == null) setUpdateOutput('Classroom updated (no data returned).');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : Array.isArray((err as any)?.errors) && (err as any).errors.length > 0
            ? (err as any).errors.map((e: any) => e?.message ?? String(e)).join('; ')
            : (err as any)?.message ?? JSON.stringify(err);
      setUpdateOutput(`Error: ${message}`);
    } finally {
      setQueryUpdateLoading(false);
    }
  };

  return (
    <Container>
      <Title>MicroCoach API Testing</Title>

      <Box>
        <SectionTitle>Classroom Query</SectionTitle>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <StyledTextField
            placeholder="Enter Classroom ID"
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            variant="outlined"
          />
          <StyledButton onClick={handleQueryClassroom} variant="contained">
            Query Classroom
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {queryClassroomLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
                <CircularProgress style={{color: '#000'}}/>
              </Box>
            ) : classroomSummary ? (
              <Box component="div" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                <Box component="strong" sx={{ fontWeight: 700, display: 'block', marginBottom: 1 }}>
                  {classroomSummary.name}
                </Box>
                {classroomSummary.sessions.length === 0 ? (
                  <Box component="span" sx={{ color: 'text.secondary' }}>No sessions yet.</Box>
                ) : (
                  <>
                    <Box component="div" sx={{ marginBottom: 1, color: 'text.secondary' }}>
                      {classroomSummary.sessions.length} classroom session{classroomSummary.sessions.length !== 1 ? 's' : ''}
                    </Box>
                    {classroomSummary.sessions.map((session, i) => (
                      <Box key={i} component="div" sx={{ marginBottom: 1 }}>
                        • <Box component="span" sx={{ letterSpacing: '-0.02em' }}>{session.question}</Box>
                        <Box component="span" sx={{ color: 'text.secondary', marginLeft: 0.5 }}>
                          — Correct: {session.correctAnswer} · {session.answerCount} answer{session.answerCount !== 1 ? 's' : ''}
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            ) : (
              <PlaceholderText>
                Classroom data will be displayed here after querying...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>

      <Box>
        <SectionTitle>Knowledge Graph Query</SectionTitle>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <StyledTextField
            placeholder="Enter CCSS"
            value={ccss}
            onChange={(e) => setCcss(e.target.value)}
            variant="outlined"
          />
          <StyledButton onClick={handleQueryKnowledgeGraph} variant="contained">
            Query KG
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {queryKnowledgeGraphLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
                <CircularProgress style={{color: '#000'}}/>
              </Box>
            ) : knowledgeGraphSummary ? (
              <Box component="div" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                <Box component="strong" sx={{ fontWeight: 700, display: 'block', marginBottom: 1 }}>
                  {knowledgeGraphSummary.title}
                </Box>
                <Box component="div" sx={{ letterSpacing: '-0.02em', marginBottom: 1.5 }}>
                  {knowledgeGraphSummary.description}
                </Box>
                {(knowledgeGraphSummary.buildsTowards ?? []).length > 0 && (
                  <>
                    <Box component="div" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                      Builds towards: {(knowledgeGraphSummary.buildsTowards ?? []).length} standard{(knowledgeGraphSummary.buildsTowards ?? []).length !== 1 ? 's' : ''}
                    </Box>
                    {(knowledgeGraphSummary.buildsTowards ?? []).map((s, i) => (
                      <Box key={i} component="div" sx={{ marginBottom: 1 }}>
                        • <Box component="span" sx={{ letterSpacing: '-0.02em' }}>{s.statementCode} — {s.description}</Box>
                      </Box>
                    ))}
                  </>
                )}
                {(knowledgeGraphSummary.hasChild ?? []).length > 0 && (
                  <>
                    <Box component="div" sx={{ marginTop: 1, marginBottom: 0.5, color: 'text.secondary' }}>
                      Has child: {(knowledgeGraphSummary.hasChild ?? []).length} standard{(knowledgeGraphSummary.hasChild ?? []).length !== 1 ? 's' : ''}
                    </Box>
                    {(knowledgeGraphSummary.hasChild ?? []).map((s, i) => (
                      <Box key={i} component="div" sx={{ marginBottom: 1 }}>
                        • <Box component="span" sx={{ letterSpacing: '-0.02em' }}>{s.statementCode} — {s.description}</Box>
                      </Box>
                    ))}
                  </>
                )}
                {(knowledgeGraphSummary.learningComponents ?? []).length > 0 && (
                  <>
                    <Box component="div" sx={{ marginTop: 1, marginBottom: 0.5, color: 'text.secondary' }}>
                      Learning components: {(knowledgeGraphSummary.learningComponents ?? []).length}
                    </Box>
                    {(knowledgeGraphSummary.learningComponents ?? []).map((s, i) => (
                      <Box key={i} component="div" sx={{ marginBottom: 1 }}>
                        • <Box component="span" sx={{ letterSpacing: '-0.02em' }}>{s.description}</Box>
                      </Box>
                    ))}
                  </>
                )}
                {(knowledgeGraphSummary.buildsTowards ?? []).length === 0 && (knowledgeGraphSummary.hasChild ?? []).length === 0 && (knowledgeGraphSummary.learningComponents ?? []).length === 0 && (
                  <Box component="span" sx={{ color: 'text.secondary' }}>No related standards or components.</Box>
                )}
              </Box>
            ) : (
              <PlaceholderText>
                Knowledge graph data will be displayed here after querying...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>

      <Box>
        <SectionTitle>LLM Query</SectionTitle>
        <Box sx={{ marginTop: '8px' }}>
          <StyledButton
            onClick={handleQueryLLM}
            variant="contained"
            fullWidth
            disabled={!canQueryLLM || queryLLMLoading}
          >
            {queryLLMLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} style={{ color: 'inherit' }} />
                Querying…
              </Box>
            ) : (
              'Query LLM'
            )}
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {llmOutput ? (
              <Box component="div" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {llmOutput}
              </Box>
            ) : (
              <PlaceholderText>
                LLM response will appear here after querying...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>

      <Box>
        <SectionTitle>Update Classroom</SectionTitle>
        <Box sx={{ marginTop: '8px' }}>
          <StyledButton
            onClick={handleUpdateClassroom}
            variant="contained"
            fullWidth
            disabled={!canUpdateClassroom || queryUpdateLoading}
          >
            {queryUpdateLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} style={{ color: 'inherit' }} />
                Updating…
              </Box>
            ) : (
              'Update Classroom'
            )}
          </StyledButton>
        </Box>
        <Box sx={{ marginTop: '12px' }}>
          <OutputBox>
            {queryUpdateLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
                <CircularProgress style={{ color: '#000' }} />
              </Box>
            ) : updatedClassroom ? (
              <Box component="div" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                <Box component="strong" sx={{ fontWeight: 700, display: 'block', marginBottom: 1 }}>
                  {updatedClassroom.userName ?? 'Classroom'} (updated)
                </Box>
                <Box component="div" sx={{ marginBottom: 1, color: 'text.secondary' }}>
                  ID: {updatedClassroom.id ?? '—'}
                </Box>
                {(updatedClassroom.sessions?.items ?? []).length > 0 && (
                  <Box component="div" sx={{ marginBottom: 1, color: 'text.secondary' }}>
                    {(updatedClassroom.sessions?.items ?? []).length} session{(updatedClassroom.sessions?.items ?? []).length !== 1 ? 's' : ''}
                  </Box>
                )}
                {updatedClassroom.analytics && (
                  <>
                    <Box component="div" sx={{ fontWeight: 600, marginTop: 1.5, marginBottom: 0.5 }}>
                      Analytics
                    </Box>
                    <Box component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                      {formatAnalyticsOutput(
                        typeof updatedClassroom.analytics === 'string'
                          ? updatedClassroom.analytics
                          : JSON.stringify(updatedClassroom.analytics)
                      )}
                    </Box>
                  </>
                )}
              </Box>
            ) : updateOutput ? (
              <Box component="div" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {updateOutput}
              </Box>
            ) : (
              <PlaceholderText>
                Update confirmation and results will appear here...
              </PlaceholderText>
            )}
          </OutputBox>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
