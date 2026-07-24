import { createRoot } from 'react-dom/client';
import { Site } from './Site.jsx';
import { de } from './content.js';
import './globals.css';

createRoot(document.getElementById('root')).render(<Site c={de} lang="de" />);
