import { getTotalQuestions } from '../../data';

export default function Hero({ completedCount }) {
  const total = getTotalQuestions();
  const pct = total ? Math.round((completedCount / total) * 100) : 0;

  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="pulse" />
        MERN Interview Prep 2026
      </div>
      <h1>Interview Preparation Guide</h1>
      <p className="subtitle">
        Comprehensive MERN Stack interview guide with {total}+ questions
        covering React, Node.js, Express, MongoDB, WebSocket & more
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
        <div className="hero-stat">
          <div className="num">{completedCount}</div>
          <div className="label">Completed</div>
        </div>
        <div className="hero-stat">
          <div className="num">{pct}%</div>
          <div className="label">Progress</div>
        </div>
      </div>
    </section>
  );
}
