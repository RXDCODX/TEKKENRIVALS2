import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/main.scss';

document.body.classList.add('loaded');

if (import.meta.env.DEV) {
  document.documentElement.classList.add('dev');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
