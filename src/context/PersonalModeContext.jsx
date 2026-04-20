import { createContext, useContext, useState, useEffect } from 'react';

const PersonalModeContext = createContext();

export function PersonalModeProvider({ children }) {
  const [isPersonalMode, setIsPersonalMode] = useState(() => {
    // Optionally persist the unlocked state in session/local storage
    // But for security, let's just keep it in memory for the session.
    return sessionStorage.getItem('personalMode') === 'true';
  });

  const unlockPersonalMode = (password) => {
    if (password === '14121999') {
      setIsPersonalMode(true);
      sessionStorage.setItem('personalMode', 'true');
      return true;
    }
    return false;
  };

  const lockPersonalMode = () => {
    setIsPersonalMode(false);
    sessionStorage.removeItem('personalMode');
  };

  return (
    <PersonalModeContext.Provider value={{ isPersonalMode, unlockPersonalMode, lockPersonalMode }}>
      {children}
    </PersonalModeContext.Provider>
  );
}

export function usePersonalMode() {
  return useContext(PersonalModeContext);
}
