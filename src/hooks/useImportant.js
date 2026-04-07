import { useState, useCallback } from 'react';

export function useImportant() {
  const [important, setImportant] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('important') || '{}');
    } catch {
      return {};
    }
  });

  const toggleImportant = useCallback((id) => {
    setImportant(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      localStorage.setItem('important', JSON.stringify(next));
      return next;
    });
  }, []);

  const importantCount = Object.keys(important).length;

  return { important, toggleImportant, importantCount };
}
