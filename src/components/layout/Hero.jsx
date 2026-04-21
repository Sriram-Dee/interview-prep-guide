import { useState } from 'react';
import { usePersonalMode } from '../../context/PersonalModeContext';
import { getTotalQuestions } from '../../data';

export default function Hero() {
  const total = getTotalQuestions();
  const [clickCount, setClickCount] = useState(0);
  const { isPersonalMode } = usePersonalMode();

  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setTimeout(() => setClickCount(0), 2000);

    if (newCount >= 5) {
      setClickCount(0);
      window.dispatchEvent(new Event('openSecretModal'));
    }
  };

  return (
    <section className="hero">
      <h1 onClick={handleTitleClick} style={{ userSelect: 'none', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        MERN Stack <span>Interview Guide</span>
        {isPersonalMode && (
          <span className="ghost-badge">
            <span role="img" aria-label="ghost">👻</span> Ghost Mode Active
          </span>
        )}
      </h1>
      <p className="subtitle">
        A comprehensive collection of {total}+ curated interview questions mainly focused on React and modern Frontend architecture, alongside essential Node.js and MongoDB concepts.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="num">{total}+</div>
          <div className="label">Questions</div>
        </div>
        <div className="hero-stat">
          <div className="num">13</div>
          <div className="label">Topics</div>
        </div>
      </div>
    </section>
  );
}
