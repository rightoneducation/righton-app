import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { splitMath } from '../lib/mathDelimiters';

/**
 * Renders a string that may contain LaTeX math expressions.
 * Supports:
 *   $$...$$ — display (block) math
 *   $...$   — inline math
 *   \[...\] — display (block) math
 *   \(...\) — inline math
 * Plain text between delimiters is rendered as-is. What counts as math (and
 * what is a price, like "$75 … $5") is decided by lib/mathDelimiters, the
 * parser the PDFs share.
 * Falls back to raw text if KaTeX cannot parse an expression.
 *
 * When `inline` is true, display math is forced inline (no block breaks)
 * and the output is wrapped in a single <span className={className}> so it
 * mirrors sibling spans in surrounding text (e.g. CCSS description pills).
 *
 * Ported from microcoach/prototype/src/components/MathText.js.
 */

interface MathTextProps {
  text: string | null | undefined;
  inline?: boolean;
  className?: string;
}

function MathText({ text, inline = false, className }: MathTextProps) {
  if (!text || typeof text !== 'string') return null;

  // Block mode returns the children bare so display math can break lines.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  const wrap = (children: React.ReactNode) => (inline ? <span className={className}>{children}</span> : <>{children}</>);

  const parts = splitMath(text);

  // No math found — return as plain text
  if (parts.length === 1 && parts[0].type === 'text') {
    return wrap(text);
  }

  return wrap(
    parts.map((part, i) => {
      // Parts are positional fragments of one string; index is the only stable key.
      const key = `${i}-${part.content.slice(0, 16)}`;
      if (part.type === 'text') return <span key={key}>{part.content}</span>;
      try {
        const displayMode = part.display && !inline;
        const html = katex.renderToString(part.content, {
          displayMode,
          throwOnError: false,
          strict: false,
        });
        return (
          <span
            key={key}
            className="math-text"
            style={displayMode ? { display: 'block', textAlign: 'center', margin: '8px 0' } : undefined}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={key}>{part.content}</span>;
      }
    }),
  );
}

export default MathText;
