import { useState, useMemo, useCallback, useEffect } from 'react';
import Hero from './components/layout/Hero';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import QACard from './components/ui/QACard';
import TipCard from './components/ui/TipCard';
import { SECTION_META } from './constants';
import { questionSections, behavioralData, negotiationData, getTotalQuestions } from './data';
import { useProgress } from './hooks/useProgress';
import { useImportant } from './hooks/useImportant';

export default function App() {
  const [activeSection, setActiveSection] = useState('react-basics');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { completed, toggle, count } = useProgress();
  const { important, toggleImportant, importantCount } = useImportant();

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Progress bar
  useEffect(() => {
    const bar = document.querySelector('.progress-bar');
    if (bar) {
      const total = getTotalQuestions();
      bar.style.width = total ? `${(count / total) * 100}%` : '0%';
    }
  }, [count]);

  // Change section and scroll up
  const handleSectionChange = useCallback((id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate search-filtered items
  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    const results = [];
    for (const [sectionId, questions] of Object.entries(questionSections)) {
      for (const q of questions) {
        if (
          q.question.toLowerCase().includes(term) ||
          (q.simple && q.simple.toLowerCase().includes(term))
        ) {
          results.push({ ...q, _section: sectionId });
        }
      }
    }
    return results;
  }, [searchTerm]);

  const importantQuestions = useMemo(() => {
    if (activeSection !== 'important') return null;
    const results = [];
    for (const [sectionId, questions] of Object.entries(questionSections)) {
      for (const q of questions) {
        if (important[q.id]) {
          results.push({ ...q, _section: sectionId });
        }
      }
    }
    return results;
  }, [activeSection, important]);

  const meta = SECTION_META[activeSection];
  const isQASection = Boolean(questionSections[activeSection]);

  return (
    <>
      <div className="progress-bar" />
      <Hero completedCount={count} />
      <MobileNav activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="app-layout">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          importantCount={importantCount}
        />
        <main className="main-content">
          {/* Search Results */}
          {filteredQuestions ? (
            <div>
              <div className="section-head">
                <div className="overline">Search Results</div>
                <h2>Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}</h2>
                <p>Showing results for "{searchTerm}"</p>
              </div>
              {filteredQuestions.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No questions found. Try different keywords.
                </p>
              )}
              {filteredQuestions.map((item) => (
                <QACard 
                  key={item.id} 
                  item={item} 
                  isImportant={important[item.id]} 
                  onToggleImportant={toggleImportant} 
                />
              ))}
            </div>
          ) : (
            <>
              {/* Q&A Sections */}
              {isQASection && meta && (
                <div className="section active" style={{ display: 'block' }}>
                  <div className="section-head">
                    <div className="overline">{meta.overline}</div>
                    <h2>{meta.title}</h2>
                    <p>{meta.description}</p>
                  </div>
                  {questionSections[activeSection].map((item) => (
                    <QACard 
                      key={item.id} 
                      item={item} 
                      isImportant={important[item.id]} 
                      onToggleImportant={toggleImportant} 
                    />
                  ))}
                </div>
              )}

              {/* Important Section */}
              {activeSection === 'important' && importantQuestions && (
                <div className="section active" style={{ display: 'block' }}>
                  <div className="section-head">
                    <div className="overline">{SECTION_META.important.overline}</div>
                    <h2>{SECTION_META.important.title}</h2>
                    <p>{SECTION_META.important.description}</p>
                  </div>
                  {importantQuestions.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                      You haven't marked any questions as important yet. Click the star icon on any question to add it here.
                    </p>
                  )}
                  {importantQuestions.map((item) => (
                    <QACard 
                      key={item.id} 
                      item={item} 
                      isImportant={important[item.id]} 
                      onToggleImportant={toggleImportant} 
                    />
                  ))}
                </div>
              )}

              {/* Behavioral Section */}
              {activeSection === 'behavioral' && (
                <div className="section active" style={{ display: 'block' }}>
                  <div className="section-head">
                    <div className="overline">{SECTION_META.behavioral.overline}</div>
                    <h2>{SECTION_META.behavioral.title}</h2>
                    <p>{SECTION_META.behavioral.description}</p>
                  </div>
                  {behavioralData.map((item, i) => (
                    <TipCard key={i} item={item} />
                  ))}
                </div>
              )}

              {/* Negotiation Section */}
              {activeSection === 'negotiation' && (
                <div className="section active" style={{ display: 'block' }}>
                  <div className="section-head">
                    <div className="overline">{SECTION_META.negotiation.overline}</div>
                    <h2>{SECTION_META.negotiation.title}</h2>
                    <p>{SECTION_META.negotiation.description}</p>
                  </div>
                  {negotiationData.map((item, i) => (
                    <TipCard key={i} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Scroll to top button */}
      <button
        className={`scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}
