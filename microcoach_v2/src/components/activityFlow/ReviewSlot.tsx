import React from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

/**
 * An optional review layer over the activity views (BeforeClassView,
 * FacilitateView and its panels, DiscussionView).
 *
 * Each piece of generated text those views draw is wrapped in a ReviewSlot that
 * names where the text comes from: its path in the activity, as the math check
 * names it ("content.facilitate.examples[1].steps[2].text"). With no
 * ReviewContext provider — the teacher's ActivityFlow pages and /preview — a
 * slot renders its children and nothing else, so those pages are unchanged.
 * /prepublishreview provides one: a slot whose text has issues gets a red
 * outline with the issues' panels (Regen tick box, working, Edit) right under
 * it. The panels come from the provider, so this file knows nothing about
 * what an issue is.
 */
export interface ReviewLayer {
  // How many issues sit at any of these paths.
  issueCount: (paths: string[]) => number;
  // How many issues sit at or under this path (a whole example, a Watch for card).
  countUnder: (prefix: string) => number;
  // The panels for the issues at these paths, drawn under the text.
  renderPanels: (paths: string[]) => React.ReactNode;
}

export const ReviewContext = React.createContext<ReviewLayer | null>(null);

export const useReviewLayer = (): ReviewLayer | null => React.useContext(ReviewContext);

const asList = (paths: string | string[]) => (Array.isArray(paths) ? paths : [paths]);

/**
 * Wraps one piece of generated text. `paths` is the text's own path, plus the
 * paths of anything drawn with it (a line's status mark, a step's annotation),
 * so an issue on either shows here.
 */
export function ReviewSlot({ paths, children }: { paths: string | string[]; children: React.ReactNode }) {
  const layer = useReviewLayer();
  const list = asList(paths);
  // The fragment only makes `children` (text, a list) one element: nothing is added to the page.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!layer || layer.issueCount(list) === 0) return <>{children}</>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flex: 1 }}>
      {/* The text in question, washed in translucent red; the panel under it carries the border. */}
      <Box
        sx={(theme) => ({
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.designSystem.status.errorStroke, 0.15),
        })}
      >
        {children}
      </Box>
      {layer.renderPanels(list)}
    </Box>
  );
}

/**
 * For places that can only take a mark, such as an example tile (a button):
 * a red count of the issues at or under `prefix`, or nothing.
 */
export function ReviewCountFlag({ prefix }: { prefix: string }) {
  const layer = useReviewLayer();
  const count = layer?.countUnder(prefix) ?? 0;
  if (count === 0) return null;
  return (
    <Box
      component="span"
      sx={{
        alignSelf: 'flex-start',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.05em',
        color: 'designSystem.status.errorStroke',
        backgroundColor: 'designSystem.status.error',
        border: '1px solid',
        borderColor: 'designSystem.status.errorStroke',
        borderRadius: 1,
        px: 1,
      }}
    >
      {count} math issue{count === 1 ? '' : 's'}
    </Box>
  );
}
