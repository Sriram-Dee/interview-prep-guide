import { useState, useEffect, useRef } from 'react';
import { usePersonalMode } from '../../context/PersonalModeContext';

export default function SecretModal({ onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const { isPersonalMode, unlockPersonalMode, lockPersonalMode } = usePersonalMode();

  useEffect(() => {
    // Focus automatically
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = unlockPersonalMode(password);
    if (success) {
      onClose();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
        {isPersonalMode ? (
          <>
            <h2>Ghost Mode Active 👻</h2>
            <p>Your personalized interview scripts and tips are currently visible.</p>
            <div className="modal-actions full-width">
              <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
              <button 
                type="button" 
                className="btn-submit btn-lock" 
                onClick={() => {
                  lockPersonalMode();
                  onClose();
                }}
              >
                Go Public (Lock)
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Access Personalized Data</h2>
            <p>Enter your DOB to unlock your personalized interview answers.</p>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="password"
                placeholder="DDMMYYYY"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={error ? 'error' : ''}
              />
              {error && <div className="error-msg">Incorrect Date of Birth.</div>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit">Unlock</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
