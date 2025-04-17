import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';
import logoMini from './assets/images/logo-mini.png';

// dynamically change the favicon
const changeFavicon = (iconPath) => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.rel = 'icon';
  link.href = iconPath;
  document.head.appendChild(link);
};
changeFavicon(logoMini);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
