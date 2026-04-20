import { usePersonalMode } from '../../context/PersonalModeContext';

export default function TipCard({ item }) {
  const { isPersonalMode } = usePersonalMode();

  // Choose content based on mode
  const currentScript = (isPersonalMode && item.personalScript) ? item.personalScript : item.genericScript || item.script;
  const currentSecondScript = (isPersonalMode && item.personalSecondScript) ? item.personalSecondScript : item.genericSecondScript || item.secondScript;
  const currentItems = (isPersonalMode && item.personalItems) ? item.personalItems : item.genericItems || item.items;

  return (
    <div className="tip-card">
      <h3>
        <span className="emoji">{item.emoji}</span>
        {item.title}
      </h3>

      {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}

      {currentScript && (
        <div className="script-box" dangerouslySetInnerHTML={{ __html: currentScript }} />
      )}

      {currentSecondScript && (
        <div className="script-box" style={{ marginTop: '0.5rem' }} dangerouslySetInnerHTML={{ __html: currentSecondScript }} />
      )}

      {currentItems && (
        <ul>
          {currentItems.map((it, i) => (
            <li key={i}>
              {it.bold && <strong>{it.bold}</strong>}
              {it.bold && it.text ? ' – ' : ''}
              {it.text}
            </li>
          ))}
        </ul>
      )}

      {item.doDont && (
        <div className="do-dont">
          <div className="do">{item.doDont.do}</div>
          <div className="dont">{item.doDont.dont}</div>
        </div>
      )}

      {item.warning && <div className="warning-box" style={{ marginTop: '0.75rem' }}>{item.warning}</div>}
    </div>
  );
}
