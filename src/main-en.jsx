import { createRoot } from 'react-dom/client';
import { Site } from './Site.jsx';
import { en } from './content.js';
import './globals.css';

createRoot(document.getElementById('root')).render(<Site c={en} lang="en" />);
