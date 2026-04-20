import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { PersonalModeProvider } from './context/PersonalModeContext';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonalModeProvider>
      <App />
    </PersonalModeProvider>
  </StrictMode>
);
