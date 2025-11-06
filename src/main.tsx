
import { createRoot } from 'react-dom/client';
import { initializeSentry } from './config/sentry.config';
import App from './App.tsx';
import './index.css';

// Initialize Sentry error monitoring
initializeSentry();

createRoot(document.getElementById("root")!).render(<App />);
