import React, { useState, useRef } from 'react';
import MathText from './MathText';
import ReactDOM from 'react-dom';

function CcssHoverPill({ standard, description, learningComponents = [] }) {
  const pillRef = useRef(null);
  const [pos, setPos] = useState(null);

  const open = () => {
    if (!pillRef.current) return;
    const r = pillRef.current.getBoundingClientRect();
    const cardWidth = 320;
    const gap = 10;
    const leftPos = r.left - cardWidth - gap;
    setPos({
      top: r.top + r.height / 2,
      left: leftPos >= 0 ? leftPos : r.right + gap,
    });
  };

  const close = () => setPos(null);

  return (
    <span
      ref={pillRef}
      className="ccss-tag target-objective yns-standard-pill"
      tabIndex={0}
      style={{ maxWidth: 'none', overflow: 'visible', textOverflow: 'unset' }}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {standard}
      {pos && ReactDOM.createPortal(
        <div
          className="yns-standard-hover-card"
          role="tooltip"
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translateY(-50%)',
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <MathText className="standard-hover-title" text={description || standard} />
          <div className="yns-standard-hover-subtitle">Related Learning Components</div>
          <div className="yns-kg-diagram" aria-label={`Relationship diagram for ${standard}`}>
            <span className="ccss-tag target-objective yns-kg-standard-node">{standard}</span>
            <div className="yns-kg-right">
              {learningComponents.slice(0, 3).map((component) => (
                <div key={component} className="yns-kg-row">
                  <span className="yns-kg-link" aria-hidden="true" />
                  <span className="yns-kg-component-node">{component}</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}

export default CcssHoverPill;
