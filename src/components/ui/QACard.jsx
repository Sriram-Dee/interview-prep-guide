import { useState, useCallback } from 'react';
import { CodeBlock, ComparisonTable } from './CodeBlock';
import { usePersonalMode } from '../../context/PersonalModeContext';

export default function QACard({ item, isImportant, onToggleImportant }) {
  const { isPersonalMode } = usePersonalMode();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(o => !o), []);

  const diff = item.difficulty || 'basics';

  return (
    <div className={`qa-card${open ? ' open' : ''}`} id={`qa-${item.id}`}>
      <div className="qa-question" onClick={toggle}>
        <div className={`q-icon ${diff}`}>
          {diff === 'basics' && '📗'}
          {diff === 'intermediate' && '📘'}
          {diff === 'advanced' && '📕'}
          {diff === 'expert' && '📙'}
        </div>
        <h3>{item.question}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span className={`diff-badge diff-${diff}`} style={{ margin: 0 }}>{diff}</span>
          <button 
            className={`star-btn ${isImportant ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant?.(item.id);
            }}
            title={isImportant ? "Mark as un-important" : "Mark as important"}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: isImportant ? 'var(--accent)' : 'var(--text-muted)',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            {isImportant ? '★' : '☆'}
          </button>
          <span className="chevron" style={{ marginLeft: '0.25rem' }}>▼</span>
        </div>
      </div>
      <div className="qa-answer">
        <div className="qa-answer-inner">
          {item.simple && (
            <div className="simple-answer" dangerouslySetInnerHTML={{ __html: markBold(item.simple) }} />
          )}

          {item.detailed && item.detailed.length > 0 && (
            <>
              <div className="detailed-label">Detailed Explanation</div>
              {item.detailed.map((para, i) => <p key={i}>{para}</p>)}
            </>
          )}

          {item.points && item.points.length > 0 && (
            <ul>
              {item.points.map((pt, i) => (
                <li key={i}>
                  {pt.bold && <strong>{pt.bold}</strong>}
                  {pt.bold && pt.text ? ' – ' : ''}
                  {pt.text}
                </li>
              ))}
            </ul>
          )}

          {item.afterPoints && <p>{item.afterPoints}</p>}

          {item.table && (
            <ComparisonTable headers={item.table.headers} rows={item.table.rows} />
          )}

          {item.code && <CodeBlock code={item.code} />}

          {/* Public Tip */}
          {item.tip && <div className="tip-box">{item.tip}</div>}

          {/* Personal Hidden Tip (only visible in Personal Mode) */}
          {isPersonalMode && item.personalTip && (
            <div className="personal-tip-box" style={{ 
              background: 'rgba(56, 189, 248, 0.1)', 
              border: '1px dashed var(--accent)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              marginTop: '1rem', 
              color: 'var(--accent)', 
              fontSize: '0.9rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '1.1rem' }}>💡</span>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--accent-light)' }}>Personal Strategy:</strong>
                {item.personalTip}
              </div>
            </div>
          )}

          {item.warning && <div className="warning-box">{item.warning}</div>}
        </div>
      </div>
    </div>
  );
}

function markBold(text) {
  return text
    .replace(/NOT/g, '<strong>NOT</strong>')
    .replace(/MUST/g, '<strong>MUST</strong>')
    .replace(/ONLY/g, '<strong>ONLY</strong>')
    .replace(/FROM\s+parent\s+TO\s+child/g, '<strong>FROM parent TO child</strong>')
    .replace(/WITHIN/g, '<strong>WITHIN</strong>');
}
