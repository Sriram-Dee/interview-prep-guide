import { useState, useCallback } from 'react';

export function useProgress() {
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('progress') || '{}');
    } catch {
      return {};
    }
  });

  const toggle = useCallback((id) => {
    setCompleted(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const count = Object.values(completed).filter(Boolean).length;

  return { completed, toggle, count };
}
