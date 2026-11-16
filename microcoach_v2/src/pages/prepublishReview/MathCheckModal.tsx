import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import AppModal from '../../components/AppModal';
import MathText from '../../components/MathText';
import {
  MODAL_INSET_Y,
  MODAL_MAX_WIDTH,
} from '../../lib/styledcomponents/MisconceptionModalStyledComponents';
import { IMathCheckIssue, IMathCorrect, PrepublishSessionState, issueKey } from './shared';

/**
 * Check math's results on /prepublishreview: the summary, then every issue the
 * check found, in the app's red error styling. In the modal each issue can be
 * ticked for Regen (the model fixes it, then it is re-checked) or edited by
 * hand (written when Publish is clicked). The cards show the same blocks
 * without those controls (MathIssueList).
 */

/** Red pill with the number of issues, for card and activity headers. */
export function MathIssueChip({ count }: { count: number }) {
  const theme = useTheme();
  const { status } = theme.palette.designSystem;
  if (count === 0) return null;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${theme.sizing.space0}px`,
        padding: `2px ${theme.sizing.space1}px`,
        borderRadius: `${theme.sizing.space0}px`,
        border: `1px solid ${status.errorStroke}`,
        backgroundColor: status.error,
        color: status.errorStroke,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.05em',
      }}
    >
      <ErrorIcon sx={{ fontSize: 14, color: status.errorStroke }} />
      {count} math issue{count === 1 ? '' : 's'}
    </Box>
  );
}

export interface IssueControls {
  isSelected: boolean;
  onToggle: () => void;
  // The hand edit in progress, or null when the issue isn't being edited.
  edit: string | null;
  // Absent when the value isn't text (a label or a number can't be hand-edited).
  onEdit?: (value: string | null) => void;
  disabled: boolean;
}

/**
 * The Regen tick box and hand edit for each issue, from the review's state, so
 * the modal and the in-place panels on the cards share one selection and one
 * set of edits.
 */
export function issueControlsFor(
  review: PrepublishSessionState,
  isText: (issue: IMathCheckIssue) => boolean,
): (issue: IMathCheckIssue) => IssueControls {
  const { selectedIssues, toggleIssue, edits, setEdit, mathCorrect, isStartingCorrect } = review;
  const disabled = isStartingCorrect || mathCorrect?.status === 'RUNNING';
  return (issue) => {
    const key = issueKey(issue);
    return {
      isSelected: selectedIssues.has(key),
      onToggle: () => toggleIssue(issue),
      edit: edits[key]?.value ?? null,
      onEdit: isText(issue) ? (value) => setEdit(issue, value) : undefined,
      disabled,
    };
  };
}

/** One issue: where it is, the text at fault, and the working that shows it. */
function MathIssueBlock({
  issue,
  where,
  controls,
  inPlace = false,
}: {
  issue: IMathCheckIssue;
  where: string;
  controls?: IssueControls;
  // Drawn right under the text it is about, so the text isn't repeated.
  inPlace?: boolean;
}) {
  const theme = useTheme();
  const { status, surface } = theme.palette.designSystem;
  const isEditing = controls?.edit != null;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space1}px`,
        padding: `${theme.sizing.space2}px ${theme.sizing.space3}px`,
        borderRadius: `${theme.sizing.space1}px`,
        border: `1px solid ${status.errorStroke}`,
        backgroundColor: status.error,
        color: surface.atlanticNavy,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: `${theme.sizing.space1}px` }}>
        {controls ? (
          <Checkbox
            size="small"
            checked={controls.isSelected}
            onChange={controls.onToggle}
            disabled={controls.disabled}
            inputProps={{ 'aria-label': `Regen: ${where}` }}
            sx={{ padding: 0, color: status.errorStroke, '&.Mui-checked': { color: status.errorStroke } }}
          />
        ) : (
          <ErrorIcon fontSize="small" sx={{ color: status.errorIcon, flex: 'none' }} />
        )}
        <Typography variant="rubikBodyBold" sx={{ color: status.errorStroke, fontSize: 13, flex: 1, minWidth: 0 }}>
          {where}
        </Typography>
        {controls?.onEdit && (
          <button
            type="button"
            className="p2-btn"
            disabled={controls.disabled}
            onClick={() => controls.onEdit?.(isEditing ? null : issue.text)}
          >
            {isEditing ? 'Discard edit' : 'Edit'}
          </button>
        )}
      </Box>
      {isEditing ? (
        <TextField
          multiline
          minRows={2}
          fullWidth
          size="small"
          value={controls?.edit ?? ''}
          onChange={(event) => controls?.onEdit?.(event.target.value)}
          disabled={controls?.disabled}
          inputProps={{ 'aria-label': `Edit: ${where}` }}
          sx={{ backgroundColor: surface.white, '& textarea': { fontSize: 13 } }}
        />
      ) : (
        !inPlace && (
          <Typography variant="rubikBody" component="div" sx={{ fontSize: 13, overflowWrap: 'anywhere' }}>
            <MathText text={issue.text} />
          </Typography>
        )
      )}
      <Typography
        variant="rubikBody"
        component="div"
        sx={{ fontSize: 12, whiteSpace: 'pre-line', overflowWrap: 'anywhere', opacity: 0.85 }}
      >
        <MathText text={issue.why} />
      </Typography>
    </Box>
  );
}

