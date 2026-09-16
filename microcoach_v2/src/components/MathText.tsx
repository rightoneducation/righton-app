import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that may contain LaTeX math expressions.
 * Supports:
 *   $$...$$ — display (block) math
 *   $...$   — inline math
 *   \[...\] — display (block) math
 *   \(...\) — inline math
 * Plain text between delimiters is rendered as-is.
 * Falls back to raw text if KaTeX cannot parse an expression.
 *
 * When `inline` is true, display math is forced inline (no block breaks)
 * and the output is wrapped in a single <span className={className}> so it
 * mirrors sibling spans in surrounding text (e.g. CCSS description pills).
 *
 * Ported from microcoach/prototype/src/components/MathText.js.
 */

type Part = { type: 'text'; content: string } | { type: 'math'; content: string; display: boolean };

// Match $$...$$ before $...$ to avoid the outer $ consuming first.
// Also support LaTeX/MathJax \[...\] (display) and \(...\) (inline) delimiters.
const DELIMITERS = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(DELIMITERS.source, 'g');

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    const isDisplay = token.startsWith('$$') || token.startsWith('\\[');
    // $...$ delimiters are 1 char each; $$ \[ \] \( \) are all 2 chars each.
    const trim = token.startsWith('$') && !token.startsWith('$$') ? 1 : 2;
    parts.push({ type: 'math', content: token.slice(trim, -trim).trim(), display: isDisplay });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

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

MathText.defaultProps = { inline: false, className: undefined };

export default MathText;
