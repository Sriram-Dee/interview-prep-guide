export default function TipCard({ item }) {
  return (
    <div className="tip-card">
      <h3>
        <span className="emoji">{item.emoji}</span>
        {item.title}
      </h3>

      {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}

      {item.script && (
        <div className="script-box" dangerouslySetInnerHTML={{ __html: item.script }} />
      )}

      {item.secondScript && (
        <div className="script-box" style={{ marginTop: '0.5rem' }} dangerouslySetInnerHTML={{ __html: item.secondScript }} />
      )}

      {item.items && (
        <ul>
          {item.items.map((it, i) => (
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