/** A list of issue blocks. `whereOf` says where each one is. */
export function MathIssueList({
  issues,
  whereOf,
  controlsFor,
  inPlace = false,
}: {
  issues: IMathCheckIssue[];
  whereOf: (issue: IMathCheckIssue) => string;
  controlsFor?: (issue: IMathCheckIssue) => IssueControls;
  // Under the text the issues are about: the text isn't repeated.
  inPlace?: boolean;
}) {
  const theme = useTheme();
  if (issues.length === 0) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.space2}px`, minWidth: 0 }}>
      {issues.map((issue) => (
        <MathIssueBlock
          key={issueKey(issue)}
          issue={issue}
          where={whereOf(issue)}
          controls={controlsFor?.(issue)}
          inPlace={inPlace}
        />
      ))}
    </Box>
  );
}

/** How the last Regen went. */
function CorrectionStatus({
  correction,
  error,
  whereOf,
}: {
  correction: IMathCorrect | null;
  error: 'start' | 'timeout' | null;
  whereOf: (issue: IMathCheckIssue) => string;
}) {
  const theme = useTheme();
  const { status, surface } = theme.palette.designSystem;
  const line = (text: React.ReactNode, isBad: boolean) => (
    <Typography
      variant="rubikBody"
      component="div"
      sx={{ fontSize: 13, color: isBad ? status.errorStroke : surface.atlanticNavy }}
    >
      {text}
    </Typography>
  );
  if (error === 'start') return line('Regen could not be started. Try again.', true);
  if (error === 'timeout') return line('Regen is taking longer than expected. Refresh the page to see whether it has finished.', true);
  if (!correction) return null;
  if (correction.status === 'RUNNING') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${theme.sizing.space1}px` }}>
        <CircularProgress size={14} thickness={5} />
        {line(`Regenerating ${correction.requested ?? ''} value${correction.requested === 1 ? '' : 's'} and checking them again…`, false)}
      </Box>
    );
  }
  if (correction.status === 'FAILED') {
    return line(`Regen failed${correction.error ? `: ${correction.error}` : ''}. Nothing was changed.`, true);
  }
  const parts = [
    `${correction.fixed.length} fixed`,
    correction.stillFlagged.length ? `${correction.stillFlagged.length} changed but still flagged` : null,
    correction.notFixed.length ? `${correction.notFixed.length} not changed` : null,
    correction.notRechecked.length ? `${correction.notRechecked.length} changed but not re-checked` : null,
  ].filter(Boolean);
  const unresolved = correction.stillFlagged.length + correction.notFixed.length + correction.notRechecked.length;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.space0}px` }}>
      {line(`Last regen: ${parts.join(', ')}.`, unresolved > 0)}
      {correction.notFixed.map((c) => (
        <Typography key={issueKey(c)} variant="rubikBody" sx={{ fontSize: 12, color: surface.atlanticNavy, opacity: 0.85 }}>
          Not changed — {whereOf(c)}: {c.reason ?? ''}
        </Typography>
      ))}
    </Box>
  );
}

export default function MathCheckModal({
  review,
  whereOf,
  isText,
}: {
  review: PrepublishSessionState;
  whereOf: (issue: IMathCheckIssue) => string;
  // Whether the issue's value is text, so it can be edited by hand.
  isText: (issue: IMathCheckIssue) => boolean;
}) {
  const theme = useTheme();
  const { designSystem } = theme.palette;
  const {
    mathCheck, isMathResultsOpen, closeMathResults, selectedIssues, edits,
    mathCorrect, isStartingCorrect, correctError, correct,
    isStartingMathCheck, checkMath,
  } = review;
  const check = mathCheck?.status === 'DONE' ? mathCheck : null;
  const unchecked = check?.itemsUnchecked ?? 0;
  const isCorrecting = isStartingCorrect || mathCorrect?.status === 'RUNNING';
  const selectedCount = check ? check.issues.filter((issue) => selectedIssues.has(issueKey(issue))).length : 0;
  const editCount = Object.keys(edits).length;
  const controlsFor = issueControlsFor(review, isText);

  return (
    <AppModal
      isOpen={isMathResultsOpen && check != null}
      onRequestClose={closeMathResults}
      contentLabel="Math check results"
      style={{
        overlay: {
          backgroundColor: designSystem.background.scrim,
          zIndex: theme.zIndex.modal,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: theme.sizing.space4,
          paddingTop: MODAL_INSET_Y,
          paddingBottom: MODAL_INSET_Y,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: MODAL_MAX_WIDTH,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          border: 'none',
          borderRadius: theme.sizing.space2,
          overflow: 'hidden',
          backgroundColor: designSystem.surface.white,
        },
      }}
    >
      {check && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: `${theme.sizing.space2}px`,
              padding: `${theme.sizing.space3}px ${theme.sizing.space4}px`,
              borderBottom: `1px solid ${designSystem.foreground.greyAccent}`,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="rubikBodyBold" sx={{ color: designSystem.surface.atlanticNavy }}>
                Math check
              </Typography>
              <Typography
                variant="rubikBody"
                sx={{
                  fontSize: 13,
                  color: check.issues.length > 0 || unchecked > 0
                    ? designSystem.status.errorStroke
                    : designSystem.status.correctGreen,
                }}
              >
                {check.summary ?? ''}
              </Typography>
            </Box>
            {/* Starting a check sets it RUNNING, which closes this modal; the bar shows the spinner. */}
            <button
              type="button"
              className="p2-btn"
              onClick={checkMath}
              disabled={isCorrecting || isStartingMathCheck}
              style={{
                opacity: isCorrecting || isStartingMathCheck ? 0.5 : 1,
                cursor: isCorrecting || isStartingMathCheck ? 'default' : 'pointer',
              }}
            >
              Re-check
            </button>
            <button type="button" className="p2-btn" onClick={closeMathResults}>
              Close
            </button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${theme.sizing.space2}px`,
              overflowY: 'auto',
              padding: `${theme.sizing.space3}px ${theme.sizing.space4}px`,
            }}
          >
            <CorrectionStatus correction={mathCorrect} error={correctError} whereOf={whereOf} />
            {unchecked > 0 && (
              <Typography variant="rubikBody" sx={{ fontSize: 13, color: designSystem.status.errorStroke }}>
                {unchecked} part{unchecked === 1 ? '' : 's'} could not be checked, so this is not a full pass.
                Run the check again to cover {unchecked === 1 ? 'it' : 'them'}.
              </Typography>
            )}
            {check.issues.length === 0 ? (
              <Typography variant="rubikBody" sx={{ fontSize: 13, color: designSystem.surface.atlanticNavy }}>
                No math issues were found.
              </Typography>
            ) : (
              <MathIssueList issues={check.issues} whereOf={whereOf} controlsFor={controlsFor} />
            )}
          </Box>

          {check.issues.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: `${theme.sizing.space2}px`,
                padding: `${theme.sizing.space3}px ${theme.sizing.space4}px`,
                borderTop: `1px solid ${designSystem.foreground.greyAccent}`,
              }}
            >
              <Typography variant="rubikBody" sx={{ flex: 1, fontSize: 12, color: designSystem.surface.atlanticNavy }}>
                Tick an issue to regenerate it, or edit it by hand.
                {editCount > 0 && ` ${editCount} hand edit${editCount === 1 ? '' : 's'} will be written when you publish.`}
              </Typography>
              <button
                type="button"
                className="p2-btn"
                onClick={correct}
                disabled={selectedCount === 0 || isCorrecting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.sizing.space1,
                  fontWeight: 600,
                  color: designSystem.surface.white,
                  background: designSystem.status.errorStroke,
                  borderColor: designSystem.status.errorStroke,
                  opacity: selectedCount === 0 || isCorrecting ? 0.5 : 1,
                  cursor: selectedCount === 0 || isCorrecting ? 'default' : 'pointer',
                }}
              >
                {isCorrecting && <CircularProgress size={12} thickness={5} sx={{ color: designSystem.surface.white }} />}
                Regen{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </button>
            </Box>
          )}
        </>
      )}
    </AppModal>
  );
}
