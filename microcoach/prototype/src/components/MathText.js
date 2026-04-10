import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that may contain LaTeX math expressions.
 * Supports:
 *   $$...$$ — display (block) math
 *   $...$   — inline math
 * Plain text between delimiters is rendered as-is.
 * Falls back to raw text if KaTeX cannot parse an expression.
 */
function MathText({ text }) {
  if (!text || typeof text !== 'string') return null;

  // Match $$...$$ before $...$ to avoid the outer $ consuming first
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const isDisplay = match[0].startsWith('$$');
    const math = isDisplay ? match[0].slice(2, -2).trim() : match[0].slice(1, -1).trim();
    parts.push({ type: 'math', content: math, display: isDisplay });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  // No math found — return as plain text
  if (parts.length === 1 && parts[0].type === 'text') {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'text') return <span key={i}>{part.content}</span>;
        try {
          const html = katex.renderToString(part.content, {
            displayMode: part.display,
            throwOnError: false,
            strict: false,
          });
          return (
            <span
              key={i}
              style={part.display ? { display: 'block', textAlign: 'center', margin: '8px 0' } : undefined}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={i}>{part.content}</span>;
        }
      })}
    </>
  );
}

export default MathText;
