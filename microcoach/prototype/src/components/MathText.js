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
 */
function MathText({ text, inline = false, className }) {
  if (!text || typeof text !== 'string') return null;

  const wrap = (children) =>
    inline ? <span className={className}>{children}</span> : <>{children}</>;

  // Match $$...$$ before $...$ to avoid the outer $ consuming first.
  // Also support LaTeX/MathJax \[...\] (display) and \(...\) (inline) delimiters.
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    const isDisplay = token.startsWith('$$') || token.startsWith('\\[');
    // $...$ delimiters are 1 char each; $$ \[ \] \( \) are all 2 chars each.
    const trim = token.startsWith('$') && !token.startsWith('$$') ? 1 : 2;
    const math = token.slice(trim, -trim).trim();
    parts.push({ type: 'math', content: math, display: isDisplay });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  // No math found — return as plain text
  if (parts.length === 1 && parts[0].type === 'text') {
    return wrap(text);
  }

  return wrap(
    parts.map((part, i) => {
      if (part.type === 'text') return <span key={i}>{part.content}</span>;
      try {
        const displayMode = part.display && !inline;
        const html = katex.renderToString(part.content, {
          displayMode,
          throwOnError: false,
          strict: false,
        });
        return (
          <span
            key={i}
            style={displayMode ? { display: 'block', textAlign: 'center', margin: '8px 0' } : undefined}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={i}>{part.content}</span>;
      }
    })
  );
}

export default MathText;
